// context/UserContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
    user: any; // Replace 'any' with a more specific type for user data
    setUser: (user: any) => void; // Replace 'any' with a more specific type
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type

    const logout = () => {
        setUser(null); // Clear user data on logout
        localStorage.removeItem('token'); // Optional: Clear token from local storage
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
