// Mock data for development
// Data dimuat dari JSON files di public/data/

// Fallback categories (jika JSON tidak tersedia)
export const categories = [
    { id: 'novel', name: 'Novel', description: 'Karya fiksi panjang dengan plot kompleks', color: '#818CF8', textColor: '#FFFFFF', bgClass: 'bg-indigo-400' },
    { id: 'cerpen', name: 'Cerpen', description: 'Cerita pendek dengan plot sederhana', color: '#E5E7EB', textColor: '#1E293B', bgClass: 'bg-gray-200' },
    { id: 'blog', name: 'Blog', description: 'Artikel atau tulisan blog', color: '#94A3B8', textColor: '#FFFFFF', bgClass: 'bg-slate-400' },
    { id: 'skenario', name: 'Skenario', description: 'Naskah untuk film atau drama', color: '#0F172A', textColor: '#E5E7EB', bgClass: 'bg-slate-900' },
    { id: 'fabel', name: 'Fabel', description: 'Cerita dengan pesan moral', color: '#020617', textColor: '#E5E7EB', bgClass: 'bg-slate-950' },
    { id: 'komedi', name: 'Naskah Komedi', description: 'Naskah dengan tujuan menghibur', color: '#818CF8', textColor: '#FFFFFF', bgClass: 'bg-indigo-400' },
    { id: 'character', name: 'Character', description: 'Pengembangan karakter dan profil', color: '#94A3B8', textColor: '#FFFFFF', bgClass: 'bg-slate-400' },
];

// Fallback genres (jika JSON tidak tersedia)
export const genres = [
    { id: 'comedy', name: 'Comedy', description: 'Cerita yang menghibur dan lucu', color: '#FBBF24', textColor: '#1E293B', bgClass: 'bg-amber-400' },
    { id: 'horror', name: 'Horror', description: 'Cerita yang menakutkan dan misterius', color: '#EF4444', textColor: '#FFFFFF', bgClass: 'bg-red-500' },
    { id: 'action', name: 'Action', description: 'Cerita penuh aksi dan petualangan', color: '#F97316', textColor: '#FFFFFF', bgClass: 'bg-orange-500' },
    { id: 'crime', name: 'Crime', description: 'Cerita tentang kejahatan dan misteri', color: '#6366F1', textColor: '#FFFFFF', bgClass: 'bg-indigo-500' },
    { id: 'adventure', name: 'Adventure', description: 'Cerita petualangan dan eksplorasi', color: '#10B981', textColor: '#FFFFFF', bgClass: 'bg-emerald-500' },
    { id: 'scifi', name: 'Sci-Fi', description: 'Cerita fiksi ilmiah dan futuristik', color: '#06B6D4', textColor: '#FFFFFF', bgClass: 'bg-cyan-500' },
    { id: 'romance', name: 'Romance', description: 'Cerita cinta dan hubungan', color: '#EC4899', textColor: '#FFFFFF', bgClass: 'bg-pink-500' },
    { id: 'documentary', name: 'Documentary', description: 'Cerita faktual dan dokumenter', color: '#8B5CF6', textColor: '#FFFFFF', bgClass: 'bg-violet-500' },
];

export const collaboratorRoles = [
    { id: 'writer', name: 'Writer', description: 'Menulis konten chapter' },
    { id: 'editor', name: 'Editor', description: 'Mengedit dan memperbaiki konten' },
    { id: 'illustrator', name: 'Illustrator', description: 'Membuat ilustrasi' },
    { id: 'proofreader', name: 'Proofreader', description: 'Memeriksa kesalahan' },
];

// Load categories from JSON
export const loadCategories = async () => {
    try {
        const response = await fetch('/data/categories.json');
        if (response.ok) {
            const data = await response.json();
            return data.categories || categories;
        }
    } catch (error) {
        console.warn('Failed to load categories from JSON, using fallback');
    }
    return categories;
};

// Load genres from JSON
export const loadGenres = async () => {
    try {
        const response = await fetch('/data/genres.json');
        if (response.ok) {
            const data = await response.json();
            return data.genres || genres;
        }
    } catch (error) {
        console.warn('Failed to load genres from JSON, using fallback');
    }
    return genres;
};

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
