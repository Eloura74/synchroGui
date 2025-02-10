# 🔄 SynchroGui

<div align="center">

> Une interface graphique moderne pour la synchronisation automatique de fichiers, développée avec Electron, React et Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=flat&logo=electron&logoColor=9FEAF9)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[📖 Documentation](#-documentation) •
[🚀 Installation](#-installation) •
[💡 Utilisation](#-utilisation) •
[🔧 Configuration](#-configuration) •
[📝 Notes](#-notes)

![Interface de SynchroGui](https://via.placeholder.com/800x400?text=SynchroGui+Interface)

</div>

## 📑 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [📦 Prérequis](#-prérequis)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [💻 Utilisation](#-utilisation)
- [🔧 Dépannage](#-dépannage)
- [📝 Notes](#-notes)
- [🤝 Contribution](#-contribution)
- [📫 Support](#-support)
- [📜 License](#-license)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales
- 📂 Synchronisation automatique de dossiers
- 🔄 Synchronisation en temps réel
- 📊 Tableau de bord de surveillance
- 🔔 Système de notifications
- 📝 Journalisation des activités

### 🎨 Interface Utilisateur
- 🌈 Design moderne avec Tailwind CSS
- 🌙 Mode sombre / Mode clair
- 📱 Interface responsive
- 🖱️ Navigation intuitive
- 📊 Visualisation des statuts

## 📦 Prérequis

### Environnement de Développement
- [Node.js](https://nodejs.org/) (version 14.x ou supérieure)
- [npm](https://www.npmjs.com/) (version 6.x ou supérieure)
- [Git](https://git-scm.com/) (version 2.x ou supérieure)

### Dépendances Principales
```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

## 🚀 Installation

### 1️⃣ Clonage du Projet
```bash
# Clonez le dépôt
git clone https://github.com/Eloura74/synchroGui.git

# Accédez au répertoire
cd synchroGui
```

### 2️⃣ Installation des Dépendances
```bash
# Installation des packages
npm install
```

### 3️⃣ Configuration du Projet
1. Créez un fichier `.env` à partir du modèle `.env.example`
2. Configurez vos variables d'environnement

### 4️⃣ Lancement de l'Application
```bash
# Mode développement
npm run dev

# Build de production
npm run build
```

## ⚙️ Configuration

### Structure des Fichiers
```
synchroGui/
├── src/
│   ├── styles/
│   │   ├── main.css
│   │   └── tailwind.css
│   ├── renderer/
│   │   ├── components/
│   │   └── App.jsx
│   └── main.js
├── .gitignore
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Fichiers Ignorés (.gitignore)
```gitignore
# Dépendances
node_modules/

# Build
gui-synch-win32-x64/

# Environnement
.env
.env.local

# Logs
*.log
```

## 💻 Utilisation

### 🎯 Interface Principale
1. **Barre de Navigation**
   - Menu principal
   - Bouton de configuration
   - Statut de connexion

2. **Tableau de Bord**
   - Liste des projets
   - État des synchronisations
   - Statistiques en temps réel

### 📂 Gestion des Projets
1. **Création d'un Projet**
   - Cliquez sur "+" pour ajouter
   - Remplissez les informations :
     - Nom du projet
     - Dossier source
     - Dossier destination
     - Fréquence de synchronisation

2. **Configuration des Synchronisations**
   - Options de synchronisation
   - Planification
   - Filtres de fichiers

### 🔔 Notifications
- Alertes de synchronisation
- Erreurs et avertissements
- Statut des tâches

## 🔧 Dépannage

### Problèmes Courants
1. **L'application ne démarre pas**
   - Vérifiez Node.js et npm
   - Réinstallez les dépendances
   - Consultez les logs

2. **Erreurs de Synchronisation**
   - Vérifiez les permissions
   - Contrôlez l'espace disque
   - Validez les chemins

### Logs et Diagnostics
- Emplacement des logs : `./logs/`
- Niveaux de log : INFO, WARN, ERROR
- Rotation des logs automatique

## 📝 Notes

### Bonnes Pratiques
- Sauvegardez avant synchronisation
- Vérifiez régulièrement les logs
- Maintenez vos dépendances à jour

### Limitations Connues
- Taille maximale de fichier : 2GB
- Maximum 10 projets simultanés
- Certains types de fichiers exclus

## 🤝 Contribution

### Guide de Contribution
1. Fork le projet
2. Créez votre branche
3. Commitez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### Standards de Code
- ESLint pour JavaScript/React
- Prettier pour le formatage
- Tests unitaires requis

## 📫 Support

### Ressources
- [Documentation complète](https://github.com/Eloura74/synchroGui/wiki)
- [FAQ](https://github.com/Eloura74/synchroGui/wiki/FAQ)
- [Guide de dépannage](https://github.com/Eloura74/synchroGui/wiki/Troubleshooting)

### Contact
- [Créer une Issue](https://github.com/Eloura74/synchroGui/issues)
- [Discussions](https://github.com/Eloura74/synchroGui/discussions)

## 📜 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">
  <sub>Développé avec ❤️ par <a href="https://github.com/Eloura74">Eloura74</a></sub>
  
  [![Suivez-moi](https://img.shields.io/github/followers/Eloura74?label=Follow&style=social)](https://github.com/Eloura74)
</div>
