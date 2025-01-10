from pydantic import BaseModel
from pymongo import MongoClient
from mongo_service import save_chat_to_mongodb, fetch_chat_from_mongodb
from fastapi import FastAPI, HTTPException, Depends, requests
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from chatbot import chain_with_memory
from fastapi.security import OAuth2PasswordBearer
from werkzeug.security import generate_password_hash, check_password_hash
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain



url = ["http://localhost:8000/ask", "http://localhost:8000/login", "http://localhost:8000/signup", "http://localhost:8000/chats"]
# MongoDB connection
connection_string = "mongodb://localhost:27017"
client = MongoClient(connection_string)
db = client["mentalhealth"]
users_collection = db["users"]
chats_collection = db["chats"]

# JWT Secret Key and Algorithm
SECRET_KEY = "hdye83*gT$7yh@4G#8!3"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# FastAPI setup
app = FastAPI()

# OAuth2 Password Bearer (for token-based authentication)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class Question(BaseModel):
    question: str

class Message(BaseModel):
    role: str
    content: str
    timestamp: str


class Chat(BaseModel):
    user_id: str
    chat_name: str
    messages: List[Message]


class ResponseModel(BaseModel):
    data: List[Chat]

app = FastAPI()

app.add_middleware(
    CORSMiddleware
    , allow_origins =["*"]
    , allow_methods = ["*"]
    , allow_headers = ["*"]
)

def format_response(response):
    """
    Format the response with Markdown-style bullet points.
    """
    if "\n" in response:
        # Split the response into lines and add bullet points
        lines = response.split("\n")
        formatted_response = "\n".join(f" {line}" for line in lines)
        return formatted_response
    return response

# Decode JWT token and extract user_id
def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

@app.post("/ask")
def handle_question(input: Question, token: str = Depends(oauth2_scheme)):
    try:
        if (input):
            user_id = get_current_user(token)  # Get current user's ID from token
        
            # Save User Question to MongoDB
            save_chat_to_mongodb(user_id, "user", input.question)
            
            # Response generator to stream chunks
            def response_stream():
                response_generator = chain_with_memory.stream(
                    {"query": input.question},
                    config={"configurable": {"session_id": user_id}})
                response = ""
                for chunk in response_generator:
                    response += chunk
                    yield format_response(chunk)  # Send each chunk to the client
                save_chat_to_mongodb(user_id, "assistant", response)  # Save the full response once streaming completes
            
            return StreamingResponse(response_stream(), media_type="text/plain")

        else:
            return JSONResponse(content={"response": "No question provided."})
    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error handling question: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return check_password_hash(hashed_password, plain_password)

def get_user(email: str):
    return users_collection.find_one({"email": email})

# Sign-up Route
@app.post("/signup")
async def sign_up(user: User):
    hashed_password = generate_password_hash(user.password)
    if get_user(user.email):
        raise HTTPException(status_code=400, detail="User already exists.")
    users_collection.insert_one({"firstname": user.firstname, "lastname": user.lastname, "email": user.email, "password": hashed_password})
    return {"message": "Sign-up successful. Please sign in."}

# Login Route (Generate token)
@app.post("/login")
async def login_for_access_token(user: Login):
    db_user = get_user(user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"accessToken": access_token, 
            "token_type": "Bearer", 
            "firstname": db_user["firstname"],
            "lastname": db_user["lastname"],
            "email": db_user["email"]
                # Add other fields you want to return here
        }

@app.get("/chats", response_model=ResponseModel)
async def get_chat_history(token: str = Depends(oauth2_scheme)):
    """
    Fetch chat history for a specific user from MongoDB.
    """
    try:
        user_id = get_current_user(token)
        chats = list(chats_collection.find({"user_id": user_id}).sort("timestamp", 1))

        if not chats:
            raise HTTPException(status_code=404, detail="No chats found for this user")

        # Prepare the chat data
        chat_history = [
            {
                "user_id": chat["user_id"],
                "chat_name": chat["chat_name"],
                "messages": [
                    {
                        "role": message["role"],
                        "content": message["content"],
                        "timestamp": message.get("timestamp", "").isoformat() if "timestamp" in message else None
                    }
                    for message in chat.get("messages", [])
                ],
            }
            for chat in chats
        ]

        return {"data": chat_history}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")