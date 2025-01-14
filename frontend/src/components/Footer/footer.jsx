const Footer = () => {
    const date = new Date();
    return (
        <> 
        <div className="items-center justify-center text-center bg-gray-100 p-4">
            <p>&copy; Mental Health Chatbot. All rights reserved. {date.getFullYear()}</p>
        </div>
        </>
    );
};

export default Footer;
