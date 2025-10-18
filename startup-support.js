// Startup Support for Graduates - Infrastructure & Security Consulting
const startupSupport = {
  businessIdeas: {
    "DevOps Consulting": {
      description: "Help companies implement CI/CD pipelines and automation",
      target_market: "Small to medium businesses without dedicated DevOps teams",
      services: [
        "CI/CD Pipeline Setup ($2,000-5,000 per project)",
        "Infrastructure Automation ($3,000-8,000 per project)", 
        "Cloud Migration Services ($5,000-15,000 per project)",
        "DevOps Training & Workshops ($1,000-3,000 per session)"
      ],
      startup_cost: "$2,000-5,000",
      monthly_revenue_potential: "$8,000-25,000",
      skills_needed: ["AWS/Azure", "Terraform", "Jenkins/GitHub Actions", "Docker/Kubernetes"],
      time_to_profitability: "2-4 months"
    },
    "Security Consulting": {
      description: "Provide cybersecurity assessments and compliance services",
      target_market: "SMBs needing security audits and compliance",
      services: [
        "Security Assessments ($3,000-10,000 per audit)",
        "Compliance Implementation ($5,000-20,000 per project)",
        "Penetration Testing ($2,000-8,000 per test)",
        "Security Training ($1,500-4,000 per session)"
      ],
      startup_cost: "$3,000-8,000",
      monthly_revenue_potential: "$10,000-35,000",
      skills_needed: ["CISSP", "Ethical Hacking", "Compliance Frameworks", "Risk Assessment"],
      time_to_profitability: "3-6 months"
    },
    "Cloud Infrastructure Services": {
      description: "Design and manage cloud infrastructure for businesses",
      target_market: "Companies migrating to cloud or optimizing costs",
      services: [
        "Cloud Architecture Design ($4,000-12,000 per project)",
        "Cost Optimization ($2,000-6,000 + 20% of savings)",
        "Managed Cloud Services ($1,000-5,000 per month per client)",
        "Disaster Recovery Planning ($3,000-10,000 per project)"
      ],
      startup_cost: "$1,500-4,000",
      monthly_revenue_potential: "$12,000-40,000",
      skills_needed: ["AWS/Azure/GCP", "Terraform", "Cost Management", "Monitoring"],
      time_to_profitability: "2-3 months"
    },
    "DevSecOps as a Service": {
      description: "End-to-end DevSecOps implementation and management",
      target_market: "Startups and scale-ups needing complete DevSecOps setup",
      services: [
        "Complete DevSecOps Pipeline ($8,000-25,000 setup)",
        "Security Integration ($3,000-10,000 per project)",
        "Ongoing Management ($2,000-8,000 per month)",
        "Team Training & Mentoring ($2,000-6,000 per program)"
      ],
      startup_cost: "$5,000-10,000",
      monthly_revenue_potential: "$15,000-50,000",
      skills_needed: ["Full Stack DevOps", "Security", "Cloud", "Team Leadership"],
      time_to_profitability: "4-6 months"
    }
  },
  
  businessPlan: {
    "Phase 1: Foundation (Months 1-2)": {
      tasks: [
        "Complete advanced certifications (AWS Security, CKA, CISSP)",
        "Build portfolio with 3-5 demo projects",
        "Create business entity (LLC/Corporation)",
        "Set up basic business infrastructure (website, contracts, invoicing)",
        "Network with potential clients (LinkedIn, local meetups)"
      ],
      estimated_cost: "$3,000-5,000",
      expected_revenue: "$0-2,000"
    },
    "Phase 2: First Clients (Months 3-4)": {
      tasks: [
        "Land first 2-3 clients through network",
        "Deliver high-quality projects to build reputation",
        "Collect testimonials and case studies",
        "Refine service offerings based on market feedback",
        "Build referral network"
      ],
      estimated_cost: "$1,000-2,000",
      expected_revenue: "$5,000-15,000"
    },
    "Phase 3: Scale (Months 5-8)": {
      tasks: [
        "Hire first contractor/employee",
        "Develop standardized processes and templates",
        "Create recurring revenue streams (managed services)",
        "Expand service offerings",
        "Build marketing funnel (content, SEO, ads)"
      ],
      estimated_cost: "$5,000-10,000",
      expected_revenue: "$15,000-40,000"
    },
    "Phase 4: Growth (Months 9-12)": {
      tasks: [
        "Build team of 3-5 specialists",
        "Develop proprietary tools and IP",
        "Target enterprise clients",
        "Consider partnerships with larger firms",
        "Plan for Series A or acquisition"
      ],
      estimated_cost: "$15,000-30,000",
      expected_revenue: "$40,000-100,000"
    }
  },

  resources: {
    legal: [
      {
        name: "LegalZoom Business Formation",
        url: "https://www.legalzoom.com/",
        cost: "$300-800",
        description: "LLC/Corporation setup with legal compliance"
      },
      {
        name: "Contracts Templates",
        url: "https://www.lawdepot.com/",
        cost: "$50-200",
        description: "Professional service agreements and NDAs"
      }
    ],
    business_tools: [
      {
        name: "QuickBooks Online",
        url: "https://quickbooks.intuit.com/",
        cost: "$30/month",
        description: "Accounting and invoicing for small business"
      },
      {
        name: "HubSpot CRM",
        url: "https://www.hubspot.com/",
        cost: "Free-$50/month",
        description: "Customer relationship management"
      },
      {
        name: "Calendly",
        url: "https://calendly.com/",
        cost: "Free-$20/month", 
        description: "Client meeting scheduling"
      }
    ],
    marketing: [
      {
        name: "LinkedIn Sales Navigator",
        url: "https://business.linkedin.com/sales-solutions",
        cost: "$80/month",
        description: "Find and connect with potential clients"
      },
      {
        name: "WordPress Business Site",
        url: "https://wordpress.com/",
        cost: "$25/month",
        description: "Professional website with portfolio"
      }
    ],
    technical: [
      {
        name: "AWS Credits for Startups",
        url: "https://aws.amazon.com/startups/",
        cost: "Free credits up to $5,000",
        description: "Cloud infrastructure for demos and development"
      },
      {
        name: "GitHub Pro",
        url: "https://github.com/pricing",
        cost: "$4/month",
        description: "Private repositories for client projects"
      }
    ]
  },

  clientAcquisition: {
    strategies: [
      {
        method: "LinkedIn Outreach",
        description: "Target CTOs and engineering managers at growing companies",
        cost: "$80/month (Sales Navigator)",
        expected_leads: "10-20 per month",
        conversion_rate: "5-10%"
      },
      {
        method: "Content Marketing",
        description: "Blog about DevOps/Security best practices, build authority",
        cost: "$100-300/month (tools + time)",
        expected_leads: "5-15 per month",
        conversion_rate: "10-15%"
      },
      {
        method: "Local Networking",
        description: "Attend tech meetups, startup events, business networking",
        cost: "$200-500/month (events + travel)",
        expected_leads: "3-8 per month",
        conversion_rate: "15-25%"
      },
      {
        method: "Referral Program",
        description: "Offer 10-20% commission for successful referrals",
        cost: "10-20% of project value",
        expected_leads: "2-10 per month",
        conversion_rate: "30-50%"
      }
    ]
  },

  pricingModels: {
    "Project-Based": {
      description: "Fixed price for specific deliverables",
      pros: ["Predictable revenue", "Clear scope", "Higher margins"],
      cons: ["Scope creep risk", "Irregular income"],
      typical_rates: "$75-150/hour equivalent",
      best_for: "Well-defined projects, new consultants"
    },
    "Hourly Consulting": {
      description: "Bill by the hour for consulting and implementation",
      pros: ["Flexible scope", "Easy to price", "No scope creep"],
      cons: ["Income tied to hours", "Harder to scale"],
      typical_rates: "$100-200/hour",
      best_for: "Ongoing support, troubleshooting"
    },
    "Retainer Model": {
      description: "Monthly fee for ongoing services and support",
      pros: ["Predictable income", "Long-term relationships", "Scalable"],
      cons: ["Requires trust building", "Ongoing commitment"],
      typical_rates: "$2,000-10,000/month per client",
      best_for: "Managed services, ongoing support"
    },
    "Value-Based": {
      description: "Price based on value delivered (cost savings, revenue increase)",
      pros: ["Highest margins", "Aligned incentives", "Premium positioning"],
      cons: ["Harder to sell", "Results dependent"],
      typical_rates: "20-30% of value created",
      best_for: "Cost optimization, performance improvements"
    }
  }
};

module.exports = startupSupport;
