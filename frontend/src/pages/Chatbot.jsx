import { useEffect, useState, useRef } from 'react';
import ChatInput from '../components/UI/ChatInput';
import ChatWindow from '../components/UI/ChatWindow';
import usePersistedUserState from '../components/UI/persistedHook';
import TypingIndicator from '../components/UI/Typing';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [user] = usePersistedUserState("userInfo", null);
    const token = user?.accessToken;
    const chatWindowRef = useRef(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ text: "Hi! How are you? 👋🏼", fromUser: false },
                { text: "How's you feeling today? Share your thoughts or emotions! 😊", fromUser: false },
            ]);
        }
    }, [messages]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        const savedMessages = userInfo.chatMessages || [];
        setMessages(savedMessages);
    }, []);

    // Save messages to userInfo whenever they change
    useEffect(() => {
        const saveMessages = () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
            userInfo.chatMessages = messages; // Update chatMessages in userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        };
        const debounceSave = setTimeout(saveMessages, 300); // Debounce by 300ms
        return () => clearTimeout(debounceSave);
    }, [messages]);

    const handleSend = async (question) => {
        const userMessage = { sender: 'user', text: question };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        await fetchChatResponse(question); // API call
        setIsTyping(false);
    };

    const fetchChatResponse = async (question) => {
        try {
            const response = await fetch(`${BACKEND_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ question }),
            });
            if (!response.body) {
                throw new Error("No response body received");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let botMessage = "";
            let isBotMessageAdded = false;
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                botMessage += decoder.decode(value, { stream: true });
                // Check if the bot message is not already added
                if (!isBotMessageAdded) {
                    setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
                    isBotMessageAdded = true; // Mark as added
                } else {
                    // Update the last message
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        const updatedMessage = { ...lastMessage, text: botMessage };
                        return [...prev.slice(0, -1), updatedMessage]; // Update last bot message
                    });
                }
            }
            return botMessage; // Final complete response
        } catch (error) {
            console.error('Error fetching response:', error);
            return 'Sorry, something went wrong.';
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
            <div className='flex'>
                <div className="container mx-auto flex flex-col h-[81vh]">
                    <div className="flex-1 overflow-y-auto p-4" ref={chatWindowRef}>
                        <ChatWindow messages={messages} />
                        {isTyping && <TypingIndicator />}
                    </div>
                    <div className="p-4 bg-gray-200 shadow-md rounded-2xl">
                        <ChatInput onSend={handleSend} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
