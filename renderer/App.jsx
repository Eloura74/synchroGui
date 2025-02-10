import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "/src/styles/tailwind.css";
import { ProjectCard } from './composants/ProjectCard';
import { Alerte } from './composants/Alerte';
import { FormulaireProjet } from './composants/FormulaireProjet';
import { Chargement } from './composants/Chargement';

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectPath, setNewProjectPath] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              SynchroGui
            </h1>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 rounded-full bg-gray-700 text-sm font-medium">
                {projects.length} Projets
              </span>
            </div>
          </div>
        </header>

        {/* Notifications et Alertes */}
        <div className="space-y-4 mb-8">
          {loading && <Chargement />}
          {error && <Alerte type="erreur" message={error} onClose={() => setError(null)} />}
          {notification && (
            <Alerte
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}
        </div>

        {/* Formulaire d'ajout */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-700">
          <FormulaireProjet
            newProjectPath={newProjectPath}
            setNewProjectPath={setNewProjectPath}
            newRepoUrl={newRepoUrl}
            setNewRepoUrl={setNewRepoUrl}
            onSubmit={addProject}
            loading={loading}
          />
        </div>

        {/* Liste des projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.path}
              project={project}
              onSync={() => syncProject(project.path)}
              onRemove={() => removeProject(project.path)}
            />
          ))}
          
          {/* Carte "Ajouter un projet" */}
          {projects.length === 0 && (
            <div className="col-span-full">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-600">
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">Aucun projet</h3>
                  <p>Commencez par ajouter votre premier projet de synchronisation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
