const TypingIndicator = () => {
    return (
        <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
        </div>
    );
};
export default TypingIndicator;