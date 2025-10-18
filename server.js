const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/devsecops');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  assessmentResults: Object,
  learningPath: Array,
  progress: Object
});

const User = mongoose.model('User', userSchema);

// Assessment questions
const questions = [
  {
    id: 1,
    category: "CI/CD",
    question: "What is the primary purpose of a CI/CD pipeline?",
    options: ["Code storage", "Automated testing and deployment", "Bug tracking", "Documentation"],
    correct: 1
  },
  {
    id: 2,
    category: "Security",
    question: "What does SAST stand for?",
    options: ["Static Application Security Testing", "Secure Application Software Testing", "System Application Security Tool", "Software Application Security Test"],
    correct: 0
  },
  {
    id: 3,
    category: "Cloud",
    question: "Which AWS service is primarily used for container orchestration?",
    options: ["EC2", "EKS", "S3", "RDS"],
    correct: 1
  },
  {
    id: 4,
    category: "Security",
    question: "What is the OWASP Top 10?",
    options: ["Top 10 programming languages", "Top 10 web application security risks", "Top 10 cloud providers", "Top 10 DevOps tools"],
    correct: 1
  },
  {
    id: 5,
    category: "CI/CD",
    question: "What is Infrastructure as Code (IaC)?",
    options: ["Writing code in infrastructure", "Managing infrastructure through code", "Coding on servers", "Infrastructure documentation"],
    correct: 1
  },
  {
    id: 6,
    category: "Cloud",
    question: "What is the principle of least privilege?",
    options: ["Give maximum access to all users", "Give minimum required access to users", "Remove all user access", "Give access based on seniority"],
    correct: 1
  },
  {
    id: 7,
    category: "Security",
    question: "What is DAST in security testing?",
    options: ["Dynamic Application Security Testing", "Data Application Security Tool", "Direct Application Security Test", "Database Application Security Testing"],
    correct: 0
  },
  {
    id: 8,
    category: "CI/CD",
    question: "What is the purpose of automated testing in CI/CD?",
    options: ["Slow down deployment", "Catch bugs early and ensure quality", "Increase manual work", "Replace developers"],
    correct: 1
  },
  {
    id: 9,
    category: "Cloud",
    question: "What is container security scanning?",
    options: ["Scanning for container sizes", "Checking containers for vulnerabilities", "Counting containers", "Container performance monitoring"],
    correct: 1
  },
  {
    id: 10,
    category: "Security",
    question: "What is the purpose of security compliance frameworks?",
    options: ["Increase complexity", "Provide security guidelines and standards", "Reduce security", "Eliminate audits"],
    correct: 1
  }
];

// Routes
app.get('/api/assessment', (req, res) => {
  res.json(questions);
});

app.post('/api/assessment/submit', async (req, res) => {
  const { answers, userInfo } = req.body;
  
  let score = 0;
  const results = {};
  
  answers.forEach((answer, index) => {
    const question = questions[index];
    const isCorrect = answer === question.correct;
    if (isCorrect) score++;
    
    if (!results[question.category]) results[question.category] = { correct: 0, total: 0 };
    results[question.category].total++;
    if (isCorrect) results[question.category].correct++;
  });

  const learningPath = generateLearningPath(results);
  
  const user = new User({
    ...userInfo,
    assessmentResults: results,
    learningPath,
    progress: {}
  });
  
  await user.save();
  
  res.json({ score, results, learningPath, userId: user._id });
});

function generateLearningPath(results) {
  const path = [];
  
  Object.entries(results).forEach(([category, data]) => {
    const percentage = (data.correct / data.total) * 100;
    if (percentage < 70) {
      path.push({
        category,
        priority: percentage < 30 ? 'High' : 'Medium',
        resources: getResourcesForCategory(category)
      });
    }
  });
  
  return path.sort((a, b) => a.priority === 'High' ? -1 : 1);
}

function getResourcesForCategory(category) {
  const resources = {
    "CI/CD": [
      "Jenkins Pipeline Tutorial",
      "GitHub Actions Hands-on Lab", 
      "Docker & Kubernetes Fundamentals",
      "GitLab CI/CD Best Practices",
      "Infrastructure as Code with Terraform"
    ],
    "Security": [
      "OWASP Top 10 Deep Dive",
      "Security Testing Tools (SAST/DAST)",
      "Vulnerability Assessment & Management",
      "Secure Code Review Practices",
      "Application Security Fundamentals"
    ],
    "Cloud": [
      "AWS Security Best Practices",
      "Kubernetes Security Hardening",
      "Cloud Compliance & Governance",
      "Container Security Scanning",
      "Identity & Access Management (IAM)"
    ]
  };
  return resources[category] || [];
}

app.get('/api/progress/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user?.progress || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
