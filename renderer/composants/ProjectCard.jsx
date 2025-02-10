import React from 'react';

export const ProjectCard = ({ project, onRemove, onSync }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-100">
            {project.name || 'Projet sans nom'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <p className="text-sm text-gray-400">Actif</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onRemove(project.path)}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Informations du projet */}
      <div className="space-y-3">
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
          <p className="text-sm text-gray-300 break-all">
            <span className="text-gray-400">Chemin : </span>
            {project.path}
          </p>
        </div>
        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
          <p className="text-sm text-gray-300 break-all">
            <span className="text-gray-400">Dépôt : </span>
            {project.repo}
          </p>
        </div>
      </div>

      {/* Pied de carte */}
      <div className="pt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {project.lastSync ? (
            <span title={new Date(project.lastSync).toLocaleString()}>
              Sync : {new Date(project.lastSync).toLocaleDateString()}
            </span>
          ) : (
            "Pas encore synchronisé"
          )}
        </div>
        <button
          onClick={() => onSync(project.path)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Synchroniser</span>
        </button>
      </div>
    </div>
  </div>
);
