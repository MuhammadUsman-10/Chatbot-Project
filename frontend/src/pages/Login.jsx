// import { FaGoogle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import usePersistedUserState from '../components/UI/persistedHook';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user] = usePersistedUserState("userInfo", null);
    const token = user?.accessToken;
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/login',
            {email,password},
        ).then((response) => {
            console.log(response);
            const userInfo = {
                ...response.data,
                expiresAt: new Date().getTime() + response.data.expires_in * 1000};
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            // Set a timer to auto logout or refresh token
            setAutoLogoutTimer(userInfo.expiresAt);
            if (response.status === 200) {
                navigate('/chatbot');
                alert('Login successful');
                window.location.reload();
            }
        }).catch ((error) => {
            console.log(error);
            alert('Invalid email or password');
        });    
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post('http://localhost:8000/refresh-token', {token});
            const userInfo = {
                ...response.data,
                expiresAt: new Date().getTime() + response.data.expires_in * 1000,
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setAutoLogoutTimer(userInfo.expiresAt); // Reset the timer
        } catch (error) {
            console.log(error);
            handleLogout(); // Logout if token refresh fails
        }
    };

    useEffect(() => {
        if (user && user.expiresAt) {
            const currentTime = new Date().getTime();
            if (currentTime > user.expiresAt) {
                handleLogout(); // Logout if token is expired
            } else {
                setAutoLogoutTimer(user.expiresAt); // Set timer for auto logout
            }
        }
    }, []);

    const setAutoLogoutTimer = (expiresAt) => {
        const currentTime = new Date().getTime();
        const timeLeft = expiresAt - currentTime;
    
        if (timeLeft > 0) {
            // Refresh token 5 minutes before expiry
            const refreshTime = timeLeft - 5 * 60 * 1000; // 5 minutes before expiry
            if (refreshTime > 0) {
                setTimeout(() => {
                    refreshToken(); // Call refresh token function
                }, refreshTime);
            }
    
            // Auto logout when token expires
            setTimeout(() => {
                handleLogout();
            }, timeLeft);
        }
    };

    useEffect(() => {
        const handleUserActivity = () => {
            if (user && user.expiresAt) {
                const currentTime = new Date().getTime();
                const timeLeft = user.expiresAt - currentTime;
    
                // Refresh token if less than 5 minutes are left
                if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
                    refreshToken();
                }
            }
        };
    
        // Add event listeners for user activity
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
    
        // Cleanup event listeners
        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/login');
        window.location.reload();
    };
    
    return (
        <div className="bg-white relative lg:py-1">
            <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-0 mr-auto mb-0 ml-auto max-w-7xl
                xl:px-5 lg:flex-row">
                <div className="flex flex-col items-center w-full pt-5 pr-10 pb-20 pl-10 lg:pt-20 lg:flex-row">
                    <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
                        <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                            <img src="https://res.cloudinary.com/macxenon/image/upload/v1631570592/Run_-_Health_qcghbu.png" className="btn-"/>
                        </div>
                    </div>
                <div className="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
                    <div className="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl
                        relative z-10">
                        <p className="w-full text-4xl font-medium text-center leading-snug font-serif">Sign In to Your account</p>
                        <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                            <div className="relative">
                                <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Email</p>
                                <input placeholder="123@ex.com" type="text" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border placeholder-gray-400 focus:outline-none
                                    focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                    border-gray-300 rounded-md"/>
                            </div>
                            <div className="relative">
                                <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                                    absolute">Password</p>
                                <input placeholder="Password" type="password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border placeholder-gray-400 focus:outline-none
                                    focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                    border-gray-300 rounded-md"/>
                            </div>
                        <div className="relative">
                            <button className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500
                            rounded-lg transition duration-200 hover:bg-indigo-600 ease" onClick={onSubmit}>Submit</button>
                        </div>
                        <div className="relative">
                            <Link className="w-full inline-block text-lg" to='/register'
                            >Don&apos; have an account? <span className="underline font-medium">Sign Up</span></Link>
                        </div>
                    </div>
                    </div>
                    <svg viewBox="0 0 91 91" className="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-yellow-300
                        fill-current"><g stroke="none" strokeWidth="1" fillRule="evenodd"><g fillRule="nonzero"><g><g><circle
                        cx="3.261" cy="3.445" r="2.72"/><circle cx="15.296" cy="3.445" r="2.719"/><circle cx="27.333" cy="3.445"
                        r="2.72"/><circle cx="39.369" cy="3.445" r="2.72"/><circle cx="51.405" cy="3.445" r="2.72"/><circle cx="63.441"
                        cy="3.445" r="2.72"/><circle cx="75.479" cy="3.445" r="2.72"/><circle cx="87.514" cy="3.445" r="2.719"/></g><g
                        transform="translate(0 12)"><circle cx="3.261" cy="3.525" r="2.72"/><circle cx="15.296" cy="3.525"
                        r="2.719"/><circle cx="27.333" cy="3.525" r="2.72"/><circle cx="39.369" cy="3.525" r="2.72"/><circle
                        cx="51.405" cy="3.525" r="2.72"/><circle cx="63.441" cy="3.525" r="2.72"/><circle cx="75.479" cy="3.525"
                        r="2.72"/><circle cx="87.514" cy="3.525" r="2.719"/></g><g transform="translate(0 24)"><circle cx="3.261"
                        cy="3.605" r="2.72"/><circle cx="15.296" cy="3.605" r="2.719"/><circle cx="27.333" cy="3.605" r="2.72"/><circle
                        cx="39.369" cy="3.605" r="2.72"/><circle cx="51.405" cy="3.605" r="2.72"/><circle cx="63.441" cy="3.605"
                        r="2.72"/><circle cx="75.479" cy="3.605" r="2.72"/><circle cx="87.514" cy="3.605" r="2.719"/></g><g
                        transform="translate(0 36)"><circle cx="3.261" cy="3.686" r="2.72"/><circle cx="15.296" cy="3.686"
                        r="2.719"/><circle cx="27.333" cy="3.686" r="2.72"/><circle cx="39.369" cy="3.686" r="2.72"/><circle
                        cx="51.405" cy="3.686" r="2.72"/><circle cx="63.441" cy="3.686" r="2.72"/><circle cx="75.479" cy="3.686"
                        r="2.72"/><circle cx="87.514" cy="3.686" r="2.719"/></g><g transform="translate(0 49)"><circle cx="3.261"
                        cy="2.767" r="2.72"/><circle cx="15.296" cy="2.767" r="2.719"/><circle cx="27.333" cy="2.767" r="2.72"/><circle
                        cx="39.369" cy="2.767" r="2.72"/><circle cx="51.405" cy="2.767" r="2.72"/><circle cx="63.441" cy="2.767"
                        r="2.72"/><circle cx="75.479" cy="2.767" r="2.72"/><circle cx="87.514" cy="2.767" r="2.719"/></g><g
                        transform="translate(0 61)"><circle cx="3.261" cy="2.846" r="2.72"/><circle cx="15.296" cy="2.846"
                        r="2.719"/><circle cx="27.333" cy="2.846" r="2.72"/><circle cx="39.369" cy="2.846" r="2.72"/><circle
                        cx="51.405" cy="2.846" r="2.72"/><circle cx="63.441" cy="2.846" r="2.72"/><circle cx="75.479" cy="2.846"
                        r="2.72"/><circle cx="87.514" cy="2.846" r="2.719"/></g><g transform="translate(0 73)"><circle cx="3.261"
                        cy="2.926" r="2.72"/><circle cx="15.296" cy="2.926" r="2.719"/><circle cx="27.333" cy="2.926" r="2.72"/><circle
                        cx="39.369" cy="2.926" r="2.72"/><circle cx="51.405" cy="2.926" r="2.72"/><circle cx="63.441" cy="2.926"
                        r="2.72"/><circle cx="75.479" cy="2.926" r="2.72"/><circle cx="87.514" cy="2.926" r="2.719"/></g><g
                        transform="translate(0 85)"><circle cx="3.261" cy="3.006" r="2.72"/><circle cx="15.296" cy="3.006"
                        r="2.719"/><circle cx="27.333" cy="3.006" r="2.72"/><circle cx="39.369" cy="3.006" r="2.72"/><circle
                        cx="51.405" cy="3.006" r="2.72"/><circle cx="63.441" cy="3.006" r="2.72"/><circle cx="75.479" cy="3.006"
                        r="2.72"/><circle cx="87.514" cy="3.006" r="2.719"/></g></g></g></g></svg>
                    <svg viewBox="0 0 91 91" className="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-indigo-500
                        fill-current"><g stroke="none" strokeWidth="1" fillRule="evenodd"><g fillRule="nonzero"><g><g><circle
                        cx="3.261" cy="3.445" r="2.72"/><circle cx="15.296" cy="3.445" r="2.719"/><circle cx="27.333" cy="3.445"
                        r="2.72"/><circle cx="39.369" cy="3.445" r="2.72"/><circle cx="51.405" cy="3.445" r="2.72"/><circle cx="63.441"
                        cy="3.445" r="2.72"/><circle cx="75.479" cy="3.445" r="2.72"/><circle cx="87.514" cy="3.445" r="2.719"/></g><g
                        transform="translate(0 12)"><circle cx="3.261" cy="3.525" r="2.72"/><circle cx="15.296" cy="3.525"
                        r="2.719"/><circle cx="27.333" cy="3.525" r="2.72"/><circle cx="39.369" cy="3.525" r="2.72"/><circle
                        cx="51.405" cy="3.525" r="2.72"/><circle cx="63.441" cy="3.525" r="2.72"/><circle cx="75.479" cy="3.525"
                        r="2.72"/><circle cx="87.514" cy="3.525" r="2.719"/></g><g transform="translate(0 24)"><circle cx="3.261"
                        cy="3.605" r="2.72"/><circle cx="15.296" cy="3.605" r="2.719"/><circle cx="27.333" cy="3.605" r="2.72"/><circle
                        cx="39.369" cy="3.605" r="2.72"/><circle cx="51.405" cy="3.605" r="2.72"/><circle cx="63.441" cy="3.605"
                        r="2.72"/><circle cx="75.479" cy="3.605" r="2.72"/><circle cx="87.514" cy="3.605" r="2.719"/></g><g
                        transform="translate(0 36)"><circle cx="3.261" cy="3.686" r="2.72"/><circle cx="15.296" cy="3.686"
                        r="2.719"/><circle cx="27.333" cy="3.686" r="2.72"/><circle cx="39.369" cy="3.686" r="2.72"/><circle
                        cx="51.405" cy="3.686" r="2.72"/><circle cx="63.441" cy="3.686" r="2.72"/><circle cx="75.479" cy="3.686"
                        r="2.72"/><circle cx="87.514" cy="3.686" r="2.719"/></g><g transform="translate(0 49)"><circle cx="3.261"
                        cy="2.767" r="2.72"/><circle cx="15.296" cy="2.767" r="2.719"/><circle cx="27.333" cy="2.767" r="2.72"/><circle
                        cx="39.369" cy="2.767" r="2.72"/><circle cx="51.405" cy="2.767" r="2.72"/><circle cx="63.441" cy="2.767"
                        r="2.72"/><circle cx="75.479" cy="2.767" r="2.72"/><circle cx="87.514" cy="2.767" r="2.719"/></g><g
                        transform="translate(0 61)"><circle cx="3.261" cy="2.846" r="2.72"/><circle cx="15.296" cy="2.846"
                        r="2.719"/><circle cx="27.333" cy="2.846" r="2.72"/><circle cx="39.369" cy="2.846" r="2.72"/><circle
                        cx="51.405" cy="2.846" r="2.72"/><circle cx="63.441" cy="2.846" r="2.72"/><circle cx="75.479" cy="2.846"
                        r="2.72"/><circle cx="87.514" cy="2.846" r="2.719"/></g><g transform="translate(0 73)"><circle cx="3.261"
                        cy="2.926" r="2.72"/><circle cx="15.296" cy="2.926" r="2.719"/><circle cx="27.333" cy="2.926" r="2.72"/><circle
                        cx="39.369" cy="2.926" r="2.72"/><circle cx="51.405" cy="2.926" r="2.72"/><circle cx="63.441" cy="2.926"
                        r="2.72"/><circle cx="75.479" cy="2.926" r="2.72"/><circle cx="87.514" cy="2.926" r="2.719"/></g><g
                        transform="translate(0 85)"><circle cx="3.261" cy="3.006" r="2.72"/><circle cx="15.296" cy="3.006"
                        r="2.719"/><circle cx="27.333" cy="3.006" r="2.72"/><circle cx="39.369" cy="3.006" r="2.72"/><circle
                        cx="51.405" cy="3.006" r="2.72"/><circle cx="63.441" cy="3.006" r="2.72"/><circle cx="75.479" cy="3.006"
                        r="2.72"/><circle cx="87.514" cy="3.006" r="2.719"/></g></g></g></g></svg>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Login;