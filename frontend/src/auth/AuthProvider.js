import { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { AuthContext } from "./AuthVars";

function AuthProvider(props) {
    const [UserID, setUserID] = useState(null);
    const history = useHistory();

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, credentials);
            setUserID(response.data._id);
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            const logout = await axios.post(`${process.env.REACT_APP_API_URL}/users/logout`);
            setUserID(null);
            history.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

    const value = {UserID, login, logout};
    
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export default AuthProvider;