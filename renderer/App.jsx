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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Synchronisation GitHub
        </h1>

        {error && (
          <Alerte
            type="erreur"
            message={error}
            onFermer={() => setError(null)}
          />
        )}

        {notification && (
          <Alerte
            type={notification.type}
            message={notification.message}
            onFermer={() => setNotification(null)}
          />
        )}

        <FormulaireProjet
          cheminProjet={newProjectPath}
          setCheminProjet={setNewProjectPath}
          urlDepot={newRepoUrl}
          setUrlDepot={setNewRepoUrl}
          onSubmit={addProject}
          enChargement={loading}
        />

        <div className="space-y-4">
          {loading && (
            <div className="text-center py-4">
              <Chargement taille="grand" />
            </div>
          )}
          
          {projects.map((project) => (
            <ProjectCard
              key={project.path}
              project={project}
              onRemove={removeProject}
              onSync={syncProject}
            />
          ))}
          
          {projects.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">
              Aucun projet ajouté pour le moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
