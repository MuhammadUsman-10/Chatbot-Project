// import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/login',
            {email,password},
        ).then((response) => {
            console.log(response);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            if (response.status === 200) {
                navigate('/home');
                setErrorMessage('');
                window.location.reload();
            }
        }).catch ((error) => {
            console.log(error);
            setErrorMessage('Invalid email or password');
        });    
    };
    
    return (
        <div className="flex w-full h-auto items-center justify-center bg-white">
            <div className="hidden md:inline-block w-1/2 object-cover overflow-hidden">
                <video playsInline autoPlay muted loop className="w-full h-full" 
                src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"/>
            </div>
            <div className="lg:w-1/2" >
                <div className="container mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="max-w-lg">
                            <h2 className="text-4xl font-bold mb-8 text-center">Sign in to Mental Health Chatbot</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="text"
                                        aria-required="true"
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-6">
                                    <div className="flex justify-between">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <a
                                        className="inline-block align-baseline underline text-sm text-slate-700"
                                        href="#"
                                        title="Click here to reset your password"
                                    >
                                        Forgot?
                                    </a></div>
                                    <input
                                        className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type="password"
                                        aria-required="true"
                                        value={password}
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                                <div className="flex-col items-center justify-center bg-white text-black py-3 px-4 rounded-full gap-3 mb-4">
                                    <button className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 px-4 rounded-full font-bold focus:outline-none focus:shadow-outline"
                                    onClick={onSubmit}>
                                        Sign In
                                    </button>
                                </div>
                                <div className="text-center text-slate-500 text-sm">
                                    Don&apos;t have an account? <a href="/register" className="text-slate-900">Sign up</a>   
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;