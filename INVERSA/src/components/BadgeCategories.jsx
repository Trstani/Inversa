import React from 'react';
import { categories } from '../data/badgeCategories';

const BadgeCategories = ({ categoryId, size = 'md', className = '' }) => {
    const category = categories.find(g => g.id === categoryId);

    if (!category) return null;

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={`badge ${category.color} text-white ${sizes[size]} ${className}`}
        >
            {category.name}
        </span>
    );
};

export default BadgeCategories;