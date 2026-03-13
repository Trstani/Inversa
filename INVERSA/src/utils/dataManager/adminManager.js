import { getAllUsers } from "./userManager";

export const listAllUsers = () => {

    const users = getAllUsers();

    return users.map(u => ({

        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,

    }));

};


export const getUserStats = (userId) => {

    return {

        userId,
        projectsCreated: 0,
        chaptersWritten: 0,
        collaborations: 0,

    };

};