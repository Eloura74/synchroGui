import { app, BrowserWindow, ipcMain } from "electron";
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
      currentBranch: null,
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

ipcMain.handle("get-branches", async (event, projectPath) => {
  try {
    const git = simpleGit(projectPath);
    const branchSummary = await git.branch();
    const branches = Object.keys(branchSummary.branches);
    return branches;
  } catch (error) {
    console.error("Erreur lors de la récupération des branches:", error);
    throw new Error("Impossible de récupérer les branches: " + error.message);
  }
});

ipcMain.handle("create-branch", async (event, { projectPath, branchName }) => {
  try {
    const git = simpleGit(projectPath);
    
    // Vérifier si la branche existe déjà
    const branchSummary = await git.branch();
    if (branchSummary.branches[branchName]) {
      throw new Error("Cette branche existe déjà");
    }

    // Créer et basculer sur la nouvelle branche
    await git.checkoutLocalBranch(branchName);
    
    // Mettre à jour le projet avec la branche actuelle
    const projects = loadProjects();
    const updatedProjects = projects.map((p) =>
      p.path === projectPath
        ? { ...p, currentBranch: branchName }
        : p
    );
    saveProjects(updatedProjects);

    return "Branche créée avec succès";
  } catch (error) {
    console.error("Erreur lors de la création de la branche:", error);
    throw new Error("Impossible de créer la branche: " + error.message);
  }
});

ipcMain.handle("sync-project", async (event, { projectPath, branchName }) => {
  try {
    const git = simpleGit(projectPath);
    
    // Vérifier si la branche existe
    const branchSummary = await git.branch();
    if (!branchSummary.branches[branchName]) {
      throw new Error("La branche spécifiée n'existe pas");
    }

    // Basculer sur la branche si nécessaire
    if (branchSummary.current !== branchName) {
      await git.checkout(branchName);
    }

    // Vérifier les changements locaux
    const status = await git.status();
    if (status.modified.length > 0 || status.not_added.length > 0) {
      await git.add("./*");
      await git.commit("Synchronisation automatique");
    }
    
    try {
      // Pull avec gestion des conflits
      await git.pull("origin", branchName, {"--no-rebase": null});
    } catch (pullError) {
      // En cas de conflit, on annule les changements locaux
      await git.reset(["--hard", "HEAD"]);
      await git.clean("f", ["-d"]);
      // Réessayer le pull
      await git.pull("origin", branchName, {"--no-rebase": null});
    }
    
    // Push les changements
    await git.push(["origin", branchName]);
    
    // Mettre à jour la date de dernière synchronisation
    const projects = loadProjects();
    const updatedProjects = projects.map((p) =>
      p.path === projectPath
        ? { ...p, lastSync: new Date().toISOString(), currentBranch: branchName }
        : p
    );
    
    saveProjects(updatedProjects);
    
    return "Synchronisation réussie";
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    throw new Error("Erreur de synchronisation: " + error.message);
  }
});
