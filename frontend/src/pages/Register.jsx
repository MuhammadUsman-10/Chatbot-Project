import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/signup',
            {firstname, lastname, email, password},
        ).then((response) => {
            console.log(response);
            if (response.status === 200) {
                navigate('/login');
                setErrorMessage('');
            }
        }).catch ((error) => {
            console.log(error);
            setErrorMessage('Invalid email or password');
        });    
    };
    
    return (
        <div className="flex w-full h-auto bg-white">
            <div className="hidden md:inline-block w-1/2 object-cover overflow-hidden">
                <video playsInline autoPlay muted loop className="w-full h-full"
                    src="https://cdn.dribbble.com/uploads/48292/original/30fd1f7b63806eff4db0d4276eb1ac45.mp4?1689187515">
                </video>
            </div>
            <div className="w-1/2">
                <div className="container mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="max-w-lg">
                            <div className='flex items-center justify-center mb-8'>
                                <h2 className="text-4xl font-bold text-center">SignUp to Mental Health Chatbot</h2>
                            </div>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="firstname">
                                        First Name
                                    </label>
                                    <input
                                    className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="firstname"
                                        type="firstname"
                                        placeholder="First Name"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="lastname">
                                        Last Name
                                    </label>
                                    <input
                                    className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lastname"
                                        type="lastname"
                                        placeholder="Last Name"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                    className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded-xl w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                                <div className="flex-col items-center justify-center bg-white text-black py-3 px-4 rounded-full gap-3 mb-4">
                                    <button className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 px-4 rounded-full font-bold focus:outline-none focus:shadow-outline"
                                        onClick={onSubmit} >
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;