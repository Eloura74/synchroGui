import React, { useState, useEffect } from 'react';
import { FaSync, FaTrash, FaCodeBranch, FaPlus } from 'react-icons/fa';

const { ipcRenderer } = window.require("electron");

export const ProjectCard = ({ project, onRemove, onSync }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(project.currentBranch || 'main');
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [showNewBranch, setShowNewBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const branchesList = await ipcRenderer.invoke("get-branches", project.path);
      setBranches(branchesList);
      if (!selectedBranch && branchesList.length > 0) {
        setSelectedBranch(branchesList[0]);
      }
    } catch (error) {
      setError("Erreur lors du chargement des branches");
      console.error(error);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      await ipcRenderer.invoke('sync-project', { 
        projectPath: project.path,
        branchName: selectedBranch
      });
      if (onSync) onSync();
    } catch (error) {
      setError("Erreur de synchronisation: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
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

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative backdrop-blur-xl bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
        <div className="space-y-4">
          {/* En-tête */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {project.path}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBranchSelector(!showBranchSelector)}
                className="px-3 py-1 text-sm bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg flex items-center space-x-1"
              >
                <FaCodeBranch className="mr-1" />
                <span>{selectedBranch}</span>
              </button>
            </div>
          </div>

          {showBranchSelector && (
            <div className="mt-2 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">
                  Sélectionner une branche
                </span>
                <button
                  onClick={() => setShowNewBranch(!showNewBranch)}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <FaPlus className="mr-1" size={12} />
                  Nouvelle
                </button>
              </div>
              
              {showNewBranch && (
                <div className="mb-2 flex space-x-2">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Nom de la branche"
                    className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-lg py-1 px-2 text-sm text-gray-300"
                  />
                  <button
                    onClick={handleCreateBranch}
                    disabled={!newBranchName.trim() || loading}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                  >
                    Créer
                  </button>
                </div>
              )}

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {branches.map((branche) => (
                  <button
                    key={branche}
                    onClick={() => {
                      setSelectedBranch(branche);
                      setShowBranchSelector(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      branche === selectedBranch
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'hover:bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {branche}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <span className="text-sm text-gray-500">
              Dernière synchro : {project.lastSync ? new Date(project.lastSync).toLocaleString() : 'Jamais'}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={onRemove}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Supprimer"
              >
                <FaTrash />
              </button>
              <button
                onClick={handleSync}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  loading
                    ? 'bg-gray-700/50 text-gray-400'
                    : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                } rounded-lg transition-colors`}
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Synchronisation...' : 'Synchroniser'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
