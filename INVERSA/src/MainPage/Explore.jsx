import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';
import { loadProjects } from '../utils/dataManager';
import { genres } from '../data/mockData';
import CardProject from '../components/CardProject';
import Button from '../components/Button';
import Hero from '../section/Hero';

// Explore page is essentially the same as Home page
// Just showing all projects without the hero section
const Explore = () => {
    const [projects, setProjects] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await loadProjects();
            setProjects(data);
            setLoading(false);
        };
        fetchProjects();
    }, []);

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesGenre = selectedGenre === 'all' || project.genre === selectedGenre;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    return (
        <div className="min-h-screen">
         

            {/* Search & Filter Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-secondary dark:text-dark-secondary w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                </div>

                {/* Genre Filter */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-light-secondary dark:text-dark-secondary mb-3 uppercase tracking-wide">
                        Filter by Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedGenre('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGenre === 'all'
                                    ? 'bg-light-accent dark:bg-dark-accent text-white'
                                    : 'bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary hover:bg-light-border dark:hover:bg-dark-border'
                                }`}
                        >
                            All
                        </button>
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                onClick={() => setSelectedGenre(genre.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGenre === genre.id
                                        ? `${genre.color} text-white`
                                        : 'bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary hover:bg-light-border dark:hover:bg-dark-border'
                                    }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Projects */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <FiTrendingUp className="w-5 h-5 text-light-accent dark:text-dark-accent" />
                        <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                            {selectedGenre === 'all' ? 'All Projects' : `${genres.find(g => g.id === selectedGenre)?.name} Projects`}
                        </h2>
                        <span className="text-light-secondary dark:text-dark-secondary">
                            ({filteredProjects.length})
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-light-secondary dark:text-dark-secondary">Loading projects...</p>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map(project => (
                                <CardProject key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-light-secondary dark:text-dark-secondary mb-4">
                                {projects.length === 0
                                    ? 'No projects yet. Be the first to create one!'
                                    : 'No projects found matching your criteria'}
                            </p>
                            {projects.length === 0 && (
                                <Button variant="primary" onClick={() => window.location.href = '/login'}>
                                    Get Started
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


export default Explore;
