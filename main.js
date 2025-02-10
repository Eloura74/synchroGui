import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import simpleGit from "simple-git";

const projectsFile = path.join(app.getPath("userData"), "projects.json");
const projectsDir = path.dirname(projectsFile);

// Assurer que le dossier de configuration existe
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

const isDev = process.env.NODE_ENV !== "production";

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // En développement, on charge l'URL de Vite
  if (isDev) {
    await mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile("index.html");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Fonctions utilitaires
const saveProjects = (projects) => {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  return projects;
};

const loadProjects = () => {
  if (!fs.existsSync(projectsFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(projectsFile, "utf8"));
  } catch (error) {
    console.error("Erreur lors de la lecture des projets:", error);
    return [];
  }
};

// Gestionnaires IPC
ipcMain.handle("get-projects", async () => {
  return loadProjects();
});

ipcMain.handle("add-project", async (event, { path: projectPath, repo }) => {
  try {
    const git = simpleGit(projectPath);
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      await git.init();
      await git.addRemote("origin", repo);
    }

    const projects = loadProjects();
    const existingProject = projects.find((p) => p.path === projectPath);

    if (existingProject) {
      throw new Error("Ce projet existe déjà");
    }

    const newProject = {
      path: projectPath,
      repo,
      name: path.basename(projectPath),
      lastSync: null,
    };

    return saveProjects([...projects, newProject]);
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet:", error);
    throw error;
  }
});

ipcMain.handle("remove-project", async (event, projectPath) => {
  try {
    const projects = loadProjects();
    const updatedProjects = projects.filter((p) => p.path !== projectPath);
    return saveProjects(updatedProjects);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
});

ipcMain.handle("sync-project", async (event, { projectPath, branchName }) => {
  try {
    const git = simpleGit(projectPath);
    
    // Sauvegarder les modifications locales si nécessaire
    const status = await git.status();
    if (status.modified.length > 0 || status.not_added.length > 0) {
      await git.add('./*');
      await git.commit('Sauvegarde automatique avant synchronisation');
    }

    // Récupérer la branche actuelle
    const currentBranch = (await git.branch()).current;
    
    if (branchName && branchName !== currentBranch) {
      // Vérifier si la branche existe localement
      const localBranches = (await git.branchLocal()).all;
      const remoteBranches = (await git.branch(['-r'])).all.map(b => b.replace('origin/', ''));
      
      if (!localBranches.includes(branchName)) {
        // Si la branche existe en remote mais pas en local
        if (remoteBranches.includes(branchName)) {
          await git.checkout(['-b', branchName, `origin/${branchName}`]);
        } else {
          // Créer une nouvelle branche basée sur main
          await git.checkout(['-b', branchName, 'origin/main']);
        }
      } else {
        // Basculer sur la branche demandée
        await git.checkout(branchName);
      }
    }

    // Pull les changements de la branche actuelle
    await git.pull('origin', branchName || currentBranch);

    // Mettre à jour la configuration du projet
    const projects = loadProjects();
    const updatedProjects = projects.map(project => {
      if (project.path === projectPath) {
        return {
          ...project,
          lastSync: new Date().toISOString(),
          currentBranch: branchName || currentBranch
        };
      }
      return project;
    });

    await saveProjects(updatedProjects);

    return {
      success: true,
      message: `Synchronisation réussie sur la branche ${branchName || currentBranch}`
    };
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    throw error;
  }
});

ipcMain.handle("get-branches", async (event, projectPath) => {
  try {
    const git = simpleGit(projectPath);
    const branches = await git.branch();
    return branches.all;
  } catch (error) {
    console.error("Erreur lors de la récupération des branches:", error);
    throw error;
  }
});

ipcMain.handle("create-branch", async (event, { projectPath, branchName }) => {
  try {
    const git = simpleGit(projectPath);
    
    // Créer la nouvelle branche
    await git.checkoutLocalBranch(branchName);
    
    // Push la nouvelle branche vers GitHub
    await git.push('origin', branchName, ['--set-upstream']);
    
    return "Branche créée avec succès";
  } catch (error) {
    console.error("Erreur lors de la création de la branche:", error);
    throw error;
  }
});

ipcMain.handle("switch-branch", async (event, { projectPath, branchName }) => {
  try {
    const git = simpleGit(projectPath);
    await git.checkout(branchName);
    return "Changement de branche réussi";
  } catch (error) {
    console.error("Erreur lors du changement de branche:", error);
    throw error;
  }
});

ipcMain.handle("get-available-projects", async () => {
  try {
    // Charger les projets depuis le fichier de configuration
    const projects = loadProjects();
    
    // Transformer les projets pour inclure plus d'informations
    const availableProjects = projects.map(project => ({
      id: project.path, // Utiliser le chemin comme identifiant unique
      name: project.name,
      description: `Projet synchronisé depuis ${project.path}`,
      repo: project.repo,
      branche: project.currentBranch || "main",
      lastUpdate: project.lastSync || new Date().toISOString(),
      path: project.path
    }));

    return availableProjects;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets disponibles:", error);
    throw error;
  }
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Sélectionner le dossier de destination'
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle("clone-project", async (event, { url, nom, branche, destination }) => {
  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const git = simpleGit(destination);
    
    // Cloner le dépôt
    await git.clone(url, destination);
    
    // Vérifier si la branche existe
    const branches = await git.branch();
    const brancheExiste = branches.all.includes(branche) || branches.all.includes(`remotes/origin/${branche}`);
    
    // Si la branche existe et n'est pas la branche actuelle
    if (brancheExiste && branche !== branches.current) {
      await git.checkout(branche);
    }

    // Ajouter le projet à la liste des projets
    const projects = loadProjects();
    const newProject = {
      path: destination,
      repo: url,
      name: nom,
      lastSync: new Date().toISOString(),
      currentBranch: branche || "main"
    };

    return saveProjects([...projects, newProject]);
  } catch (error) {
    console.error("Erreur lors du clonage du projet:", error);
    throw error;
  }
});

ipcMain.handle("remove-local-project", async (event, { path: projectPath, removeFiles }) => {
  try {
    // Charger la liste des projets
    const projects = loadProjects();
    
    // Supprimer le projet de la liste
    const updatedProjects = projects.filter(project => project.path !== projectPath);
    
    // Si on doit supprimer les fichiers
    if (removeFiles && fs.existsSync(projectPath)) {
      try {
        // Fonction récursive pour supprimer un dossier et son contenu
        const deleteFolderRecursive = (path) => {
          if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file) => {
              const curPath = `${path}/${file}`;
              if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
              } else {
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(path);
          }
        };

        // Supprimer le dossier du projet
        deleteFolderRecursive(projectPath);
      } catch (error) {
        console.error("Erreur lors de la suppression des fichiers:", error);
        throw new Error("Impossible de supprimer les fichiers du projet. " + error.message);
      }
    }

    // Sauvegarder la liste mise à jour
    return saveProjects(updatedProjects);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
});
