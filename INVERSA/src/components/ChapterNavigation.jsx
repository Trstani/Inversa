import React from 'react';
import { FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const ChapterNavigation = ({
    currentChapter,
    totalChapters,
    onPrevious,
    onNext,
    className = ''
}) => {
    const hasPrevious = currentChapter > 1;
    const hasNext = currentChapter < totalChapters;

    return (
        <div className={`flex items-center justify-between py-6 ${className}`}>
            {/* Previous Chapter */}
            <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${hasPrevious
                        ? 'text-light-primary dark:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface'
                        : 'text-light-border dark:text-dark-border cursor-not-allowed'
                    }`}
            >
                <FiChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous Chapter</span>
            </button>

            {/* Chapter Indicator */}
            <div className="text-center">
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Chapter {currentChapter} of {totalChapters}
                </p>
            </div>

            {/* Next Chapter */}
            <button
                onClick={onNext}
                disabled={!hasNext}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${hasNext
                        ? 'text-light-primary dark:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface'
                        : 'text-light-border dark:text-dark-border cursor-not-allowed'
                    }`}
            >
                <span className="hidden sm:inline">Next Chapter</span>
                {hasNext ? (
                    <FiChevronRight className="w-5 h-5" />
                ) : (
                    <div className="flex items-center space-x-1">
                        <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                        <FiChevronRight className="w-5 h-5" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChapterNavigation;
