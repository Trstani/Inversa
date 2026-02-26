import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiGrid, FiCompass, FiChevronDown, FiEdit, FiUsers } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Dropdown, { DropdownItem } from '../components/Dropdown';

const Header = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-dark-background border-b border-light-border dark:border-dark-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-20 h-20 flex items-center justify-center">
                            <img 
                                src="/INVERSA.png" 
                                alt="INVERSA Logo"
                                className={`w-20 h-30 object-cover transition-all ${isDark ? 'brightness-0 invert' : ''}`}
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/Home"
                            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors flex items-center space-x-1"
                        >
                            <FiHome className="w-4 h-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/explore"
                            className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors flex items-center space-x-1"
                        >
                            <FiCompass className="w-4 h-4" />
                            <span>Explore</span>
                        </Link>

                        {isAuthenticated && (
                            <Dropdown
                                trigger={
                                    <button className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors flex items-center space-x-1">
                                        <FiGrid className="w-4 h-4" />
                                        <span>Others</span>
                                        <FiChevronDown className="w-4 h-4" />
                                    </button>
                                }
                            >
                                <DropdownItem
                                    icon={<FiEdit className="w-4 h-4" />}
                                    onClick={() => navigate('/dashboard/initiator')}

                                >
                                    Projects
                                </DropdownItem>
                                <DropdownItem
                                    icon={<FiUsers className="w-4 h-4" />}
                                    onClick={() => navigate('/dashboard/collaborator')}

                                >
                                    Collaborations
                                </DropdownItem>
                            </Dropdown>
                        )}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                            >
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? (
                                <FiSun className="w-5 h-5 text-dark-primary" />
                            ) : (
                                <FiMoon className="w-5 h-5 text-light-primary" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-light-surface dark:bg-dark-surface rounded-lg">
                                        <FiUser className="w-4 h-4" />
                                        <span className="text-sm font-medium">{user.name}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={logout}
                                        icon={<FiLogOut className="w-4 h-4" />}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-light-border dark:border-dark-border">
                        <nav className="flex flex-col space-y-3">
                            <button
                                onClick={() => handleNavigation('/Home')}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                            >
                                <FiHome className="w-5 h-5" />
                                <span>Home</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/explore')}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                            >
                                <FiCompass className="w-5 h-5" />
                                <span>Explore</span>
                            </button>

                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => handleNavigation('/projects')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                                    >
                                        <FiEdit className="w-5 h-5" />
                                        <span>Projects</span>
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('/collaborations')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                                    >
                                        <FiUsers className="w-5 h-5" />
                                        <span>Collaborations</span>
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('/profile')}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                                    >
                                        <FiUser className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleNavigation('/admin')}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                                        >
                                            <FiGrid className="w-5 h-5" />
                                            <span>Admin Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            toggleMobileMenu();
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                                    >
                                        <FiLogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleMobileMenu}>
                                        <Button variant="ghost" size="md" className="w-full justify-start">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={toggleMobileMenu}>
                                        <Button variant="primary" size="md" className="w-full">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
