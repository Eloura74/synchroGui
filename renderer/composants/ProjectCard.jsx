import React from 'react';

export const ProjectCard = ({ project, onRemove, onSync }) => (
  <div className="group relative">
    {/* Effet de brillance au survol */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
    
    {/* Carte principale */}
    <div className="relative backdrop-blur-xl bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 shadow-xl transform transition duration-300 group-hover:translate-y-[-2px]">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                {project.name || 'Projet sans nom'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-400">Actif</span>
              </div>
            </div>
          </div>
          
          {/* Menu d'actions */}
          <div className="flex -space-x-2">
            <button
              onClick={() => onSync(project.path)}
              className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors group/btn"
              title="Synchroniser"
            >
              <span className="absolute -inset-2 bg-blue-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => onRemove(project.path)}
              className="relative p-2 text-gray-400 hover:text-red-400 transition-colors group/btn"
              title="Supprimer"
            >
              <span className="absolute -inset-2 bg-red-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Informations du projet */}
        <div className="space-y-3">
          <div className="bg-gray-800/30 rounded-xl p-3 group-hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm text-gray-300 break-all">
                {project.path}
              </p>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-3 group-hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <p className="text-sm text-gray-300 break-all">
                {project.repo}
              </p>
            </div>
          </div>
        </div>

        {/* Pied de carte */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-400">
            {project.lastSync ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span title={new Date(project.lastSync).toLocaleString()}>
                  {new Date(project.lastSync).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-500/70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Non synchronisé</span>
              </div>
            )}
          </div>
          
          {/* Bouton de synchronisation */}
          <button
            onClick={() => onSync(project.path)}
            className="relative group/sync"
          >
            <span className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-lg blur-sm opacity-0 group-hover/sync:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center space-x-1 text-xs font-medium text-gray-300 hover:text-blue-400 transition-colors">
              <span>Synchroniser</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
