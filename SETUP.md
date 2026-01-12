# Setup Instructions for New Developers

## First Time Setup

When cloning this repository for the first time, follow these steps:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd next-js-remotion
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

Create a `.env` file in the project root with your GitLab credentials:

```bash
GITLAB_TOKEN=your-username:your-token
```

Ask your team lead for the credentials if you don't have them.

### 4. Install Remotion Compositions

The `@getmoments/remotion-rendering` package is **not** in `package.json` to keep credentials secure. Install it manually:

```bash
./update-remotion.sh
```

This script will:
- Load your `.env` file
- Install the remotion compositions from GitLab
- Clear caches

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Why This Setup?

**Q: Why isn't `@getmoments/remotion-rendering` in package.json?**

A: To prevent GitLab credentials from being committed to the repository. The package requires authentication, so it must be installed manually using environment variables.

**Q: Do I need to run `./update-remotion.sh` every time?**

A: Only when:
- First time setup
- After `npm install` or `npm ci` (which removes the package)
- When you want to update to the latest compositions

**Q: What if I get "Cannot find module '@getmoments/remotion-rendering'"?**

A: Run `./update-remotion.sh` to install the package.

## For CI/CD

In your CI/CD pipeline, add the `GITLAB_TOKEN` as a secret environment variable and run:

```bash
export GITLAB_TOKEN="username:token"
npm install
npm install --no-save git+https://${GITLAB_TOKEN}@git.ximilar.com/getmoments/video/remotion-rendering.git#exports
npm run build
```

## Team Members

Make sure every developer has:
1. GitLab account with access to the `remotion-rendering` repository
2. Personal access token or credentials
3. The `.env` file configured locally

---

**Need help?** See the main [README.md](./README.md) or ask the team.
