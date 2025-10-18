# DevSecOps Skill Gap Analyzer

MVP for helping graduates identify DevSecOps skill gaps and get personalized learning paths.

## Features
- Skill assessment with multiple-choice questions
- Personalized learning path generation
- Progress tracking
- Category-based scoring (CI/CD, Security, Cloud)

## Quick Start

### Local Development
```bash
npm install
npm start
```

### Minikube Deployment
```bash
# Build Docker image
docker build -t devsecops-analyzer:latest .

# Load image into Minikube
minikube image load devsecops-analyzer:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml

# Get service URL
minikube service devsecops-analyzer-service --url
```

## API Endpoints
- `GET /api/assessment` - Get assessment questions
- `POST /api/assessment/submit` - Submit answers and get results
- `GET /api/progress/:userId` - Get user progress

## Tech Stack
- Backend: Node.js/Express
- Database: MongoDB
- Frontend: Vanilla JavaScript
- Deployment: Kubernetes/Minikube
