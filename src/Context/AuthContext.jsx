import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Check for hardcoded admin credentials
            if (email === 'admin' && password === '1234') {
                const adminUser = {
                    id: 1,
                    name: 'Admin',
                    email: 'admin',
                    role: 'admin'
                };
                const token = 'admin_token_' + Date.now();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(adminUser));
                setToken(token);
                setUser(adminUser);
                return true;
            }

            // Check for regular users in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(u => u.email === email && u.password === password);
            
            if (foundUser) {
                const { password, ...userWithoutPassword } = foundUser;
                const token = 'user_token_' + Date.now();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                setToken(token);
                setUser(userWithoutPassword);
                return true;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error("Login Error", error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if user already exists
            if (users.find(u => u.email === email)) {
                throw new Error('User already exists');
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password, // In real app, this should be hashed
                role: 'user'
            };

            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto-login after registration
            const { password: _, ...userWithoutPassword } = newUser;
            const token = 'user_token_' + Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            setToken(token);
            setUser(userWithoutPassword);
            
            return true;
        } catch (error) {
            console.error("Register Error", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
