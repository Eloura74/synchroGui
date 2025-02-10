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

ipcMain.handle("sync-project", async (event, projectPath) => {
  try {
    const git = simpleGit(projectPath);
    
    // Vérifier les changements locaux
    const status = await git.status();
    
    if (status.modified.length > 0 || status.not_added.length > 0) {
      await git.add("./*");
      await git.commit("Synchronisation automatique");
    }
    
    // Pull les changements distants
    await git.pull("origin", "main");
    
    // Push les changements locaux
    await git.push("origin", "main");
    
    // Mettre à jour la date de dernière synchronisation
    const projects = loadProjects();
    const updatedProjects = projects.map((p) =>
      p.path === projectPath
        ? { ...p, lastSync: new Date().toISOString() }
        : p
    );
    
    saveProjects(updatedProjects);
    
    return "Synchronisation réussie";
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    throw error;
  }
});
