const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const { awsCertifications, courses } = require('./certifications');
const { learningPlatforms, certificationPaths, advancedOpportunities } = require('./learning-platforms');
const AIQuestionGenerator = require('./ai-integration');
const AdvancedAnalytics = require('./analytics-engine');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize AI and Analytics
const aiGenerator = new AIQuestionGenerator();
const analytics = new AdvancedAnalytics();

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
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  jobTitle: String,
  experience: String,
  newsletter: Boolean,
  subscription: { type: String, default: 'free' }, // free, pro, enterprise
  subscriptionDate: Date,
  assessmentResults: Object,
  learningPath: Array,
  progress: Object,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Authentication routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, jobTitle, experience, newsletter } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const user = new User({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      password, // In production, hash this password
      jobTitle,
      experience,
      newsletter: newsletter === 'on' || newsletter === true, // Convert to boolean
      createdAt: new Date()
    });
    
    await user.save();
    
    // Send welcome email
    await sendWelcomeEmail({ firstName, email });
    
    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        jobTitle: user.jobTitle,
        experience: user.experience
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user || user.password !== password) { // In production, use proper password hashing
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        jobTitle: user.jobTitle,
        experience: user.experience
      },
      token: 'dummy-token' // In production, use proper JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

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

async function sendWelcomeEmail(userInfo) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">🛡️ Welcome to DevSecOps Analyzer!</h2>
      <p>Dear ${userInfo.firstName},</p>
      <p>Thank you for joining our community of DevSecOps professionals!</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>🚀 Get Started:</h3>
        <ul>
          <li>Take your first skill assessment</li>
          <li>Practice with certification questions</li>
          <li>Get personalized learning recommendations</li>
          <li>Track your progress over time</li>
        </ul>
      </div>
      
      <p>Ready to begin your DevSecOps journey? <a href="#" style="color: #667eea;">Take your first assessment</a></p>
      
      <p>Best regards,<br>The DevSecOps Analyzer Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: 'DevSecOps Analyzer <devsecops.analyzer@gmail.com>',
      to: userInfo.email,
      subject: '🛡️ Welcome to DevSecOps Analyzer!',
      html: emailHtml
    });
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
}

function getPerformanceText(percentage) {
  if (percentage >= 80) return "🌟 Excellent - You're DevSecOps ready!";
  if (percentage >= 70) return "✅ Good - Minor improvements needed";
  if (percentage >= 50) return "⚠️ Average - Focus on key areas";
  return "🔴 Needs Improvement - Significant learning required";
}

// Job Market Intelligence API
app.get('/api/job-market/skills', async (req, res) => {
  // Simulate real-time job market data
  const jobMarketData = {
    trending_skills: [
      { skill: "Kubernetes Security", demand: 95, salary_impact: "+$15k" },
      { skill: "DevSecOps Automation", demand: 88, salary_impact: "+$12k" },
      { skill: "Cloud Security", demand: 92, salary_impact: "+$18k" },
      { skill: "Infrastructure as Code", demand: 85, salary_impact: "+$10k" }
    ],
    job_openings: {
      total: 2847,
      remote: 1923,
      average_salary: "$125,000"
    },
    skill_gaps: [
      "Container Security",
      "SAST/DAST Integration", 
      "Compliance Automation"
    ]
  };
  
  res.json(jobMarketData);
});

// Career Progression API
app.get('/api/career/progression/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  // Simulate career progression analysis
  const progression = {
    current_level: "Mid-Level DevSecOps",
    next_level: "Senior DevSecOps Engineer",
    skills_needed: [
      { skill: "Advanced Kubernetes", priority: "High", time_estimate: "2 months" },
      { skill: "Security Architecture", priority: "Medium", time_estimate: "3 months" }
    ],
    salary_projection: {
      current: "$95,000",
      target: "$135,000",
      timeline: "6-8 months"
    },
    success_probability: 87
  };
  
  res.json(progression);
});

// Pro Features - Advanced Analytics & AI
app.get('/api/pro/analytics/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user || user.subscription !== 'pro') {
      return res.status(403).json({ message: 'Pro subscription required' });
    }

    const analyticsData = analytics.generateUserAnalytics(userId);
    const benchmarkData = analytics.generateBenchmarkAnalysis(userId);
    const predictiveData = analytics.generatePredictiveInsights(userId);

    res.json({
      analytics: analyticsData,
      benchmarks: benchmarkData,
      predictions: predictiveData,
      generated_at: new Date()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Analytics generation failed' });
  }
});

// AI-Generated Dynamic Questions
app.post('/api/pro/questions/generate', async (req, res) => {
  try {
    const { userId, weakAreas, difficulty, count = 5 } = req.body;
    const user = await User.findById(userId);
    
    if (!user || user.subscription !== 'pro') {
      return res.status(403).json({ message: 'Pro subscription required' });
    }

    const userProfile = {
      experience: user.experience,
      jobTitle: user.jobTitle,
      weakAreas: weakAreas
    };

    const aiQuestions = await aiGenerator.generateQuestions(userProfile, weakAreas, difficulty);
    
    // Track question generation for analytics
    analytics.trackUserBehavior(userId, 'ai_questions_generated', {
      count: aiQuestions.length,
      difficulty,
      weakAreas,
      sessionId: req.headers['session-id']
    });

    res.json({
      questions: aiQuestions,
      generated_by: 'AI',
      personalized: true,
      difficulty_level: difficulty
    });
  } catch (error) {
    console.error('AI Question generation error:', error);
    res.status(500).json({ message: 'Question generation failed' });
  }
});

// Latest Industry Questions
app.get('/api/pro/questions/trending', async (req, res) => {
  try {
    const trendingQuestions = await aiGenerator.generateTrendingQuestions();
    
    res.json({
      questions: trendingQuestions,
      category: 'Industry Trends 2024-2025',
      updated: new Date(),
      technologies: ['AI/ML Security', 'Quantum Computing', 'Platform Engineering']
    });
  } catch (error) {
    res.status(500).json({ message: 'Trending questions unavailable' });
  }
});

// Real-time Performance Tracking
app.post('/api/pro/track', async (req, res) => {
  try {
    const { userId, action, data } = req.body;
    
    analytics.trackUserBehavior(userId, action, {
      ...data,
      sessionId: req.headers['session-id'],
      timestamp: new Date()
    });

    res.json({ tracked: true });
  } catch (error) {
    res.status(500).json({ message: 'Tracking failed' });
  }
});

// Unlimited Practice Mode
app.get('/api/pro/practice/unlimited/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user || user.subscription !== 'pro') {
      return res.status(403).json({ message: 'Pro subscription required' });
    }

    // Generate unlimited practice questions based on user's weak areas
    const userAnalytics = analytics.generateUserAnalytics(userId);
    const weakAreas = userAnalytics.weakness_patterns || ['CI/CD', 'Security'];
    
    const practiceQuestions = await aiGenerator.generateQuestions(
      { experience: user.experience, jobTitle: user.jobTitle },
      weakAreas,
      'mixed'
    );

    res.json({
      questions: practiceQuestions,
      unlimited: true,
      personalized: true,
      focus_areas: weakAreas
    });
  } catch (error) {
    res.status(500).json({ message: 'Practice generation failed' });
  }
});

// Enhanced Learning Recommendations API
app.get('/api/learning/recommendations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    // Get user's assessment results to determine skill level and weak areas
    const userLevel = user?.experience || 'beginner';
    const weakAreas = ['CI/CD', 'Security', 'Cloud']; // This would come from assessment analysis
    
    const recommendations = {
      immediate_courses: [],
      certification_path: certificationPaths["DevSecOps Engineer"][userLevel] || [],
      advanced_opportunities: userLevel === 'advanced' ? {
        mentoring: advancedOpportunities.mentoring,
        open_source: advancedOpportunities.openSource,
        communities: advancedOpportunities.communities
      } : null
    };

    // Generate course recommendations based on weak areas
    weakAreas.forEach(area => {
      if (learningPlatforms[area] && learningPlatforms[area][userLevel]) {
        recommendations.immediate_courses.push({
          category: area,
          courses: learningPlatforms[area][userLevel]
        });
      }
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Learning recommendations error:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
});

// Platform-specific course search
app.get('/api/learning/platform/:platform', async (req, res) => {
  const platform = req.params.platform;
  const { category, level } = req.query;
  
  try {
    let courses = [];
    
    Object.keys(learningPlatforms).forEach(cat => {
      if (!category || cat === category) {
        Object.keys(learningPlatforms[cat]).forEach(lvl => {
          if (!level || lvl === level) {
            const platformCourses = learningPlatforms[cat][lvl].filter(course => 
              course.platform.toLowerCase() === platform.toLowerCase()
            );
            courses.push(...platformCourses.map(course => ({
              ...course,
              category: cat,
              level: lvl
            })));
          }
        });
      }
    });

    res.json({
      platform: platform,
      total_courses: courses.length,
      courses: courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Platform search failed' });
  }
});

// Career progression with specific next steps
app.get('/api/career/next-steps/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    // Analyze user's current level and generate specific next steps
    const currentLevel = user?.experience || 'beginner';
    const assessmentResults = user?.assessmentResults || {};
    
    let nextSteps = [];
    
    // Determine skill level from assessment scores
    const overallScore = calculateOverallScore(assessmentResults);
    
    if (overallScore >= 80) {
      // Advanced user - suggest mentoring and open source
      nextSteps = [
        {
          action: "Start Mentoring",
          description: "Share your expertise with junior developers",
          platforms: advancedOpportunities.mentoring,
          timeframe: "Start this week",
          impact: "Build leadership skills, earn $50-200/hour"
        },
        {
          action: "Contribute to Open Source",
          description: "Contribute to major DevSecOps projects",
          platforms: advancedOpportunities.openSource,
          timeframe: "1-2 hours/week",
          impact: "Industry recognition, portfolio building"
        },
        {
          action: "Advanced Certifications",
          description: "Pursue expert-level certifications",
          recommendations: certificationPaths["DevSecOps Engineer"]["advanced"],
          timeframe: "3-6 months",
          impact: "Senior role qualification, salary increase"
        }
      ];
    } else if (overallScore >= 60) {
      // Intermediate user - focus on specialization
      nextSteps = [
        {
          action: "Specialize in Weak Areas",
          description: "Deep dive into your lowest scoring categories",
          courses: getCoursesForWeakAreas(assessmentResults, 'intermediate'),
          timeframe: "2-3 months",
          impact: "Fill critical skill gaps"
        },
        {
          action: "Industry Certifications",
          description: "Earn recognized certifications",
          recommendations: certificationPaths["DevSecOps Engineer"]["intermediate"],
          timeframe: "2-4 months",
          impact: "Career advancement, 20-30% salary increase"
        }
      ];
    } else {
      // Beginner user - build foundation
      nextSteps = [
        {
          action: "Build Strong Foundation",
          description: "Master fundamental DevSecOps concepts",
          courses: getCoursesForWeakAreas(assessmentResults, 'beginner'),
          timeframe: "1-2 months",
          impact: "Solid skill foundation"
        },
        {
          action: "Entry-level Certifications",
          description: "Start with foundational certifications",
          recommendations: certificationPaths["DevSecOps Engineer"]["beginner"],
          timeframe: "1-2 months",
          impact: "Job readiness, entry-level positions"
        }
      ];
    }

    res.json({
      current_level: currentLevel,
      overall_score: overallScore,
      next_steps: nextSteps,
      estimated_timeline: getEstimatedTimeline(overallScore),
      salary_projection: getSalaryProjection(overallScore, currentLevel)
    });
  } catch (error) {
    console.error('Next steps error:', error);
    res.status(500).json({ message: 'Failed to generate next steps' });
  }
});

// Helper functions
function calculateOverallScore(assessmentResults) {
  if (!assessmentResults || Object.keys(assessmentResults).length === 0) return 0;
  
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  Object.values(assessmentResults).forEach(category => {
    totalCorrect += category.correct || 0;
    totalQuestions += category.total || 0;
  });
  
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
}

function getCoursesForWeakAreas(assessmentResults, level) {
  const weakAreas = [];
  
  Object.entries(assessmentResults).forEach(([category, data]) => {
    const percentage = (data.correct / data.total) * 100;
    if (percentage < 70) {
      weakAreas.push(category);
    }
  });
  
  const courses = [];
  weakAreas.forEach(area => {
    if (learningPlatforms[area] && learningPlatforms[area][level]) {
      courses.push({
        category: area,
        courses: learningPlatforms[area][level].slice(0, 2) // Top 2 courses per area
      });
    }
  });
  
  return courses;
}

function getEstimatedTimeline(overallScore) {
  if (overallScore >= 80) return "Ready for advanced roles now";
  if (overallScore >= 60) return "3-6 months to senior level";
  return "6-12 months to job-ready level";
}

function getSalaryProjection(overallScore, currentLevel) {
  const baseSalaries = {
    'beginner': 65000,
    'intermediate': 85000,
    'advanced': 120000
  };
  
  const multiplier = overallScore >= 80 ? 1.3 : overallScore >= 60 ? 1.15 : 1.0;
  const baseSalary = baseSalaries[currentLevel] || baseSalaries['beginner'];
  
  return {
    current_range: `$${Math.round(baseSalary * multiplier / 1000)}k - $${Math.round(baseSalary * multiplier * 1.2 / 1000)}k`,
    target_range: `$${Math.round(baseSalary * 1.4 / 1000)}k - $${Math.round(baseSalary * 1.6 / 1000)}k`,
    timeline: getEstimatedTimeline(overallScore)
  };
}

// Subscription Management
app.post('/api/subscription/upgrade', async (req, res) => {
  try {
    const { userId, plan } = req.body;
    
    await User.findByIdAndUpdate(userId, { 
      subscription: plan,
      subscriptionDate: new Date()
    });

    res.json({ 
      message: 'Subscription upgraded successfully',
      plan: plan,
      features: plan === 'pro' ? [
        'Advanced Analytics',
        'AI-Generated Questions', 
        'Unlimited Practice',
        'Industry Benchmarking',
        'Predictive Insights'
      ] : ['Basic Assessment']
    });
  } catch (error) {
    res.status(500).json({ message: 'Subscription upgrade failed' });
  }
});

app.get('/api/progress/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user?.progress || {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
