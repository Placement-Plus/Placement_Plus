import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [admin, setAdmin] = useState(null)
    const [isAdminLoggesIn, setIsAdminLoggedIn] = useState(false)

    const login = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    const adminLogin = (adminData) => {
        setAdmin(adminData)
        setIsAdminLoggedIn(true)
    }

    const adminLogout = () => {
        setAdmin(false)
        setIsAdminLoggedIn(false)
    }

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, admin, isAdminLoggesIn, login, logout, adminLogin, adminLogout, theme, toggleTheme }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
