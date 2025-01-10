import { useEffect, useState } from 'react';
import ChatInput from '../components/UI/ChatInput';
import ChatWindow from '../components/UI/ChatWindow';
import usePersistedUserState from '../components/UI/persistedHook';
import TypingIndicator from '../components/UI/Typing';
import Sidebar from '../components/UI/Sidebar';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [user] = usePersistedUserState("userInfo", null);
    const token = user?.accessToken;

    // Load messages from localStorage on refresh
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        setMessages(savedMessages);
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        const saveMessages = () => {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
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
            const response = await fetch('http://localhost:8000/ask', {
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
        <div className="bg-gray-100">
            <div className='flex'>
                {/* <Sidebar /> */}
                <div className="container mx-auto flex flex-col h-screen">
                    <div className="flex-1 overflow-y-auto p-4">
                        <ChatWindow messages={messages} />
                        {/* {isTyping && <div className="text-gray-500 italic">Bot is typing...</div>} */}
                        {isTyping && <TypingIndicator />}
                    </div>
                    <div className="p-4 bg-white shadow-md rounded-2xl">
                        <ChatInput onSend={handleSend} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
