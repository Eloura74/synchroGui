const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getProjects: () => ipcRenderer.invoke("get-projects"),
  addProject: (project) => ipcRenderer.invoke("add-project", project),
  removeProject: (path) => ipcRenderer.invoke("remove-project", path),
  syncProject: (path, repo) => ipcRenderer.invoke("sync-project", path, repo),
});
