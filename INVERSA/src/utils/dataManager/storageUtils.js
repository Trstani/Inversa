export const API_BASE_URL = 'http://localhost:3001/api';

export const saveToLocalStorage = (key, data) => {

    localStorage.setItem(`inversa_${key}`, JSON.stringify(data));

};

export const loadFromLocalStorage = (key) => {

    const data = localStorage.getItem(`inversa_${key}`);

    return data ? JSON.parse(data) : null;

};