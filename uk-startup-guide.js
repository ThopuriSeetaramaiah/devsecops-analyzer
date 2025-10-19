// UK Graduate Startup Support Module
const ukStartupSupport = {
    
    // Business Setup Guide
    setupGuide: {
        steps: [
            {
                phase: "Pre-Registration",
                tasks: [
                    {
                        task: "Choose business name",
                        description: "Check availability on Companies House",
                        cost: "Free",
                        timeframe: "1 day",
                        url: "https://find-and-update.company-information.service.gov.uk/"
                    },
                    {
                        task: "Decide business structure",
                        description: "Limited company recommended for startups",
                        cost: "Free consultation",
                        timeframe: "1 day",
                        options: ["Sole trader", "Partnership", "Limited company", "LLP"]
                    }
                ]
            },
            {
                phase: "Registration",
                tasks: [
                    {
                        task: "Register with Companies House",
                        description: "Incorporate your limited company",
                        cost: "£12",
                        timeframe: "24 hours",
                        url: "https://www.gov.uk/register-a-company-online"
                    },
                    {
                        task: "Register for Corporation Tax",
                        description: "Must be done within 3 months of incorporation",
                        cost: "Free",
                        timeframe: "1 day",
                        url: "https://www.gov.uk/register-for-corporation-tax"
                    }
                ]
            },
            {
                phase: "Banking & Finance",
                tasks: [
                    {
                        task: "Open business bank account",
                        description: "Required for limited companies",
                        cost: "£0-£25/month",
                        timeframe: "1-2 weeks",
                        providers: ["Starling", "Monzo", "Tide", "HSBC", "Barclays"]
                    },
                    {
                        task: "Set up accounting system",
                        description: "Track income, expenses, and VAT",
                        cost: "£10-£30/month",
                        timeframe: "1 day",
                        options: ["FreeAgent", "Xero", "QuickBooks", "Sage"]
                    }
                ]
            }
        ]
    },

    // Funding Options
    fundingOptions: {
        government: [
            {
                name: "Start Up Loans",
                description: "Government-backed personal loans for startups",
                amount: "£500 - £25,000",
                interestRate: "6% fixed",
                eligibility: "UK residents, any age, viable business plan",
                url: "https://www.startuploans.co.uk/",
                applicationTime: "4-6 weeks"
            },
            {
                name: "Innovate UK Smart Grants",
                description: "Grants for innovative R&D projects",
                amount: "£25,000 - £2,000,000",
                interestRate: "Grant (no repayment)",
                eligibility: "UK-based innovative projects",
                url: "https://www.ukri.org/councils/innovate-uk/",
                applicationTime: "3-6 months"
            },
            {
                name: "Help to Grow: Digital",
                description: "Software and digital training support",
                amount: "Up to £5,000 discount",
                interestRate: "Grant",
                eligibility: "SMEs with 5-249 employees",
                url: "https://www.help-to-grow-digital.service.gov.uk/",
                applicationTime: "2-4 weeks"
            }
        ],
        
        private: [
            {
                name: "Angel Investors",
                description: "Individual investors providing capital and mentorship",
                amount: "£10,000 - £500,000",
                equity: "10-25%",
                platforms: ["AngelList", "SeedLegals", "Angel Investment Network"],
                stage: "Seed/Early stage"
            },
            {
                name: "Venture Capital",
                description: "Professional investment firms",
                amount: "£500,000+",
                equity: "20-40%",
                firms: ["Balderton Capital", "Index Ventures", "Accel"],
                stage: "Series A+"
            },
            {
                name: "Crowdfunding",
                description: "Raise money from the public",
                amount: "£1,000 - £1,000,000+",
                platforms: ["Kickstarter", "Indiegogo", "Crowdcube", "Seedrs"],
                stage: "Any stage"
            }
        ]
    },

    // Tax Incentives
    taxIncentives: {
        seis: {
            name: "Seed Enterprise Investment Scheme (SEIS)",
            description: "Tax relief for investors in early-stage companies",
            investorBenefit: "50% income tax relief + CGT exemption",
            companyBenefit: "Easier to raise investment",
            maxRaise: "£250,000",
            eligibility: "Less than 2 years old, fewer than 25 employees"
        },
        eis: {
            name: "Enterprise Investment Scheme (EIS)",
            description: "Tax relief for investors in growing companies",
            investorBenefit: "30% income tax relief + CGT deferral",
            companyBenefit: "Access to larger investment amounts",
            maxRaise: "£5,000,000 per year",
            eligibility: "Less than 7 years old (10 for knowledge-intensive)"
        },
        rnd: {
            name: "R&D Tax Credits",
            description: "Tax relief for research and development activities",
            benefit: "33% additional deduction or 14.5% cash credit",
            eligibility: "Companies conducting qualifying R&D",
            maxClaim: "No limit",
            sectors: ["Software", "Engineering", "Biotech", "Fintech"]
        }
    },

    // Support Organizations
    supportOrganizations: [
        {
            name: "Prince's Trust Enterprise",
            description: "Support for 18-30 year olds starting businesses",
            services: ["Mentoring", "Funding", "Training"],
            funding: "Up to £7,500",
            url: "https://www.princes-trust.org.uk/",
            eligibility: "18-30 years old, unemployed or working less than 16 hours"
        },
        {
            name: "Tech Nation",
            description: "Support network for tech entrepreneurs",
            services: ["Visa support", "Networking", "Mentoring"],
            programs: ["Tech Nation Visa", "Applied Digital Skills"],
            url: "https://technation.io/",
            eligibility: "Tech startups and scale-ups"
        },
        {
            name: "Startup Britain",
            description: "National campaign supporting entrepreneurs",
            services: ["Resources", "Events", "Networking"],
            url: "https://startupbritain.org/",
            eligibility: "All UK entrepreneurs"
        }
    ],

    // Legal Requirements
    legalRequirements: {
        dataProtection: {
            requirement: "GDPR Compliance",
            description: "Protect customer data and privacy",
            cost: "£0-£500 (depending on complexity)",
            deadline: "Before processing personal data",
            resources: ["ICO guidance", "Privacy policy templates"]
        },
        employment: {
            requirement: "Employment Law",
            description: "Comply with hiring and employment regulations",
            cost: "£0-£200/month (HR software)",
            deadline: "Before hiring first employee",
            resources: ["ACAS guidance", "Employment contracts"]
        },
        intellectual_property: {
            requirement: "IP Protection",
            description: "Protect trademarks, patents, copyrights",
            cost: "£170-£400 per trademark",
            deadline: "As soon as possible",
            resources: ["IPO guidance", "Patent attorneys"]
        }
    },

    // Networking Events
    networkingEvents: [
        {
            name: "London Tech Week",
            description: "Europe's largest tech festival",
            frequency: "Annual (June)",
            location: "London",
            cost: "Free - £500",
            url: "https://londontechweek.com/"
        },
        {
            name: "Startup Grind",
            description: "Global startup community events",
            frequency: "Monthly",
            location: "Multiple UK cities",
            cost: "Free - £30",
            url: "https://www.startupgrind.com/"
        },
        {
            name: "TechCrunch Disrupt",
            description: "Startup competition and conference",
            frequency: "Annual",
            location: "London (when in Europe)",
            cost: "£500 - £2000",
            url: "https://techcrunch.com/events/"
        }
    ]
};

// Helper functions for UK startup support
const startupHelpers = {
    
    calculateSetupCosts: (businessType = 'limited') => {
        const costs = {
            limited: {
                registration: 12,
                bankAccount: 0, // Many free options
                accounting: 15, // Monthly average
                insurance: 20, // Monthly average
                website: 10, // Monthly hosting
                total: 57
            },
            sole_trader: {
                registration: 0,
                bankAccount: 0,
                accounting: 10,
                insurance: 15,
                website: 10,
                total: 35
            }
        };
        
        return costs[businessType] || costs.limited;
    },

    checkEligibility: (graduationYear, age, location) => {
        const currentYear = new Date().getFullYear();
        const yearsFromGrad = currentYear - graduationYear;
        
        const eligibility = {
            startupPlan: yearsFromGrad <= 2,
            princeTrust: age >= 18 && age <= 30,
            startUpLoans: location === 'UK',
            seis: true, // Most startups eligible
            eis: true
        };

        return eligibility;
    },

    generateBusinessPlan: (idea, stage, funding) => {
        return {
            executiveSummary: `Business plan for ${idea}`,
            marketAnalysis: "UK market research required",
            financialProjections: `Seeking £${funding} funding`,
            currentStage: stage,
            nextSteps: [
                "Validate market demand",
                "Build MVP",
                "Secure initial funding",
                "Hire key team members"
            ]
        };
    }
};

module.exports = { ukStartupSupport, startupHelpers };
