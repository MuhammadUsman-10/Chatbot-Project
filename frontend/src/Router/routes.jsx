import { Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Chatbot from "../pages/Chatbot";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import ProtectedRoutes from "../components/UI/ProtectedRoutes";

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chatbot" element={ <ProtectedRoutes> <Chatbot /> </ProtectedRoutes> } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userprofile" element={ <ProtectedRoutes> <UserProfile /> </ProtectedRoutes> } />
        </Routes>
    );
};

export default Routers;
