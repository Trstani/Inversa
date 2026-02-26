import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById, loadChapters } from '../utils/dataManager';
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button';

const ChapterReader = () => {
  const { projectId, chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);

        const allChapters = await loadChapters(projectId);
        // Filter only published chapters for non-initiators
        const visibleChapters = user?.id === projectData?.initiatorId
          ? allChapters
          : allChapters.filter(c => c.status === 'published');

        setChapters(visibleChapters);

        if (chapterId) {
          const chapter = visibleChapters.find(c => c.id === parseInt(chapterId));
          if (chapter) {
            setCurrentChapter(chapter);
            setCurrentIndex(visibleChapters.findIndex(c => c.id === chapter.id));
          } else if (visibleChapters.length > 0) {
            setCurrentChapter(visibleChapters[0]);
            setCurrentIndex(0);
          }
        } else if (visibleChapters.length > 0) {
          setCurrentChapter(visibleChapters[0]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadData();
    }
  }, [projectId, chapterId, user?.id]);

  const handlePreviousChapter = () => {
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1];
      setCurrentChapter(prevChapter);
      setCurrentIndex(currentIndex - 1);
      navigate(`/read/${projectId}/${prevChapter.id}`);
    }
  };

  const handleNextChapter = () => {
    if (currentIndex < chapters.length - 1) {
      const nextChapter = chapters[currentIndex + 1];
      setCurrentChapter(nextChapter);
      setCurrentIndex(currentIndex + 1);
      navigate(`/read/${projectId}/${nextChapter.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No chapters available</p>
          <Button onClick={() => navigate(`/project/${projectId}`)}>Back to Project</Button>
        </div>
      </div>
    );
  }
  console.log(currentChapter.sections);

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="flex items-center gap-2 text-light-accent dark:text-dark-accent hover:opacity-80 mb-4"
          >
            <FiArrowLeft /> Back to Project
          </button>

          <div className="card p-6 mb-6">
            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-2">
              {project.title}
            </p>
            <h1 className="text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h1>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">
              {currentIndex + 1} of {chapters.length}
            </p>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="card p-8 mb-8 prose dark:prose-invert max-w-none">
          <div className="text-light-primary dark:text-dark-primary leading-relaxed">

            {currentChapter.sections?.map((section, index) => {
              if (section.type === "text") {
                return (
                  <div
                    key={section.id}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                );
              }

              if (section.type === "image") {
                return (
                  <div key={section.id} className="my-6">
                    <img
                      src={section.imageUrl}
                      alt="illustration"
                      className="w-full h-auto rounded-xl"
                    />
                    {section.caption && (
                      <p className="text-sm text-center text-gray-500 mt-2">
                        {section.caption}
                      </p>
                    )}
                  </div>
                );
              }

              return null;
            })}

          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePreviousChapter}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-light-secondary dark:text-dark-secondary">
              Chapter {currentIndex + 1} of {chapters.length}
            </p>
          </div>

          <button
            onClick={handleNextChapter}
            disabled={currentIndex === chapters.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-light-surface dark:bg-dark-surface rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next <FiChevronRight />
          </button>
        </div>

        {/* Chapter List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Chapters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setCurrentChapter(chapter);
                  setCurrentIndex(index);
                  navigate(`/read/${projectId}/${chapter.id}`);
                }}
                className={`p-3 rounded-lg text-left transition ${currentChapter.id === chapter.id
                  ? 'bg-light-accent text-white dark:bg-dark-accent'
                  : 'bg-light-surface dark:bg-dark-surface hover:bg-light-accent/10 dark:hover:bg-dark-accent/10'
                  }`}
              >
                <p className="font-medium">Chapter {chapter.chapterNumber}</p>
                <p className="text-sm opacity-75 truncate">{chapter.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;

