import React, { useState, useEffect } from 'react';
import { FaSync, FaTrash, FaCodeBranch, FaPlus } from 'react-icons/fa';

const { ipcRenderer } = window.require("electron");

export const ProjectCard = ({ project, onRemove, onSync }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const branchesList = await ipcRenderer.invoke("get-branches", project.path);
      setBranches(branchesList);
      // Si aucune branche n'est sélectionnée, on prend la première
      if (!selectedBranch && branchesList.length > 0) {
        setSelectedBranch(branchesList[0]);
      }
    } catch (error) {
      setError("Erreur lors du chargement des branches");
      console.error(error);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      await ipcRenderer.invoke("create-branch", { 
        projectPath: project.path, 
        branchName: newBranchName.trim() 
      });
      setNewBranchName("");
      setShowNewBranch(false);
      await loadBranches();
      setSelectedBranch(newBranchName.trim());
    } catch (error) {
      setError("Erreur lors de la création de la branche");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = async (branchName) => {
    try {
      setLoading(true);
      setError(null);
      await ipcRenderer.invoke("switch-branch", { 
        projectPath: project.path, 
        branchName 
      });
      setSelectedBranch(branchName);
    } catch (error) {
      setError("Erreur lors du changement de branche");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
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
                disabled={loading}
                className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors group/btn"
                title="Synchroniser"
              >
                <span className="absolute -inset-2 bg-blue-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                <FaSync className={`${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => onRemove(project.path)}
                disabled={loading}
                className="relative p-2 text-gray-400 hover:text-red-400 transition-colors group/btn"
                title="Supprimer"
              >
                <span className="absolute -inset-2 bg-red-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                <FaTrash />
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

          {/* Gestion des branches */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-1 block">
                Branche actuelle
              </label>
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <FaCodeBranch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={() => setShowNewBranch(!showNewBranch)}
              className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors group/btn flex items-center space-x-2"
              disabled={loading}
            >
              <span className="absolute -inset-2 bg-blue-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
              <FaPlus />
              <span>Nouvelle</span>
            </button>
          </div>

          {/* Formulaire de nouvelle branche */}
          {showNewBranch && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="Nom de la nouvelle branche"
                className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-lg py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled={loading}
              />
              <button
                onClick={handleCreateBranch}
                disabled={loading || !newBranchName.trim()}
                className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors group/btn"
              >
                <span className="absolute -inset-2 bg-blue-400/10 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                Créer
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

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
          </div>
        </div>
      </div>
    </div>
  );
};
