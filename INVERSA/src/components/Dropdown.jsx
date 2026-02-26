import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg py-2 z-50 ${className}`}>
                    {React.Children.map(children, child => (
                        <div onClick={() => setIsOpen(false)}>
                            {child}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const DropdownItem = ({ children, icon, onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 hover:bg-light-surface dark:hover:bg-dark-background transition-colors flex items-center space-x-2 text-light-primary dark:text-dark-primary ${className}`}
        >
            {icon && <span className="text-light-secondary dark:text-dark-secondary">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

export default Dropdown;
