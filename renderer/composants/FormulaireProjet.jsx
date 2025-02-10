import React, { useState } from 'react';
import { Chargement } from './Chargement';

export const FormulaireProjet = ({
  newProjectPath,
  setNewProjectPath,
  newRepoUrl,
  setNewRepoUrl,
  onSubmit,
  loading
}) => {
  const [focusedField, setFocusedField] = useState(null);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* En-tête avec effet de soulignement animé */}
      <div className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-100">
              Nouveau Projet
            </h2>
            <p className="text-sm text-gray-400">
              Configurez votre projet pour la synchronisation automatique
            </p>
          </div>
          <span className="px-3 py-1 text-xs text-gray-400 border border-gray-700 rounded-full bg-gray-800/50">
            Tous les champs requis
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Champ Chemin du Projet */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl blur opacity-0 transition duration-300 ${
            focusedField === 'path' ? 'opacity-25' : 'group-hover:opacity-15'
          }`}></div>
          <div className="relative space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>Chemin du Projet Local</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <input
                type="text"
                value={newProjectPath}
                onChange={(e) => setNewProjectPath(e.target.value)}
                onFocus={() => setFocusedField('path')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-500 transition-colors"
                placeholder="C:/mon-projet"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {newProjectPath && (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Champ URL du Dépôt */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl blur opacity-0 transition duration-300 ${
            focusedField === 'repo' ? 'opacity-25' : 'group-hover:opacity-15'
          }`}></div>
          <div className="relative space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>URL du Dépôt GitHub</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <input
                type="text"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                onFocus={() => setFocusedField('repo')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-100 placeholder-gray-500 transition-colors"
                placeholder="https://github.com/utilisateur/depot.git"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {newRepoUrl && (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de soumission avec effet de brillance */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur opacity-75 group-hover:opacity-100 animate-pulse transition duration-300"></div>
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3 bg-gray-900 text-gray-100 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Chargement />
              <span>Création en cours...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Créer le Projet</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
