import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiHeart } from 'react-icons/fi';

const BentoGrid = ({ 
  trending, 
  mostLiked, 
  isAuthenticated, 
  totalProjects = 120, 
  totalCreators = '1.2k' 
}) => {
  const navigate = useNavigate();

  // Placeholder jika project masih kosong
  const placeholderProjects = [
    { id: 1, title: "Project A", thumbnail: "/placeholder.png" },
    { id: 2, title: "Project B", thumbnail: "/placeholder.png" },
    { id: 3, title: "Project C", thumbnail: "/placeholder.png" },
  ];

  const displayTrending = trending.length ? trending : placeholderProjects;
  const displayMostLiked = mostLiked.length ? mostLiked : placeholderProjects;

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
          {/* BLOK BESAR: WELCOME + STATS */}
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Collaborate & Create
              </h2>
              <p className="text-lg opacity-90">
                Join a community of creators. Start your project or contribute
                to others.
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{totalProjects}+</span>
                <span className="ml-2">Projects</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{totalCreators}</span>
                <span className="ml-2">Creators</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="bg-white text-indigo-700 px-6 py-2 rounded-full font-semibold mt-4 self-start hover:bg-opacity-90 transition shadow-md"
            >
              Explore All
            </button>
          </div>

          {/* BLOK CREATE / SIGN IN */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/initiator")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 transition flex flex-col shadow-lg"
            >
              <div className="h-24 bg-white/10 rounded-xl mb-4 flex items-center justify-center text-3xl">
                🎨
              </div>
              <h3 className="text-xl font-bold">Create Project</h3>
              <p className="mt-1 text-sm opacity-90">Start your own story</p>
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white hover:scale-105 transition flex flex-col items-center justify-center shadow-lg"
            >
              <h3 className="text-xl font-bold">Sign In</h3>
              <p className="mt-1 text-sm opacity-90">to start creating</p>
            </div>
          )}

          {/* BLOK JOIN / SIGN UP */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/collaborator")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:scale-105 transition flex flex-col shadow-lg"
            >
              <div className="h-24 bg-white/10 rounded-xl mb-4 flex items-center justify-center text-3xl">
                🤝
              </div>
              <h3 className="text-xl font-bold">Join Project</h3>
              <p className="mt-1 text-sm opacity-90">Contribute to others</p>
            </div>
          ) : (
            <div
              onClick={() => navigate("/register")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-green-600 to-teal-600 text-white hover:scale-105 transition flex flex-col items-center justify-center shadow-lg"
            >
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p className="mt-1 text-sm opacity-90">Join the community</p>
            </div>
          )}

          {/* BLOK TRENDING PREVIEW */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-1">
              <FiTrendingUp className="text-red-500" /> Trending
            </h4>
            <div className="space-y-2">
              {displayTrending.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <img
                    src={project.thumbnail || "/placeholder.png"}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm truncate">{project.title}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/projects?sort=trending")}
              className="text-sm text-indigo-600 mt-2 hover:underline"
            >
              View all
            </button>
          </div>

          {/* BLOK MOST LIKED PREVIEW */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-1">
              <FiHeart className="text-pink-500" /> Most Liked
            </h4>
            <div className="space-y-2">
              {displayMostLiked.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <img
                    src={project.thumbnail || "/placeholder.png"}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm truncate">{project.title}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/projects?sort=likes")}
              className="text-sm text-indigo-600 mt-2 hover:underline"
            >
              View all
            </button>
          </div>

          {/* BLOK INFO TAMBAHAN (misal: fitur baru) */}
          <div className="md:col-span-2 bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <span className="font-medium flex items-center gap-2">
              <span className="text-xl">✨</span> New: Real-time collaboration
            </span>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;