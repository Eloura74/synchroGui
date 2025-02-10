import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "/src/styles/tailwind.css";
import { ProjectCard } from './composants/ProjectCard';
import { Alerte } from './composants/Alerte';
import { FormulaireProjet } from './composants/FormulaireProjet';
import { Chargement } from './composants/Chargement';
import { DecouvrirProjet } from './composants/DecouvrirProjet';

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectPath, setNewProjectPath] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [ongletActif, setOngletActif] = useState("projets"); // "projets" ou "decouvrir"

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const loadedProjects = await ipcRenderer.invoke("get-projects");
      setProjects(loadedProjects);
    } catch (err) {
      setError("Erreur lors du chargement des projets");
      console.error("Erreur de chargement:", err);
    }
  };

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProjectPath || !newRepoUrl) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedProjects = await ipcRenderer.invoke("add-project", {
        path: newProjectPath,
        repo: newRepoUrl,
      });
      setProjects(updatedProjects);
      setNewProjectPath("");
      setNewRepoUrl("");
      setNotification({
        type: 'succes',
        message: 'Projet ajouté avec succès'
      });
    } catch (err) {
      setError("Erreur lors de l'ajout du projet : " + err.message);
      console.error("Erreur d'ajout:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (path) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }

    try {
      const updatedProjects = await ipcRenderer.invoke("remove-project", path);
      setProjects(updatedProjects);
      setNotification({
        type: 'succes',
        message: 'Projet supprimé avec succès'
      });
    } catch (err) {
      setError("Erreur lors de la suppression du projet");
      console.error("Erreur de suppression:", err);
    }
  };

  const syncProject = async (path) => {
    setLoading(true);
    setError(null);
    
    try {
      await ipcRenderer.invoke("sync-project", path);
      await loadProjects();
      setNotification({
        type: 'succes',
        message: 'Synchronisation réussie'
      });
    } catch (err) {
      setError("Erreur lors de la synchronisation : " + err.message);
      console.error("Erreur de synchronisation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-gray-100">
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -inset-[10px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] animate-[grain_8s_steps(10)_infinite]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* En-tête avec effet de glassmorphisme */}
        <header className="mb-12 backdrop-blur-xl bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <h1 className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                  SynchroGui
                </h1>
              </div>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent hidden md:block"></div>
              <span className="px-4 py-2 rounded-full bg-gray-800/50 text-sm font-medium border border-gray-700/50 shadow-inner">
                {projects.length} {projects.length > 1 ? 'Projets' : 'Projet'}
              </span>
            </div>

            {/* Onglets */}
            <div className="flex space-x-4">
              <button
                onClick={() => setOngletActif("projets")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ongletActif === "projets"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Mes Projets
              </button>
              <button
                onClick={() => setOngletActif("decouvrir")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  ongletActif === "decouvrir"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Découvrir
              </button>
            </div>
          </div>
        </header>

        {/* Notifications et Alertes avec animation */}
        <div className="space-y-4 mb-8">
          {loading && (
            <div className="animate-fade-in">
              <Chargement />
            </div>
          )}
          {error && (
            <div className="animate-slide-in-top">
              <Alerte type="erreur" message={error} onClose={() => setError(null)} />
            </div>
          )}
          {notification && (
            <div className="animate-slide-in-top">
              <Alerte
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
        </div>

        {/* Contenu principal */}
        {ongletActif === "projets" ? (
          <>
            {/* Formulaire d'ajout avec effet de glassmorphisme */}
            <div className="backdrop-blur-xl bg-gray-900/30 rounded-2xl p-8 shadow-xl border border-gray-700/50 mb-12 transform hover:scale-[1.01] transition-all duration-300">
              <FormulaireProjet
                newProjectPath={newProjectPath}
                setNewProjectPath={setNewProjectPath}
                newRepoUrl={newRepoUrl}
                setNewRepoUrl={setNewRepoUrl}
                onSubmit={addProject}
                loading={loading}
              />
            </div>

            {/* Liste des projets avec animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.path}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard
                    project={project}
                    onSync={() => syncProject(project.path)}
                    onRemove={() => removeProject(project.path)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <DecouvrirProjet />
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
