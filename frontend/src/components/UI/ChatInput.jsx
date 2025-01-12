import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ChatInput = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <p>Speech recognition is not supported in this browser.</p>;
    }
    
    const startlistening =()=> {
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        setIsListening(true);
    };
    const stoplistening =()=> {
        SpeechRecognition.stopListening();
        setIsListening(false);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevent new line on Enter
            handleSend(inputValue);
            setInputValue('');
        }
    };

    const handleSend = () => {
        const messageToSend = inputValue.trim() || transcript.trim();
        if (messageToSend) {
            onSend(messageToSend); // Send message
            setInputValue('');
            resetTranscript();
        }
    };

    return (
        <div className="flex items-center space-x-2">
        <textarea
            type="text"
            placeholder="Type a question..."
            className="flex-1 px-4 py-2 bg-gray-100 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden"
            value={inputValue || transcript}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ resize: "none", height: "50px", lineHeight: "30px" }}
        />
        {isListening ? (
            <button onClick={stoplistening}>
                <i className="fas fa-stop p-2 bg-gray-300 text-gray-700 rounded-lg" />
            </button>
        ) : (
            <button onClick={startlistening}>
                <i className="fas fa-microphone p-2 bg-blue-500 text-white rounded-lg" />
            </button>
        )}
        <button
            onClick={handleSend}
            className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
            Send
        </button>
        </div>
    );
};
export default ChatInput;