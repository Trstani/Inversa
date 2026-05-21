import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiLogIn,
  FiPlus,
  FiStar,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";

import FollowedList from "./design/FollowedList";
import HistoryList from "./design/HistoryList";

const BentoGrid = ({
  isAuthenticated,
  totalProjects = 120,
  totalCreators = "1.2k",
  follows = [],
  history = [],
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* HERO */}
          <div className="relative sm:col-span-2 sm:row-span-2 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 min-h-[420px] group">
            
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop')",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
              
              <div>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-sm">
                  Collaborative Writing Platform
                </span>

                <h1 className="mt-5 max-w-xl text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                  Write together,
                  <br />
                  build better stories.
                </h1>

                <p className="mt-4 max-w-md text-sm md:text-base text-slate-400 leading-relaxed">
                  Create projects, collaborate per section, and manage writing
                  workflows in one focused workspace.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <p className="text-2xl font-semibold text-white">
                      {totalProjects}+
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Active Projects
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <p className="text-2xl font-semibold text-white">
                      {totalCreators}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Creators
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/explore")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition-all hover:opacity-90"
                >
                  Explore Projects
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* CREATE / LOGIN */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/initiator")}
              className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all hover:border-indigo-400/40 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <FiPlus className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Create Project
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Start a new collaborative writing workspace.
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-indigo-500">
                  Open workspace →
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all hover:border-indigo-400/40 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <FiLogIn className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Sign In
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Continue your writing journey.
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-indigo-500">
                  Login →
                </div>
              </div>
            </div>
          )}

          {/* JOIN / REGISTER */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/collaborator")}
              className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all hover:border-indigo-400/40 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <FiUserCheck className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Join Project
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Collaborate with other creators and teams.
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-indigo-500">
                  Browse collaboration →
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate("/register")}
              className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all hover:border-indigo-400/40 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <FiUserPlus className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Create Account
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Join the INVERSA creator community.
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-indigo-500">
                  Register →
                </div>
              </div>
            </div>
          )}

          {/* FOLLOWED */}

          <div className=" rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col">

            <h4 className=" mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widetext-slate-500">
              <FiStar className="h-4 w-4" />
              Followed
            </h4>

            <div className="flex-1 min-h-0">

              <FollowedList followedProjects={follows} />

            </div>

          </div>

          {/* HISTORY */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <FiClock className="h-4 w-4" />
              Recently Read
            </h4>

            <div className="flex-1 min-h-0">
              <HistoryList historyItems={history} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;