# E-commerce Website Deployment - Commands Documentation

## Commands Implemented and Their Functions

### 1. Git Initialization Commands

```bash
git init
```
**Purpose**: Initializes a new Git repository in the current directory
**What it does**: Creates a `.git` folder that tracks all changes to your project files

```bash
git add .
```
**Purpose**: Stages all files for the next commit
**What it does**: Adds all files in the current directory and subdirectories to the Git staging area

```bash
git commit -m "Initial commit: Complete E-commerce website with React and Node.js backend"
```
**Purpose**: Creates the first commit with a descriptive message
**What it does**: Saves a snapshot of all staged files with the given message as the commit description

```bash
git branch -M main
```
**Purpose**: Renames the default branch to 'main'
**What it does**: Changes the current branch name from 'master' to 'main' (GitHub's standard)

### 2. Build Commands

```bash
npm run build
```
**Purpose**: Builds the React application for production
**What it does**: Creates an optimized `dist` folder with minified CSS, JS, and HTML files ready for deployment

### 3. GitHub Repository Setup (Manual Steps)

**Step 1**: Create repository on GitHub
- Go to https://github.com
- Click "+" > "New repository"
- Name: `E-commerce-Website`
- Description: `Modern E-commerce website built with React, Node.js, and Tailwind CSS`
- Public repository
- Don't initialize with README

**Step 2**: Connect local repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/E-commerce-Website.git
```
**Purpose**: Links your local repository to the GitHub repository
**What it does**: Sets up a connection between your local Git and the remote GitHub repository

```bash
git push -u origin main
```
**Purpose**: Pushes your local commits to GitHub
**What it does**: Uploads all your committed files to the GitHub repository and sets up tracking

### 4. Vercel Deployment Commands

**Step 1**: Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```
**Purpose**: Installs Vercel globally on your system
**What it does**: Makes the `vercel` command available from anywhere in your terminal

**Step 2**: Deploy to Vercel
```bash
vercel
```
**Purpose**: Deploys your application to Vercel
**What it does**: 
- Analyzes your project structure
- Builds the application
- Deploys to Vercel's servers
- Provides a live URL

**Step 3**: Deploy to production
```bash
vercel --prod
```
**Purpose**: Deploys to Vercel's production environment
**What it does**: Same as regular deployment but to the main production URL instead of preview

### 5. Configuration Files Created

**vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```
**Purpose**: Tells Vercel how to build and route your application
**What it does**: 
- Configures build settings for React frontend
- Sets up serverless function for Node.js backend
- Defines routing rules for API calls and static files

## Summary of the Process

1. **Git Setup**: Initialized local Git repository and committed all files
2. **GitHub Setup**: Created remote repository and prepared for push
3. **Build Verification**: Confirmed the application builds successfully
4. **Vercel Configuration**: Set up deployment configuration for both frontend and backend
5. **Deployment Ready**: Project is ready for GitHub push and Vercel deployment

## Next Steps

1. Create the GitHub repository manually
2. Run the git remote and push commands
3. Deploy to Vercel using the Vercel CLI
4. Your E-commerce website will be live!
