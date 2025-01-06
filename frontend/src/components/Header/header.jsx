import { useState, useEffect } from 'react';
import usePersistedUserState from '../UI/persistedHook';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
    { path: "/chatbot", display: "Chatbot" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user] = usePersistedUserState("userInfo", null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/login');
        window.location.reload();
    };
    useEffect(() => {
        if (isMenuOpen) {
        document.body.style.overflow = 'hidden'; // Disable scrolling
        } else {
        document.body.style.overflow = 'auto'; // Enable scrolling
        }

        // Cleanup function to reset the overflow when the component unmounts
        return () => {
        document.body.style.overflow = 'auto';
        };
    }, [user, isMenuOpen]);

    return (
        <div className={`${isMenuOpen ? 'bg-white' : 'bg-[#F8F7F4]'}`}>
            <div className={`container mx-auto flex justify-between items-center p-6 z-50`}>
                <div className="flex items-center">
                    <button onClick={toggleMenu} className="lg:hidden mt-3 mr-4">
                        {isMenuOpen ? (
                            <i className="fas fa-times text-2xl"></i> // Close icon when menu is open
                        ) : (
                            <i className="fas fa-bars text-2xl"></i> // Bars icon when menu is closed
                        )}
                    </button>
                    <Link to="/home" className="flex items-center space-x-2">
                        <img src="/icon.webp" alt="logo" className="w-4 h-4" />
                        <p className='text-2xl font-semibold'>Mental health Chatbot</p>
                    </Link>
                </div>
                <div className="hidden lg:flex space-x-8">
                    {navLinks.map((item, index) => (
                        <Link to={item.path} className="text-base font-semibold text-black hover:text-slate-700" key={index} >
                        {item.display}
                        </Link>
                    ))}
                </div>
                {user ? (
                <div className="flex items-center space-x-4">
                    <div className="relative flex px-3 py-2 rounded-lg border items-center">
                        <span className="cursor-pointer" onClick={toggleDropdown} >
                        Hi, {user.firstname}
                        </span>
                        <button className="px-2 transition " onClick={toggleDropdown}> {/*Click to open dropdown*/}
                            {dropdownOpen ? (
                                <>
                                    <i className="fas fa-angle-up"></i>
                                    <div className="w-44 absolute top-10 right-0 mt-3 z-10 border rounded-lg">
                                        <div className="flex flex-col w-full px-5 py-1 bg-[#F8F7F4]">
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
                        <Link to="/login" className="hidden lg:inline-block pr-3 text-base font-semibold">
                            Log in
                        </Link>
                        <Link to="/register" className="bg-black py-3 px-5 text-xs text-white rounded-full font-semibold hover:bg-slate-700 transition duration-300 sm:py-3 sm:px-5 sm:text-base">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
            <div className={`lg:hidden fixed top-[113px] left-0 w-full h-auto bg-white shadow-lg z-40 transform ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col items-start p-5 space-y-5">
                    {navLinks.map((item, index) => (
                        <Link
                        to={item.path}
                        className="text-base font-semibold text-black hover:text-slate-700"
                        key={index}
                        onClick={toggleMenu}
                        >
                        {item.display}
                        </Link>
                    ))}
                    {user ? (
                        <div className="hidden">
                            <Link to="/login" className="pr-3 text-base font-semibold">Log in</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start py-4">
                            <Link to="/login" className="pr-3 text-base font-semibold">Log in</Link>
                        </div>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="lg:hidden inset-0 bg-black opacity-50 z-30" onClick={toggleMenu}></div>
            )}
        </div>
    );
};

export default Header;
