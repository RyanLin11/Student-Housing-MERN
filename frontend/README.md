# Frontend

## Getting Started

### Step 1: Add Environment Variables
Create a `.env` file with the following contents:
```
REACT_APP_API_KEY=<key> # A Google Maps Javascript API key
REACT_APP_API_URL=<url> # The URL to the backend application
```

### Step 2: Run Dev Environment
Prerequisite: Make sure Docker is installed. 
1. Run `make setup` to initialize a volume to hold node_modules.
2. Run `make install` to populate the volume with node packages.
3. Run `make dev` to build and run the frontend container, which uses the node_modules external volume.

### Step 3: Deploying
There is a `Dockerfile` configured for production.
If you are a contributor to this repository, note that this app is deployed on Netlify. Netlify has CI/CD set up that deploys on pushes to the `master` branch. 