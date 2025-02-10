import React, { useState, useEffect } from 'react';
import { FaDownload, FaCodeBranch, FaSearch, FaFolder, FaTrash } from 'react-icons/fa';

const { ipcRenderer } = window.require("electron");

export const DecouvrirProjet = () => {
  const [projetsDisponibles, setProjetsDisponibles] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPath, setSelectedPath] = useState('');
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    chargerProjetsDisponibles();
  }, []);

  const chargerProjetsDisponibles = async () => {
    try {
      setLoading(true);
      const projets = await ipcRenderer.invoke("get-available-projects");
      setProjetsDisponibles(projets);
    } catch (error) {
      setError("Erreur lors du chargement des projets disponibles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectFolder = async () => {
    try {
      const result = await ipcRenderer.invoke("select-folder");
      if (result) {
        setSelectedPath(result);
      }
    } catch (error) {
      setError("Erreur lors de la sélection du dossier");
      console.error(error);
    }
  };

  const ouvrirDialogueClone = (projet) => {
    setSelectedProject(projet);
    setShowCloneDialog(true);
  };

  const ouvrirDialogueSuppression = (projet) => {
    setSelectedProject(projet);
    setShowDeleteDialog(true);
  };

  const clonerProjet = async () => {
    if (!selectedPath) {
      setError("Veuillez sélectionner un dossier de destination");
      return;
    }

    try {
      setLoading(true);
      await ipcRenderer.invoke("clone-project", {
        url: selectedProject.repo,
        nom: selectedProject.name,
        branche: selectedProject.branche,
        destination: selectedPath
      });
      setShowCloneDialog(false);
      setSelectedProject(null);
      setSelectedPath('');
      await chargerProjetsDisponibles();
    } catch (error) {
      setError("Erreur lors du clonage du projet : " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerProjet = async () => {
    try {
      setLoading(true);
      await ipcRenderer.invoke("remove-local-project", {
        path: selectedProject.path,
        removeFiles: true // Supprimer aussi les fichiers locaux
      });
      setShowDeleteDialog(false);
      setSelectedProject(null);
      await chargerProjetsDisponibles();
    } catch (error) {
      setError("Erreur lors de la suppression du projet : " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const projetsFiltres = projetsDisponibles.filter(projet =>
    projet.name.toLowerCase().includes(recherche.toLowerCase()) ||
    projet.description.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Découvrir des Projets</h2>
        <div className="relative">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un projet..."
            className="pl-10 pr-4 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Grille de projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetsFiltres.map((projet) => (
          <div key={projet.id} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative backdrop-blur-xl bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
                    {projet.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      <FaCodeBranch className="inline mr-1" />
                      {projet.branche}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  {projet.description}
                </p>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm text-gray-500">
                    Mis à jour le {new Date(projet.lastUpdate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {projet.path && (
                      <button
                        onClick={() => ouvrirDialogueSuppression(projet)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Supprimer localement"
                      >
                        <FaTrash />
                      </button>
                    )}
                    <button
                      onClick={() => ouvrirDialogueClone(projet)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    >
                      <FaDownload />
                      <span>Cloner</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogue de clonage */}
      {showCloneDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Cloner {selectedProject?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Emplacement de destination
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={selectedPath}
                    readOnly
                    placeholder="Sélectionnez un dossier..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300"
                  />
                  <button
                    onClick={selectFolder}
                    className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg"
                  >
                    <FaFolder />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCloneDialog(false);
                    setSelectedProject(null);
                    setSelectedPath('');
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={clonerProjet}
                  disabled={!selectedPath || loading}
                  className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Clonage..." : "Cloner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue de suppression */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Supprimer {selectedProject?.name}
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                Voulez-vous vraiment supprimer ce projet de votre PC ? Cette action supprimera tous les fichiers locaux mais n'affectera pas le dépôt distant sur GitHub.
              </p>
              <p className="text-sm text-gray-500">
                Emplacement : {selectedProject?.path}
              </p>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={supprimerProjet}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
