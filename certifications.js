// AWS Certification Practice Questions
const awsCertifications = {
  "AWS-SAA": {
    name: "AWS Solutions Architect Associate",
    questions: [
      {
        id: 1,
        question: "Which AWS service provides a managed NoSQL database?",
        options: ["RDS", "DynamoDB", "Redshift", "ElastiCache"],
        correct: 1,
        explanation: "DynamoDB is AWS's managed NoSQL database service."
      },
      {
        id: 2,
        question: "What is the maximum size of an S3 object?",
        options: ["5 GB", "5 TB", "100 GB", "1 TB"],
        correct: 1,
        explanation: "The maximum size of a single S3 object is 5 TB."
      },
      {
        id: 3,
        question: "Which service provides DNS resolution?",
        options: ["CloudFront", "Route 53", "ELB", "API Gateway"],
        correct: 1,
        explanation: "Route 53 is AWS's DNS web service."
      }
    ]
  },
  "AWS-SAP": {
    name: "AWS Solutions Architect Professional",
    questions: [
      {
        id: 1,
        question: "Which design pattern provides the highest availability for a multi-tier application?",
        options: ["Single AZ deployment", "Multi-AZ with auto-scaling", "Cross-region deployment", "Single region multi-AZ"],
        correct: 2,
        explanation: "Cross-region deployment provides the highest availability by protecting against regional failures."
      },
      {
        id: 2,
        question: "What is the best practice for managing secrets in AWS?",
        options: ["Environment variables", "AWS Secrets Manager", "S3 bucket", "Parameter Store"],
        correct: 1,
        explanation: "AWS Secrets Manager is specifically designed for managing secrets with automatic rotation."
      }
    ]
  },
  "AWS-Security": {
    name: "AWS Certified Security - Specialty",
    questions: [
      {
        id: 1,
        question: "Which service helps detect malicious activity and unauthorized behavior?",
        options: ["CloudTrail", "GuardDuty", "Config", "Inspector"],
        correct: 1,
        explanation: "GuardDuty is a threat detection service that monitors for malicious activity."
      },
      {
        id: 2,
        question: "What is the principle of least privilege?",
        options: ["Give all permissions", "Give minimum required permissions", "No permissions", "Admin access only"],
        correct: 1,
        explanation: "Principle of least privilege means granting only the minimum permissions necessary."
      },
      {
        id: 3,
        question: "Which service provides centralized key management?",
        options: ["IAM", "KMS", "Secrets Manager", "Certificate Manager"],
        correct: 1,
        explanation: "AWS KMS (Key Management Service) provides centralized key management."
      }
    ]
  },
  "AWS-DevOps": {
    name: "AWS Certified DevOps Engineer - Professional",
    questions: [
      {
        id: 1,
        question: "Which service is best for implementing Infrastructure as Code?",
        options: ["CloudFormation", "Elastic Beanstalk", "OpsWorks", "Systems Manager"],
        correct: 0,
        explanation: "CloudFormation is AWS's native Infrastructure as Code service."
      },
      {
        id: 2,
        question: "What is blue-green deployment?",
        options: ["Color-coded deployment", "Two identical production environments", "Development strategy", "Testing method"],
        correct: 1,
        explanation: "Blue-green deployment uses two identical production environments for zero-downtime deployments."
      }
    ]
  },
  "CISSP": {
    name: "Certified Information Systems Security Professional",
    questions: [
      {
        id: 1,
        question: "What are the three pillars of information security?",
        options: ["CIA Triad", "Risk Management", "Compliance", "Governance"],
        correct: 0,
        explanation: "CIA Triad stands for Confidentiality, Integrity, and Availability."
      },
      {
        id: 2,
        question: "What is defense in depth?",
        options: ["Single security control", "Multiple layers of security", "Deep packet inspection", "Network segmentation"],
        correct: 1,
        explanation: "Defense in depth uses multiple layers of security controls."
      }
    ]
  },
  "CEH": {
    name: "Certified Ethical Hacker",
    questions: [
      {
        id: 1,
        question: "What is the first phase of ethical hacking?",
        options: ["Scanning", "Reconnaissance", "Enumeration", "Exploitation"],
        correct: 1,
        explanation: "Reconnaissance is the first phase where information is gathered about the target."
      },
      {
        id: 2,
        question: "What is a vulnerability assessment?",
        options: ["Exploiting vulnerabilities", "Identifying vulnerabilities", "Fixing vulnerabilities", "Reporting vulnerabilities"],
        correct: 1,
        explanation: "Vulnerability assessment focuses on identifying security weaknesses."
      }
    ]
  }
};

const courses = {
  "CI/CD": [
    {
      name: "Jenkins Complete Course",
      provider: "Udemy",
      url: "https://www.udemy.com/course/jenkins-from-zero-to-hero/",
      level: "Beginner to Advanced",
      duration: "12 hours"
    },
    {
      name: "GitHub Actions Masterclass",
      provider: "Pluralsight",
      url: "https://www.pluralsight.com/courses/github-actions-getting-started",
      level: "Intermediate",
      duration: "8 hours"
    },
    {
      name: "Docker & Kubernetes DevOps",
      provider: "A Cloud Guru",
      url: "https://acloudguru.com/course/docker-and-kubernetes-the-complete-guide",
      level: "Advanced",
      duration: "15 hours"
    }
  ],
  "Security": [
    {
      name: "OWASP Top 10 Security Risks",
      provider: "Cybrary",
      url: "https://www.cybrary.it/course/owasp-top-10/",
      level: "Beginner",
      duration: "6 hours"
    },
    {
      name: "Application Security Testing",
      provider: "SANS",
      url: "https://www.sans.org/cyber-security-courses/web-app-penetration-testing-ethical-hacking/",
      level: "Advanced",
      duration: "40 hours"
    },
    {
      name: "Secure Code Review",
      provider: "Checkmarx Academy",
      url: "https://checkmarx.com/resource/documents/en/34965-8-secure-code-review-checklist.html",
      level: "Intermediate",
      duration: "10 hours"
    }
  ],
  "Cloud": [
    {
      name: "AWS Security Specialty",
      provider: "A Cloud Guru",
      url: "https://acloudguru.com/course/aws-certified-security-specialty",
      level: "Advanced",
      duration: "25 hours"
    },
    {
      name: "Kubernetes Security",
      provider: "Linux Academy",
      url: "https://linuxacademy.com/course/kubernetes-security/",
      level: "Intermediate",
      duration: "12 hours"
    },
    {
      name: "Cloud Compliance & Governance",
      provider: "Coursera",
      url: "https://www.coursera.org/learn/cloud-computing-security",
      level: "Intermediate",
      duration: "8 hours"
    }
  ]
};

module.exports = { awsCertifications, courses };
