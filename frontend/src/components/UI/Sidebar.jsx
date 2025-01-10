import axios from 'axios';
import { useEffect, useState } from 'react';
import usePersistedUserState from './persistedHook';

const Sidebar = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState(null);  // To store error message
    const [loading, setLoading] = useState(true);  // To show loading state
    const [user] = usePersistedUserState("userInfo", null);
    const token = user?.accessToken;

    useEffect(() => {
        // Fetch chat history when the component mounts
        const fetchChatHistory = async () => {
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/chats`,
                //  // Add headers to the request
                {
                    headers: { Authorization: `Bearer ${token}` }  // Send token in the Authorization header
                });
                setChatHistory(response.data.data); // Assuming response.data contains chat history
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();
    }, [token]);

    const handleChatClick = (chatName) => {
        // Handle chat click and display the selected chat's details
        console.log(`Displaying chat: ${chatName}`);
        // You can use `chatName` to fetch specific chat history or open it
    };

    return (
        <div className="w-80 h-full p-4 bg-gray-800 text-white fixed top-0 left-0">
            <h2 className="text-2xl font-bold mb-4">Chat History</h2>
            {loading ? (
                <p>Loading...</p>  // Loading message
            ) : error ? (
                <p className="text-red-500">{error}</p>  // Display error message
            ) : (
                <ul className="space-y-4">
                {chatHistory.map((chat) => (
                    <li
                        key={chat.chat_name}
                        onClick={() => handleChatClick(chat.chat_name)}
                        className="cursor-pointer p-2 rounded hover:bg-gray-700"
                    >
                        <div className="flex justify-between items-center">
                            <span>{chat.chat_name}</span>
                            <span className="text-sm text-gray-400">
                                {/* Use the first message timestamp if messages exist */}
                                {chat.messages?.length > 0
                                    ? new Date(chat.messages[0].timestamp).toLocaleString()
                                    : "No messages"}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
};

export default Sidebar;