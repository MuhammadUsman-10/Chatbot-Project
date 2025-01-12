import { useState } from 'react';
import usePersistedUserState from '../UI/persistedHook';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user] = usePersistedUserState("userInfo", null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className='bg-gray-100'>
            <div className={`container mx-auto flex justify-between items-center p-6 z-50`}>
                <div className="flex items-center">
                    <Link to="/home" className="flex items-center space-x-2">
                        <img src="/icon.webp" alt="logo" className="w-4 h-4" />
                        <p className='text-2xl font-semibold'>Mental health Chatbot</p>
                    </Link>
                </div>
                {user ? (
                <div className="flex items-center sm:space-x-4">
                    <div className="relative flex px-3 py-2 rounded-lg border items-center">
                        <span className="cursor-pointer text-xs sm:text-base" onClick={toggleDropdown} >
                            Hi, {user.firstname}
                        </span>
                        <button className="px-2 transition " onClick={toggleDropdown}> {/*Click to open dropdown*/}
                            {dropdownOpen ? (
                                <>
                                    <i className="fas fa-angle-up"></i>
                                    <div className="w-[106px] sm:w-[126px] absolute top-10 right-0 mt-3 z-10 border rounded-lg">
                                        <div className="flex flex-col text-xs sm:text-base w-full px-5 py-1 bg-[#F8F7F4] border rounded-lg">
                                            <Link to="/userprofile" className="">User Profile</Link>
                                            <Link className="px-4" onClick={handleLogout}>Logout</Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <i className="fas fa-angle-down"></i>
                            )}                  
                        </button>
                    </div>
                </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="hidden md:inline-block pr-3 text-base font-semibold">
                            Log in
                        </Link>
                        <Link to="/register" className="bg-black py-3 px-3 text-xs text-white rounded-full font-semibold hover:bg-slate-700 transition duration-300 sm:py-3 sm:px-5 sm:text-base">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
