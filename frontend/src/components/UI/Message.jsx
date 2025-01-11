import ReactMarkdown from "react-markdown";

const Message = ({ sender, text }) => {
    const isUser = sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {isUser ? (
            <div className="flex items-center space-x-2">
                <i className="fas fa-user text-blue-500" />
                <div className='max-w-xs px-4 py-2 rounded-lg bg-blue-500 text-white'>
                    {text}
                </div>
            </div>
        ) : (
            <div className="flex items-center space-x-2">
                <i className="fas fa-robot text-black" />
                <div className='max-w-screen-lg px-4 py-2 rounded-lg bg-black text-white'>
                    <ReactMarkdown>
                        {text}
                    </ReactMarkdown>
                </div>
            </div>
        )}
        </div>
    );
};
export default Message;