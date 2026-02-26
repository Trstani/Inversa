import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = ({ 
    size = 'md', 
    text = 'Loading...', 
    fullScreen = false,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <FiLoader className={`${sizeClasses[size]} animate-spin text-light-accent dark:text-dark-accent`} />
            {text && (
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-dark-background flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default Loading;
