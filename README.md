# Vue 3 + Vite Resume Template

Single-page resume and portfolio template built with Vue 3, Vite, and plain CSS. It is static-only, easy to edit from content files, works well locally with live reload, and is ready for GitHub Pages deployment.

## Prerequisites

- Node.js `20.19.0` or newer, or `22.12.0` or newer
- npm

Check your versions:

```powershell
node -v
npm -v
```

## Install

```powershell
npm install
```

## Local development

Start the Vite development server with hot reload:

```powershell
npm run dev
```

Vite will print a local URL, usually:

```text
http://127.0.0.1:4173/
```

### Windows quick launcher

You can also start the dev server by double-clicking `dev.bat`, or from a terminal:

```powershell
.\dev.bat
```

## Local production build

Create the production build:

```powershell
npm run build
```

The built files are written to `dist/`.

## Local production preview

Preview the production build locally:

```powershell
npm run preview
```

## Editing your resume content

All user-editable content lives in `src/content/` and is split by section:

- `src/content/profile.ts`
- `src/content/about.ts`
- `src/content/skills.ts`
- `src/content/experience.ts`
- `src/content/projects.ts`
- `src/content/education.ts`
- `src/content/contact.ts`

Update those files to change your name, bio, links, skills, work history, projects, education, and contact details.

## Base path setup for GitHub Pages

This project uses `VITE_BASE_PATH` to control the Vite `base` option.

### Option 1: User site or custom domain

If your site is deployed at the domain root, use:

```text
/
```

This is already the default. You do not need to set anything.

Examples:

- `https://yourusername.github.io/`
- `https://www.yourdomain.com/`

### Option 2: Project repository GitHub Pages URL

If your site is deployed to a project repo URL like `https://yourusername.github.io/REPO_NAME/`, set:

```text
/REPO_NAME/
```

PowerShell example:

```powershell
$env:VITE_BASE_PATH="/REPO_NAME/"
npm run build
```

Command Prompt example:

```bat
set VITE_BASE_PATH=/REPO_NAME/
npm run build
```

To clear it again in PowerShell:

```powershell
Remove-Item Env:VITE_BASE_PATH
```

## GitHub Pages deployment

The repository includes a workflow at `.github/workflows/deploy.yml` that builds the app and deploys `dist/` to GitHub Pages from the `main` branch.

### 1. Push the project to GitHub

Commit your files and push to the `main` branch.

### 2. Enable GitHub Pages

In your GitHub repository:

1. Open `Settings`
2. Open `Pages`
3. Under `Build and deployment`, choose `GitHub Actions`

### 3. Set the base path when needed

If this is a project repo deployment, add a repository variable:

1. Open `Settings`
2. Open `Secrets and variables`
3. Open `Actions`
4. Open the `Variables` tab
5. Create a variable named `VITE_BASE_PATH`
6. Set it to `/REPO_NAME/`

If this is a user site or custom domain deployment, leave `VITE_BASE_PATH` unset so the app uses `/`.

### 4. Deploy

Push to `main`, or manually run the workflow from the `Actions` tab.

## How the included workflow works

On each push to `main`, GitHub Actions will:

1. Check out the repository
2. Install dependencies with `npm ci`
3. Build the site with `npm run build`
4. Upload the `dist/` folder as the Pages artifact
5. Deploy the artifact to GitHub Pages

If `VITE_BASE_PATH` exists as a repository variable, that value is passed into the build automatically.

## Custom domain later

If you connect a custom domain later:

1. Configure the domain in your DNS provider
2. Open your repository `Settings > Pages`
3. Set the custom domain there
4. Leave `VITE_BASE_PATH` unset so the site builds with `/`

If you want GitHub Pages to serve a committed `CNAME` file, add `public/CNAME` with your domain name before building.

## Project scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Project structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- src/
|   |-- components/
|   |-- content/
|   |-- App.vue
|   |-- main.ts
|   `-- styles.css
|-- dev.bat
|-- index.html
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```
