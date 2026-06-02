import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

// Cache untuk menghindari multiple requests
let categoriesCache = null;
let genresCache = null;
let isLoading = false;
let loadPromise = null;

// Fallback data - LENGKAP dari database schema
const FALLBACK_CATEGORIES = [
   {
      "id": "novel",
      "name": "Novel",
      "description": "Karya fiksi panjang dengan plot kompleks",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "cerpen",
      "name": "Cerpen",
      "description": "Cerita pendek dengan plot sederhana",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "blog",
      "name": "Blog",
      "description": "Artikel atau tulisan blog",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "skenario",
      "name": "Skenario",
      "description": "Naskah untuk film atau drama",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "fabel",
      "name": "Fabel",
      "description": "Cerita dengan pesan moral",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "komedi",
      "name": "Naskah Komedi",
      "description": "Naskah dengan tujuan menghibur",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    },
    {
      "id": "character",
      "name": "Character",
      "description": "Pengembangan karakter dan profil",
      "color": "#020617",
      "textColor": "#E5E7EB",
      "bgClass": "bg-slate-950"
    }
];

const FALLBACK_GENRES = [
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
      "bgClass": "bg-slate-600"
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

// Helper to normalize field names from backend to match component usage
const normalizeCategory = (cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  color: cat.color,
  textColor: cat.text_color || cat.textColor,
  bgClass: cat.bg_class || cat.bgClass,
});

const normalizeGenre = (genre) => ({
  id: genre.id,
  name: genre.name,
  description: genre.description,
  color: genre.color,
  textColor: genre.text_color || genre.textColor,
  bgClass: genre.bg_class || genre.bgClass,
});

export const useCategoriesAndGenres = () => {
  const [categories, setCategories] = useState(categoriesCache || FALLBACK_CATEGORIES);
  const [genres, setGenres] = useState(genresCache || FALLBACK_GENRES);
  const [loading, setLoading] = useState(!categoriesCache || !genresCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jika data sudah dalam cache, set langsung
    if (categoriesCache && genresCache) {
      setCategories(categoriesCache);
      setGenres(genresCache);
      setLoading(false);
      return;
    }

    // Jika sedang loading, tunggu promise sebelumnya
    if (isLoading && loadPromise) {
      loadPromise.then(() => {
        setCategories(categoriesCache || FALLBACK_CATEGORIES);
        setGenres(genresCache || FALLBACK_GENRES);
        setLoading(false);
      }).catch(err => {
        console.warn('Load categories/genres error, using fallback:', err.message);
        setCategories(FALLBACK_CATEGORIES);
        setGenres(FALLBACK_GENRES);
        setError(null);
        setLoading(false);
      });
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    if (isLoading) return;

    isLoading = true;
    setLoading(true);

    const promise = (async () => {
      try {
        console.log('Fetching categories and genres from backend API...');
        
        // Fetch dari backend API
        const [categoriesRes, genresRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/genres'),
        ]);

        console.log('Categories response:', categoriesRes);
        console.log('Genres response:', genresRes);

        const catsData = categoriesRes?.data || [];
        const genresData = genresRes?.data || [];

        console.log('Categories data:', catsData);
        console.log('Genres data:', genresData);

        if (catsData.length === 0 || genresData.length === 0) {
          console.warn('Empty data from backend API, using fallback');
          categoriesCache = FALLBACK_CATEGORIES;
          genresCache = FALLBACK_GENRES;
          setCategories(FALLBACK_CATEGORIES);
          setGenres(FALLBACK_GENRES);
        } else {
          // Normalize and cache the data
          const normalizedCats = catsData.map(normalizeCategory);
          const normalizedGenres = genresData.map(normalizeGenre);
          
          categoriesCache = normalizedCats;
          genresCache = normalizedGenres;

          setCategories(normalizedCats);
          setGenres(normalizedGenres);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load from backend API, using fallback:', err.message);
        
        // Always use fallback - it's complete
        categoriesCache = FALLBACK_CATEGORIES;
        genresCache = FALLBACK_GENRES;
        
        setCategories(FALLBACK_CATEGORIES);
        setGenres(FALLBACK_GENRES);
        setError(null);
      } finally {
        isLoading = false;
        setLoading(false);
      }
    })();

    loadPromise = promise;
    await promise;
  };

  const getCategoryById = (id) => {
    return categories.find(c => c.id === id);
  };

  const getGenreById = (id) => {
    return genres.find(g => g.id === id);
  };

  return {
    categories,
    genres,
    loading,
    error,
    getCategoryById,
    getGenreById,
    reload: loadData,
  };
};
