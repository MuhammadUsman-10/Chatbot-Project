# Chatbot-Project

## Project Overview
This Chatbot is developed to assist people to feel good while sharing their feelings, emotions, their life experiences, if having some bad thoughts or some positive thoughts, it can provide support in that. Basically, the obejctive behind developing this chatbot was to help people who feel low, or overwhelmed in their lives due to the bad life experiences they had in their life due to which they feel stress, have tensions & depression or anxiety problems.

The Project is developed using **React.js**, **MongoDB**, **Python**, **OpenAI**, **langchain**, and **chromaDB**. The Model is being fine-tuned on the provided JSON format data and generates response based on the similarity search between stored emeddings and the user input.

## Project Members
1. Washma Tabassum - 21pwbcs0829
2. Muhammad Usman - 21pwbcs0848

## Project Setup
### Backend
- goto backend folder using command: "**cd backend**"
- create the environment by the following command:
"**python -m venv env**"
- activate the environment using command: "**env\scripts\activate**" if using cmd in windows.
- if using powershell, then try using command: "**env\scripts\activate.ps1**" for activation of environment.
- install the mentioned dependencies mentioned in requirements.txt file by using the command: "**pip install -r requirements.txt**"
- create a file named "**.env**" and add your **OPENAI_API_KEY** in it.
- run the backend server by using command: "**uvicorn chatbot_api:app**"

### Frontend
- goto frontend folder using command: "**cd frontend**"
- install all the node modules by: "**npm i**"
- run the frontend server using command: "**npm run dev**"

### Database - MongoDB
- install mongoDB, if not installed
- connect mongoDB with the chatbot
- enjoy 😁


#### Note: This Project is under MIT Licence. So, if anyone wants to add features or want to contribute, create a PR for your input and will be then merged if found useful. 
#### If found some issues in current release, please raise in issue and create a PR for it.

### Thank You Everyone!
