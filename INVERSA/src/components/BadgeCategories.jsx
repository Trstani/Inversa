import { useCategoriesAndGenres } from '../InitiatorFolder/hooks/useCategoriesAndGenres';

const BadgeCategories = ({
  categoryId,
  size = 'md',
  className = '',
}) => {

  const { categories, error } = useCategoriesAndGenres();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    if (error) console.warn('Badge error:', error);
    return null;
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (

    <span
      style={{
        backgroundColor:
          category.color,

        color:
          category.text_color,
      }}

      className={`
        inline-flex items-center
        rounded-full font-medium
        ${sizes[size]}
        ${className}
      `}
    >

      {category.name}

    </span>
  );
};

export default BadgeCategories;