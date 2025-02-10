import React from 'react';

export const ProjectCard = ({ project, onRemove, onSync }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {project.name || 'Projet sans nom'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{project.path}</p>
        <p className="text-xs text-gray-500 mt-1">{project.repo}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onSync(project.path)}
          className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-md text-sm transition-colors"
        >
          Synchroniser
        </button>
        <button
          onClick={() => onRemove(project.path)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
    {project.lastSync && (
      <p className="text-xs text-gray-500 mt-2">
        Dernière synchronisation : {new Date(project.lastSync).toLocaleString()}
      </p>
    )}
  </div>
);
