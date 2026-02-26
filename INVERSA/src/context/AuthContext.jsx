import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../utils/userManager';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Check localStorage for saved user
        const saved = localStorage.getItem('inversa_currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Save user to localStorage whenever it changes
        if (user) {
            localStorage.setItem('inversa_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('inversa_currentUser');
        }
    }, [user]);

    const login = async (email, password) => {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = loginUser(email, password);
                if (result.success) {
                    setUser(result.user);
                    setIsLoading(false);
                    resolve({ success: true, user: result.user });
                } else {
                    setIsLoading(false);
                    resolve({ success: false, error: result.error });
                }
            }, 500);
        });
    };

    const register = async (userData) => {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = registerUser(userData.name, userData.email, userData.password);
                if (result.success) {
                    setUser(result.user);
                    setIsLoading(false);
                    resolve({ success: true, user: result.user });
                } else {
                    setIsLoading(false);
                    resolve({ success: false, error: result.error });
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('inversa_currentUser');
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isGuest = !user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                isGuest,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
