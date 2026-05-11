import React from "react";
import { Link } from "react-router-dom";
import { FiEye, FiHeart, FiUser } from "react-icons/fi";
import { findUserById } from "../utils/userManager/index";

const CardProjectMini = ({ project, rank }) => {
  if (!project) return null;

  const author = findUserById(project.initiatorId) || { name: "Unknown" };
  const hasBackground =
    project.backgroundImage && project.backgroundImage.trim() !== "";

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <div className="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Tekstur latar gambar yang sangat redup – hanya sebagai aksen, bukan fokus */}
        {hasBackground && (
          <div
            className="absolute inset-0 z-0 opacity-40 dark:opacity-5 bg-cover bg-center transition-opacity group-hover:opacity-20 dark:group-hover:opacity-10"
            style={{ backgroundImage: `url(${project.backgroundImage})` }}
          />
        )}

        {/* Konten utama tetap di atas tekstur */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Ranking + Judul */}
          <div className="flex items-start gap-2 mb-2">
            {rank && (
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {rank}
              </span>
            )}
            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {project.title}
            </h4>
          </div>

          {/* Deskripsi singkat – 1 baris */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
            {project.description}
          </p>

          {/* Footer: author + stats */}
          <div className="flex items-center justify-between text-xs mt-auto">
            <div className="flex items-center gap-1.5 truncate">
              <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="truncate text-gray-600 dark:text-gray-300 font-medium">
                {author.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 flex-shrink-0">
              <span className="flex items-center gap-1">
                <FiEye className="w-3.5 h-3.5" />
                <span>{project.views || 0}</span>
              </span>
              <span className="flex items-center gap-1">
                <FiHeart className="w-3.5 h-3.5" />
                <span>{project.likes || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardProjectMini;