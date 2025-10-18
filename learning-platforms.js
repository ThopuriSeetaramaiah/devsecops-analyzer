// Learning Platform Integration & Recommendations
const learningPlatforms = {
  "CI/CD": {
    beginner: [
      {
        platform: "KodeKloud",
        course: "DevOps Prerequisites Course",
        url: "https://kodekloud.com/courses/devops-prerequisites-course/",
        price: "$15/month",
        duration: "8 hours",
        rating: 4.8,
        description: "Perfect foundation for CI/CD concepts"
      },
      {
        platform: "Udemy",
        course: "Complete CI/CD Pipeline using Jenkins",
        url: "https://www.udemy.com/course/complete-cicd-pipeline-using-jenkins/",
        price: "$49.99",
        duration: "12 hours",
        rating: 4.6,
        description: "Hands-on Jenkins pipeline creation"
      }
    ],
    intermediate: [
      {
        platform: "Pluralsight",
        course: "Building a Modern CI/CD Pipeline",
        url: "https://www.pluralsight.com/courses/building-modern-cicd-pipeline",
        price: "$29/month",
        duration: "4 hours",
        rating: 4.7,
        description: "Advanced pipeline patterns and best practices"
      },
      {
        platform: "KodeKloud",
        course: "Kubernetes for Absolute Beginners",
        url: "https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/",
        price: "$15/month",
        duration: "6 hours",
        rating: 4.9,
        description: "Container orchestration fundamentals"
      }
    ],
    advanced: [
      {
        platform: "Pluralsight",
        course: "Advanced Kubernetes Deployment Patterns",
        url: "https://www.pluralsight.com/courses/kubernetes-deployment-patterns",
        price: "$29/month",
        duration: "3 hours",
        rating: 4.8,
        description: "Production-ready deployment strategies"
      }
    ]
  },
  "Security": {
    beginner: [
      {
        platform: "KodeKloud",
        course: "Certified Kubernetes Security Specialist",
        url: "https://kodekloud.com/courses/certified-kubernetes-security-specialist-cks/",
        price: "$15/month",
        duration: "15 hours",
        rating: 4.9,
        description: "Comprehensive Kubernetes security"
      },
      {
        platform: "Udemy",
        course: "DevSecOps: Secure Software Development",
        url: "https://www.udemy.com/course/devsecops-secure-software-development/",
        price: "$59.99",
        duration: "10 hours",
        rating: 4.5,
        description: "Security integration in development lifecycle"
      }
    ],
    intermediate: [
      {
        platform: "Pluralsight",
        course: "Application Security for Developers",
        url: "https://www.pluralsight.com/courses/application-security-developers",
        price: "$29/month",
        duration: "5 hours",
        rating: 4.6,
        description: "Secure coding practices and vulnerability assessment"
      }
    ],
    advanced: [
      {
        platform: "Pluralsight",
        course: "Advanced Threat Modeling",
        url: "https://www.pluralsight.com/courses/advanced-threat-modeling",
        price: "$29/month",
        duration: "4 hours",
        rating: 4.7,
        description: "Enterprise security architecture"
      }
    ]
  },
  "Cloud": {
    beginner: [
      {
        platform: "KodeKloud",
        course: "AWS Certified Solutions Architect",
        url: "https://kodekloud.com/courses/aws-certified-solutions-architect-associate/",
        price: "$15/month",
        duration: "20 hours",
        rating: 4.8,
        description: "Complete AWS fundamentals and architecture"
      },
      {
        platform: "Udemy",
        course: "AWS Certified Cloud Practitioner",
        url: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/",
        price: "$44.99",
        duration: "14 hours",
        rating: 4.7,
        description: "AWS basics and cloud concepts"
      }
    ],
    intermediate: [
      {
        platform: "Pluralsight",
        course: "AWS Security Best Practices",
        url: "https://www.pluralsight.com/courses/aws-security-best-practices",
        price: "$29/month",
        duration: "6 hours",
        rating: 4.8,
        description: "Advanced AWS security implementation"
      }
    ],
    advanced: [
      {
        platform: "KodeKloud",
        course: "Terraform for AWS Infrastructure",
        url: "https://kodekloud.com/courses/terraform-for-beginners/",
        price: "$15/month",
        duration: "8 hours",
        rating: 4.9,
        description: "Infrastructure as Code mastery"
      }
    ]
  }
};

// Certification Roadmaps
const certificationPaths = {
  "DevSecOps Engineer": {
    beginner: [
      { name: "AWS Cloud Practitioner", priority: "High", timeframe: "1-2 months" },
      { name: "Docker Certified Associate", priority: "Medium", timeframe: "1 month" }
    ],
    intermediate: [
      { name: "AWS Solutions Architect Associate", priority: "High", timeframe: "2-3 months" },
      { name: "Certified Kubernetes Administrator (CKA)", priority: "High", timeframe: "2-3 months" },
      { name: "CompTIA Security+", priority: "Medium", timeframe: "2 months" }
    ],
    advanced: [
      { name: "AWS Security Specialty", priority: "High", timeframe: "3-4 months" },
      { name: "Certified Kubernetes Security Specialist (CKS)", priority: "High", timeframe: "2-3 months" },
      { name: "CISSP", priority: "Medium", timeframe: "6 months" }
    ]
  }
};

// Mentoring & Open Source Opportunities
const advancedOpportunities = {
  mentoring: [
    {
      platform: "ADPList",
      url: "https://adplist.org/",
      description: "Mentor aspiring DevSecOps professionals",
      commitment: "2-4 hours/week",
      benefits: "Build leadership skills, expand network"
    },
    {
      platform: "MentorCruise",
      url: "https://mentorcruise.com/",
      description: "Paid mentoring in DevSecOps",
      commitment: "Flexible",
      benefits: "Earn $50-200/hour while helping others"
    }
  ],
  openSource: [
    {
      project: "Kubernetes Security",
      url: "https://github.com/kubernetes/kubernetes",
      description: "Contribute to Kubernetes security features",
      skillLevel: "Advanced",
      impact: "High visibility in DevSecOps community"
    },
    {
      project: "OWASP Projects",
      url: "https://owasp.org/projects/",
      description: "Security tools and documentation",
      skillLevel: "Intermediate",
      impact: "Industry recognition in security"
    },
    {
      project: "Terraform Providers",
      url: "https://github.com/hashicorp/terraform",
      description: "Infrastructure automation tools",
      skillLevel: "Intermediate",
      impact: "DevOps community contribution"
    }
  ],
  communities: [
    {
      name: "DevSecOps Community",
      url: "https://www.devsecops.org/",
      description: "Global DevSecOps practitioners network",
      activities: "Conferences, webinars, local meetups"
    },
    {
      name: "CNCF Community",
      url: "https://www.cncf.io/community/",
      description: "Cloud Native Computing Foundation",
      activities: "KubeCon, working groups, special interest groups"
    }
  ]
};

module.exports = { learningPlatforms, certificationPaths, advancedOpportunities };
