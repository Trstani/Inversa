import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiFolder } from 'react-icons/fi';
import Button from '../../components/Button';
import SoloCard from '../../components/DashboardProjectCard';

const MyProjectsSection = ({ projects, onDelete, onCreateNew }) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="py-12 sm:py-16 md:py-20 text-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10 mx-auto mb-4">
          <FiFolder className="w-8 h-8 sm:w-10 sm:h-10 text-light-secondary dark:text-dark-secondary opacity-60" />
        </div>
        <p className="text-light-primary dark:text-dark-primary font-medium text-base sm:text-lg mb-4">
          You haven't created any projects yet
        </p>
        <Button onClick={onCreateNew}>
          <FiPlus className="mr-2" />
          Create Your First Project
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {projects.map(
        (project) => (

          <SoloCard
            key={project.id}
            project={project}
            onDelete={onDelete}
          />

        )
      )}
    </div>
  );
};

export default MyProjectsSection;
