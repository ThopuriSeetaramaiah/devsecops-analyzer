const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const { awsCertifications, courses } = require('./certifications');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'devsecops.analyzer@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

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

app.get('/api/certifications', (req, res) => {
  res.json(Object.keys(awsCertifications).map(key => ({
    id: key,
    name: awsCertifications[key].name,
    questionCount: awsCertifications[key].questions.length
  })));
});

app.get('/api/certification/:id', (req, res) => {
  const cert = awsCertifications[req.params.id];
  if (!cert) return res.status(404).json({ error: 'Certification not found' });
  res.json(cert);
});

app.post('/api/certification/:id/submit', async (req, res) => {
  const { answers, userInfo } = req.body;
  const cert = awsCertifications[req.params.id];
  
  if (!cert) return res.status(404).json({ error: 'Certification not found' });
  
  let score = 0;
  const results = answers.map((answer, index) => {
    const question = cert.questions[index];
    const isCorrect = answer === question.correct;
    if (isCorrect) score++;
    
    return {
      question: question.question,
      userAnswer: question.options[answer],
      correctAnswer: question.options[question.correct],
      isCorrect,
      explanation: question.explanation
    };
  });

  const percentage = Math.round((score / cert.questions.length) * 100);
  
  // Send email with results
  await sendCertificationResults(userInfo, cert.name, score, cert.questions.length, percentage, results);
  
  res.json({ score, total: cert.questions.length, percentage, results });
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
  
  // Send email with results
  await sendAssessmentResults(userInfo, score, questions.length, results, learningPath);
  
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

async function sendAssessmentResults(userInfo, score, total, results, learningPath) {
  const percentage = Math.round((score / total) * 100);
  
  const emailHtml = `
    <h2>🎯 DevSecOps Assessment Results</h2>
    <p>Dear ${userInfo.name},</p>
    <p>Thank you for completing the DevSecOps Skill Gap Assessment!</p>
    
    <h3>📊 Your Results:</h3>
    <ul>
      <li><strong>Overall Score:</strong> ${score}/${total} (${percentage}%)</li>
      <li><strong>Performance Level:</strong> ${getPerformanceText(percentage)}</li>
    </ul>
    
    <h3>📈 Category Breakdown:</h3>
    ${Object.entries(results).map(([category, data]) => {
      const catPercentage = Math.round((data.correct / data.total) * 100);
      return `<p><strong>${category}:</strong> ${data.correct}/${data.total} (${catPercentage}%)</p>`;
    }).join('')}
    
    <h3>🎯 Recommended Courses:</h3>
    ${learningPath.map(item => `
      <div style="margin: 15px 0; padding: 10px; border-left: 3px solid #007bff;">
        <h4>${item.category} (${item.priority} Priority)</h4>
        ${courses[item.category] ? courses[item.category].map(course => 
          `<p>• <strong>${course.name}</strong> - ${course.provider} (${course.duration})<br>
           <a href="${course.url}">${course.url}</a></p>`
        ).join('') : ''}
      </div>
    `).join('')}
    
    <p>Keep learning and improving your DevSecOps skills!</p>
    <p>Best regards,<br>DevSecOps Analyzer Team</p>
  `;

  try {
    await transporter.sendMail({
      from: 'DevSecOps Analyzer <devsecops.analyzer@gmail.com>',
      to: userInfo.email,
      subject: `Your DevSecOps Assessment Results - ${percentage}% Score`,
      html: emailHtml
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

async function sendCertificationResults(userInfo, certName, score, total, percentage, results) {
  const emailHtml = `
    <h2>📜 ${certName} Practice Test Results</h2>
    <p>Dear ${userInfo.name},</p>
    <p>You completed the ${certName} practice test!</p>
    
    <h3>📊 Results:</h3>
    <ul>
      <li><strong>Score:</strong> ${score}/${total} (${percentage}%)</li>
      <li><strong>Status:</strong> ${percentage >= 70 ? '✅ PASS' : '❌ NEEDS IMPROVEMENT'}</li>
    </ul>
    
    <h3>📝 Detailed Results:</h3>
    ${results.map((result, index) => `
      <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
        <p><strong>Q${index + 1}:</strong> ${result.question}</p>
        <p><strong>Your Answer:</strong> ${result.userAnswer} ${result.isCorrect ? '✅' : '❌'}</p>
        ${!result.isCorrect ? `<p><strong>Correct Answer:</strong> ${result.correctAnswer}</p>` : ''}
        <p><em>${result.explanation}</em></p>
      </div>
    `).join('')}
    
    <p>Keep practicing to improve your certification readiness!</p>
  `;

  try {
    await transporter.sendMail({
      from: 'DevSecOps Analyzer <devsecops.analyzer@gmail.com>',
      to: userInfo.email,
      subject: `${certName} Practice Test Results - ${percentage}%`,
      html: emailHtml
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

function getPerformanceText(percentage) {
  if (percentage >= 80) return "🌟 Excellent - You're DevSecOps ready!";
  if (percentage >= 70) return "✅ Good - Minor improvements needed";
  if (percentage >= 50) return "⚠️ Average - Focus on key areas";
  return "🔴 Needs Improvement - Significant learning required";
}

app.get('/api/progress/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user?.progress || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
