// Fallback genres (jika JSON tidak tersedia)
export const genres = [
    {
      "id": "comedy",
      "name": "Comedy",
      "description": "Cerita yang menghibur dan lucu",
      "color": "#FACC15",
      "textColor": "#1E293B",
      "bgClass": "bg-yellow-400"
    },
    {
      "id": "horror",
      "name": "Horror",
      "description": "Cerita yang menakutkan dan misterius",
      "color": "#991B1B",
      "textColor": "#FFFFFF",
      "bgClass": "bg-red-800"
    },
    {
      "id": "action",
      "name": "Action",
      "description": "Cerita penuh aksi dan petualangan",
      "color": "#EA580C",
      "textColor": "#FFFFFF",
      "bgClass": "bg-orange-600"
    },
    {
      "id": "crime",
      "name": "Crime",
      "description": "Cerita tentang kejahatan dan misteri",
      "color": "#475",
      "textColor": "#FFFFFF",
      "bgClass": "bg-gray-600"
    },
    {
      "id": "adventure",
      "name": "Adventure",
      "description": "Cerita petualangan dan eksplorasi",
      "color": "#15803D",
      "textColor": "#FFFFFF",
      "bgClass": "bg-green-700"
    },
    {
      "id": "scifi",
      "name": "Sci-Fi",
      "description": "Cerita fiksi ilmiah dan futuristik",
      "color": "#0284C7",
      "textColor": "#FFFFFF",
      "bgClass": "bg-sky-600"
    },
    {
      "id": "romance",
      "name": "Romance",
      "description": "Cerita cinta dan hubungan",
      "color": "#DB2777",
      "textColor": "#FFFFFF",
      "bgClass": "bg-pink-600"
    },
    {
      "id": "documentary",
      "name": "Documentary",
      "description": "Cerita faktual dan dokumenter",
      "color": "#B45309",
      "textColor": "#FFFFFF",
      "bgClass": "bg-amber-700"
    }
];


// Load genres from JSON
export const loadGenres = async () => {
    
    return genres;
};
