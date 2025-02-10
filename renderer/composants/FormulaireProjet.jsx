import React from 'react';
import { Chargement } from './Chargement';

export const FormulaireProjet = ({
  cheminProjet,
  setCheminProjet,
  urlDepot,
  setUrlDepot,
  onSubmit,
  enChargement
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ajouter un nouveau projet
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chemin du projet
          </label>
          <input
            type="text"
            value={cheminProjet}
            onChange={(e) => setCheminProjet(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="C:/mon-projet"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL du dépôt GitHub
          </label>
          <input
            type="text"
            value={urlDepot}
            onChange={(e) => setUrlDepot(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://github.com/utilisateur/depot.git"
          />
        </div>
        <button
          type="submit"
          disabled={enChargement}
          className={`w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors ${
            enChargement ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {enChargement ? (
            <div className="flex items-center justify-center">
              <Chargement taille="petit" />
              <span className="ml-2">Chargement...</span>
            </div>
          ) : (
            'Ajouter le projet'
          )}
        </button>
      </div>
    </form>
  );
};
