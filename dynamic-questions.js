// Dynamic Question Pool - Never Same Questions Twice
const questionPools = {
  "CI/CD": [
    {
      question: "What is the primary purpose of a CI/CD pipeline?",
      options: ["Code storage", "Automated testing and deployment", "Bug tracking", "Documentation"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "Which tool is commonly used for container orchestration in CI/CD?",
      options: ["Jenkins", "Kubernetes", "Git", "Docker"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "What does 'Infrastructure as Code' mean?",
      options: ["Writing code in infrastructure", "Managing infrastructure through code", "Coding on servers", "Infrastructure documentation"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "Which is the best practice for CI/CD pipeline security?",
      options: ["Store secrets in code", "Use environment variables for secrets", "Share passwords in team", "Hardcode API keys"],
      correct: 1,
      difficulty: "advanced"
    },
    {
      question: "What is GitOps?",
      options: ["Git operations", "Operational model using Git as source of truth", "Git optimization", "Git operations team"],
      correct: 1,
      difficulty: "advanced"
    },
    {
      question: "Which stage comes first in a typical CI/CD pipeline?",
      options: ["Deploy", "Test", "Build", "Monitor"],
      correct: 2,
      difficulty: "beginner"
    },
    {
      question: "What is the purpose of automated testing in CI/CD?",
      options: ["Slow down deployment", "Catch bugs early and ensure quality", "Increase manual work", "Replace developers"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "Which tool is used for Infrastructure as Code?",
      options: ["Terraform", "Photoshop", "Excel", "Word"],
      correct: 0,
      difficulty: "intermediate"
    }
  ],
  "Security": [
    {
      question: "What does SAST stand for?",
      options: ["Static Application Security Testing", "Secure Application Software Testing", "System Application Security Tool", "Software Application Security Test"],
      correct: 0,
      difficulty: "beginner"
    },
    {
      question: "What is the OWASP Top 10?",
      options: ["Top 10 programming languages", "Top 10 web application security risks", "Top 10 cloud providers", "Top 10 DevOps tools"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "What does DAST stand for?",
      options: ["Dynamic Application Security Testing", "Data Application Security Tool", "Direct Application Security Test", "Database Application Security Testing"],
      correct: 0,
      difficulty: "intermediate"
    },
    {
      question: "What is the principle of least privilege?",
      options: ["Give maximum access to all users", "Give minimum required access to users", "Remove all user access", "Give access based on seniority"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "Which security practice should be integrated into CI/CD pipelines?",
      options: ["Manual security reviews only", "Security scanning at every stage", "Security checks only at the end", "No security needed in CI/CD"],
      correct: 1,
      difficulty: "advanced"
    },
    {
      question: "What is container security scanning?",
      options: ["Scanning for container sizes", "Checking containers for vulnerabilities", "Counting containers", "Container performance monitoring"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "What is zero-trust security model?",
      options: ["Trust no one", "Never trust, always verify", "Trust everyone", "Trust only admins"],
      correct: 1,
      difficulty: "advanced"
    },
    {
      question: "Which tool is used for vulnerability scanning?",
      options: ["Nessus", "Photoshop", "Excel", "PowerPoint"],
      correct: 0,
      difficulty: "beginner"
    }
  ],
  "Cloud": [
    {
      question: "Which AWS service is primarily used for container orchestration?",
      options: ["EC2", "EKS", "S3", "RDS"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "What is the maximum size of an S3 object?",
      options: ["5 GB", "5 TB", "100 GB", "1 TB"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "Which service provides DNS resolution in AWS?",
      options: ["CloudFront", "Route 53", "ELB", "API Gateway"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "What is AWS IAM used for?",
      options: ["Image processing", "Identity and Access Management", "Internet Access Management", "Infrastructure Automation"],
      correct: 1,
      difficulty: "beginner"
    },
    {
      question: "Which AWS service is used for serverless computing?",
      options: ["EC2", "Lambda", "S3", "RDS"],
      correct: 1,
      difficulty: "intermediate"
    },
    {
      question: "What is the difference between horizontal and vertical scaling?",
      options: ["No difference", "Horizontal adds more instances, vertical adds more power", "Vertical adds more instances, horizontal adds more power", "Both are the same"],
      correct: 1,
      difficulty: "advanced"
    },
    {
      question: "Which service is used for monitoring in AWS?",
      options: ["CloudWatch", "CloudFront", "CloudFormation", "CloudTrail"],
      correct: 0,
      difficulty: "intermediate"
    },
    {
      question: "What is multi-cloud strategy?",
      options: ["Using one cloud", "Using multiple cloud providers", "Using no cloud", "Using private cloud only"],
      correct: 1,
      difficulty: "advanced"
    }
  ]
};

// Dynamic Question Selection Algorithm
function generateDynamicQuestions(userHistory = [], difficulty = 'mixed', count = 10) {
  const usedQuestions = new Set(userHistory.map(q => q.id));
  const selectedQuestions = [];
  
  // Get questions from each category
  const categories = Object.keys(questionPools);
  const questionsPerCategory = Math.ceil(count / categories.length);
  
  categories.forEach(category => {
    const categoryQuestions = questionPools[category].filter(q => {
      // Filter out previously used questions
      const questionId = `${category}_${q.question.substring(0, 20)}`;
      return !usedQuestions.has(questionId);
    });
    
    // Filter by difficulty if specified
    let filteredQuestions = categoryQuestions;
    if (difficulty !== 'mixed') {
      filteredQuestions = categoryQuestions.filter(q => q.difficulty === difficulty);
    }
    
    // Randomly select questions from this category
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionsPerCategory);
    
    // Add category and unique ID to each question
    selected.forEach(q => {
      q.category = category;
      q.id = `${category}_${q.question.substring(0, 20)}`;
    });
    
    selectedQuestions.push(...selected);
  });
  
  // Shuffle final selection and return requested count
  return selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
}

module.exports = { questionPools, generateDynamicQuestions };
