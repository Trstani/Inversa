/**
 * API Transformer Utility
 * Converts between snake_case (API/Database) and camelCase (Frontend)
 */

/**
 * Convert snake_case object keys to camelCase
 * @param {Object} obj - Object with snake_case keys
 * @returns {Object} Object with camelCase keys
 */
export const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }

  const camelCaseObj = {};

  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

    // Recursively convert nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      camelCaseObj[camelKey] = toCamelCase(value);
    } else if (Array.isArray(value)) {
      camelCaseObj[camelKey] = value.map(item =>
        item && typeof item === 'object' ? toCamelCase(item) : item
      );
    } else {
      camelCaseObj[camelKey] = value;
    }
  }

  return camelCaseObj;
};

/**
 * Convert camelCase object keys to snake_case
 * @param {Object} obj - Object with camelCase keys
 * @returns {Object} Object with snake_case keys
 */
export const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }

  const snakeCaseObj = {};

  for (const [key, value] of Object.entries(obj)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

    // Recursively convert nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      snakeCaseObj[snakeKey] = toSnakeCase(value);
    } else if (Array.isArray(value)) {
      snakeCaseObj[snakeKey] = value.map(item =>
        item && typeof item === 'object' ? toSnakeCase(item) : item
      );
    } else {
      snakeCaseObj[snakeKey] = value;
    }
  }

  return snakeCaseObj;
};

/**
 * Transform API response to frontend format
 * @param {Object|Array} data - API response data
 * @returns {Object|Array} Transformed data with camelCase keys
 */
export const transformApiResponse = (data) => {
  return toCamelCase(data);
};

/**
 * Transform frontend data to API format
 * @param {Object|Array} data - Frontend data
 * @returns {Object|Array} Transformed data with snake_case keys
 */
export const transformApiRequest = (data) => {
  return toSnakeCase(data);
};
