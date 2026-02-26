export const collaboratorRoles = [
    { id: 'writer', name: 'Writer', description: 'Menulis konten chapter' },
    { id: 'editor', name: 'Editor', description: 'Mengedit dan memperbaiki konten' },
    { id: 'illustrator', name: 'Illustrator', description: 'Membuat ilustrasi' }
];

// Load collaborator roles from JSON
export const loadCollaboratorRoles = async () => {
    try {
        const response = await fetch('/data/collaborator-roles.json');
        if (response.ok) {
            const data = await response.json();
            return data.roles || collaboratorRoles;
        }
    } catch (error) {
        console.warn('Failed to load collaborator roles from JSON, using fallback');
    }
    return collaboratorRoles;
};