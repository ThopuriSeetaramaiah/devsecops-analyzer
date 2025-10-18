// Comprehensive Question Database - Legal & Original Questions
const comprehensiveQuestions = {
  "AWS-SAA": [
    {
      id: "aws-saa-001",
      question: "A company needs to store frequently accessed data with high durability. Which S3 storage class provides the best cost-performance ratio?",
      options: ["S3 Standard", "S3 Standard-IA", "S3 Glacier", "S3 One Zone-IA"],
      correct: 0,
      explanation: "S3 Standard provides high durability (99.999999999%) and is optimized for frequently accessed data with low latency.",
      domain: "Storage",
      difficulty: "intermediate",
      source: "AWS Documentation"
    },
    {
      id: "aws-saa-002", 
      question: "What is the maximum number of VPCs you can create per AWS region by default?",
      options: ["5", "10", "20", "100"],
      correct: 0,
      explanation: "By default, you can create 5 VPCs per region, but this limit can be increased by contacting AWS support.",
      domain: "Networking",
      difficulty: "beginner",
      source: "AWS Service Limits"
    },
    {
      id: "aws-saa-003",
      question: "A web application requires a database that can automatically scale read capacity. Which AWS service should you choose?",
      options: ["RDS with Read Replicas", "DynamoDB", "ElastiCache", "Redshift"],
      correct: 1,
      explanation: "DynamoDB can automatically scale read and write capacity based on demand using Auto Scaling.",
      domain: "Database",
      difficulty: "intermediate",
      source: "AWS Best Practices"
    },
    {
      id: "aws-saa-004",
      question: "Which AWS service provides a managed Kubernetes service?",
      options: ["ECS", "EKS", "Fargate", "Batch"],
      correct: 1,
      explanation: "Amazon EKS (Elastic Kubernetes Service) is a managed Kubernetes service that makes it easy to run Kubernetes on AWS.",
      domain: "Containers",
      difficulty: "beginner",
      source: "AWS Services Overview"
    },
    {
      id: "aws-saa-005",
      question: "What is the best practice for securing API Gateway endpoints?",
      options: ["Use API keys only", "Implement AWS WAF and throttling", "Rely on VPC security groups", "Use basic authentication"],
      correct: 1,
      explanation: "AWS WAF provides protection against common web exploits, and throttling prevents abuse. This combination provides comprehensive API security.",
      domain: "Security",
      difficulty: "advanced",
      source: "AWS Security Best Practices"
    }
  ],
  "AWS-Security": [
    {
      id: "aws-sec-001",
      question: "Which AWS service helps detect malicious activity and unauthorized behavior in your AWS environment?",
      options: ["CloudTrail", "GuardDuty", "Config", "Inspector"],
      correct: 1,
      explanation: "Amazon GuardDuty is a threat detection service that continuously monitors for malicious activity and unauthorized behavior.",
      domain: "Threat Detection",
      difficulty: "intermediate",
      source: "AWS Security Services"
    },
    {
      id: "aws-sec-002",
      question: "What is the recommended approach for managing secrets in AWS applications?",
      options: ["Environment variables", "AWS Secrets Manager", "S3 bucket", "Parameter Store"],
      correct: 1,
      explanation: "AWS Secrets Manager is specifically designed for managing secrets with automatic rotation, encryption, and fine-grained access control.",
      domain: "Secrets Management",
      difficulty: "intermediate",
      source: "AWS Security Best Practices"
    },
    {
      id: "aws-sec-003",
      question: "Which principle should guide IAM policy creation?",
      options: ["Maximum privilege", "Least privilege", "No privilege", "Admin privilege"],
      correct: 1,
      explanation: "The principle of least privilege means granting only the minimum permissions necessary to perform required tasks.",
      domain: "Identity and Access Management",
      difficulty: "beginner",
      source: "AWS IAM Best Practices"
    }
  ],
  "CISSP": [
    {
      id: "cissp-001",
      question: "What are the three fundamental principles of information security known as the CIA Triad?",
      options: ["Confidentiality, Integrity, Availability", "Control, Identity, Authentication", "Compliance, Investigation, Audit", "Classification, Identification, Authorization"],
      correct: 0,
      explanation: "The CIA Triad consists of Confidentiality (protecting information from unauthorized access), Integrity (ensuring information accuracy), and Availability (ensuring information is accessible when needed).",
      domain: "Security and Risk Management",
      difficulty: "beginner",
      source: "CISSP CBK"
    },
    {
      id: "cissp-002",
      question: "Which security model is based on the principle that subjects can only access objects at their security level or below?",
      options: ["Bell-LaPadula", "Biba", "Clark-Wilson", "Brewer-Nash"],
      correct: 0,
      explanation: "The Bell-LaPadula model focuses on confidentiality and implements 'no read up, no write down' rules to prevent information leakage.",
      domain: "Security Architecture and Engineering",
      difficulty: "advanced",
      source: "Security Models"
    }
  ],
  "CKA": [
    {
      id: "cka-001",
      question: "Which command is used to create a Kubernetes deployment imperatively?",
      options: ["kubectl create deployment", "kubectl apply deployment", "kubectl run deployment", "kubectl make deployment"],
      correct: 0,
      explanation: "kubectl create deployment is the imperative command to create a deployment directly from the command line.",
      domain: "Workloads and Scheduling",
      difficulty: "beginner",
      source: "Kubernetes Documentation"
    },
    {
      id: "cka-002",
      question: "What is the default restart policy for Kubernetes pods?",
      options: ["Never", "Always", "OnFailure", "RestartPolicy"],
      correct: 1,
      explanation: "The default restart policy for pods is 'Always', meaning containers will be restarted if they exit for any reason.",
      domain: "Pod Management",
      difficulty: "intermediate",
      source: "Kubernetes Pod Specification"
    }
  ],
  "DevSecOps": [
    {
      id: "devsecops-001",
      question: "What is the primary goal of implementing security in a DevOps pipeline?",
      options: ["Slow down deployment", "Shift security left", "Increase manual testing", "Reduce automation"],
      correct: 1,
      explanation: "'Shift left' means integrating security practices early in the development lifecycle, catching issues before they reach production.",
      domain: "DevSecOps Principles",
      difficulty: "beginner",
      source: "DevSecOps Best Practices"
    },
    {
      id: "devsecops-002",
      question: "Which type of security testing analyzes source code without executing it?",
      options: ["DAST", "SAST", "IAST", "RASP"],
      correct: 1,
      explanation: "Static Application Security Testing (SAST) analyzes source code, bytecode, or binaries without executing the application.",
      domain: "Security Testing",
      difficulty: "intermediate",
      source: "Application Security Testing"
    },
    {
      id: "devsecops-003",
      question: "What is the recommended approach for storing secrets in containerized applications?",
      options: ["Environment variables", "Config files", "Secret management systems", "Hardcoded values"],
      correct: 2,
      explanation: "Secret management systems like Kubernetes Secrets, HashiCorp Vault, or cloud provider secret services provide secure storage and access control.",
      domain: "Container Security",
      difficulty: "advanced",
      source: "Container Security Best Practices"
    }
  ]
};

// Question Generation Engine
class QuestionGenerator {
  constructor() {
    this.questionBank = comprehensiveQuestions;
    this.usedQuestions = new Map(); // Track used questions per user
  }

  // Generate exam-specific questions
  generateExamQuestions(examType, count = 10, difficulty = 'mixed', userId = 'guest') {
    const examQuestions = this.questionBank[examType] || [];
    const userHistory = this.usedQuestions.get(userId) || new Set();
    
    // Filter out used questions
    const availableQuestions = examQuestions.filter(q => !userHistory.has(q.id));
    
    // Filter by difficulty if specified
    let filteredQuestions = availableQuestions;
    if (difficulty !== 'mixed') {
      filteredQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
    }
    
    // If not enough questions, reset user history for this exam
    if (filteredQuestions.length < count) {
      const examUsedQuestions = Array.from(userHistory).filter(id => id.startsWith(examType.toLowerCase()));
      examUsedQuestions.forEach(id => userHistory.delete(id));
      filteredQuestions = examQuestions.filter(q => !userHistory.has(q.id));
    }
    
    // Randomly select questions
    const selectedQuestions = this.shuffleArray(filteredQuestions).slice(0, count);
    
    // Mark questions as used
    selectedQuestions.forEach(q => userHistory.add(q.id));
    this.usedQuestions.set(userId, userHistory);
    
    return selectedQuestions;
  }

  // Generate questions based on job role requirements
  generateRoleBasedQuestions(role, count = 15) {
    const roleQuestionMap = {
      "DevSecOps Engineer": ["AWS-Security", "DevSecOps", "CKA"],
      "Cloud Security Architect": ["AWS-Security", "CISSP", "AWS-SAA"],
      "Kubernetes Administrator": ["CKA", "DevSecOps"],
      "AWS Solutions Architect": ["AWS-SAA", "AWS-Security"]
    };
    
    const relevantExams = roleQuestionMap[role] || ["DevSecOps"];
    const questionsPerExam = Math.ceil(count / relevantExams.length);
    
    let allQuestions = [];
    relevantExams.forEach(exam => {
      const examQuestions = this.generateExamQuestions(exam, questionsPerExam);
      allQuestions.push(...examQuestions);
    });
    
    return this.shuffleArray(allQuestions).slice(0, count);
  }

  // Add new questions to the database (for community contributions)
  addQuestion(examType, questionData) {
    if (!this.questionBank[examType]) {
      this.questionBank[examType] = [];
    }
    
    const newQuestion = {
      id: `${examType.toLowerCase()}-${Date.now()}`,
      ...questionData,
      source: "Community Contribution",
      dateAdded: new Date().toISOString()
    };
    
    this.questionBank[examType].push(newQuestion);
    return newQuestion.id;
  }

  // Get question statistics
  getQuestionStats() {
    const stats = {};
    Object.entries(this.questionBank).forEach(([exam, questions]) => {
      stats[exam] = {
        total: questions.length,
        byDifficulty: {
          beginner: questions.filter(q => q.difficulty === 'beginner').length,
          intermediate: questions.filter(q => q.difficulty === 'intermediate').length,
          advanced: questions.filter(q => q.difficulty === 'advanced').length
        },
        byDomain: this.groupByDomain(questions)
      };
    });
    return stats;
  }

  // Utility functions
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  groupByDomain(questions) {
    const domains = {};
    questions.forEach(q => {
      domains[q.domain] = (domains[q.domain] || 0) + 1;
    });
    return domains;
  }

  // Reset user question history (for retaking exams)
  resetUserHistory(userId, examType = null) {
    const userHistory = this.usedQuestions.get(userId) || new Set();
    
    if (examType) {
      // Reset only specific exam history
      const examPrefix = examType.toLowerCase();
      Array.from(userHistory).forEach(id => {
        if (id.startsWith(examPrefix)) {
          userHistory.delete(id);
        }
      });
    } else {
      // Reset all history
      userHistory.clear();
    }
    
    this.usedQuestions.set(userId, userHistory);
  }
}

module.exports = { comprehensiveQuestions, QuestionGenerator };
