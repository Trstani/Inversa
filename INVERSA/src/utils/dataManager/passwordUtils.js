export const hashPassword = (password) => {

    let hash = 0;

    for (let i = 0; i < password.length; i++) {

        const char = password.charCodeAt(i);

        hash = ((hash << 5) - hash) + char;

        hash = hash & hash;

    }

    return 'hash_' + Math.abs(hash).toString(36);

};

export const verifyPassword = (password, hash) => {

    return hashPassword(password) === hash;

};