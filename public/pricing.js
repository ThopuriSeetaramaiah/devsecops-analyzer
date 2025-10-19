// Pricing page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePricing();
    setupModalHandlers();
});

function initializePricing() {
    // Check current user plan
    const userPlan = localStorage.getItem('userPlan') || 'free';
    updateCurrentPlanDisplay(userPlan);
}

function updateCurrentPlanDisplay(plan) {
    const buttons = document.querySelectorAll('.pricing-card button');
    buttons.forEach(btn => {
        btn.classList.remove('current-plan');
        btn.textContent = btn.textContent.replace('Current Plan', 'Upgrade');
    });

    if (plan === 'free') {
        document.querySelector('.pricing-card:first-child button').classList.add('current-plan');
        document.querySelector('.pricing-card:first-child button').textContent = 'Current Plan';
    }
}

function upgradeToPro() {
    // Simulate payment process
    if (confirm('Upgrade to Pro for £29/month?\n\nThis will unlock:\n• Unlimited questions\n• AI-generated content\n• Advanced analytics\n• Priority support')) {
        processUpgrade('pro', 29);
    }
}

function applyForStartupPlan() {
    document.getElementById('startupModal').style.display = 'block';
}

function processUpgrade(plan, price) {
    // Show loading state
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        localStorage.setItem('userPlan', plan);
        localStorage.setItem('planPrice', price);
        
        // Show success message
        alert(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 2000);
}

function setupModalHandlers() {
    const modal = document.getElementById('startupModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('startupForm');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    form.onsubmit = function(e) {
        e.preventDefault();
        handleStartupApplication();
    };
}

function handleStartupApplication() {
    const formData = {
        university: document.getElementById('university').value,
        gradYear: document.getElementById('gradYear').value,
        startupIdea: document.getElementById('startupIdea').value,
        currentStage: document.getElementById('currentStage').value
    };

    // Validate graduation year eligibility
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.gradYear);
    
    if (currentYear - gradYear > 2) {
        alert('Sorry, this offer is only available to graduates within 2 years of graduation.');
        return;
    }

    // Submit application
    submitStartupApplication(formData);
}

async function submitStartupApplication(formData) {
    try {
        const response = await fetch('/api/startup-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Application submitted successfully! We\'ll review your application and get back to you within 24 hours.');
            document.getElementById('startupModal').style.display = 'none';
            
            // Auto-approve for demo (in real app, this would be manual review)
            setTimeout(() => {
                if (confirm('Congratulations! Your startup application has been approved.\n\nUpgrade to Startup Accelerator plan for £9/month?')) {
                    processUpgrade('startup', 9);
                }
            }, 3000);
        } else {
            throw new Error('Application submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your application. Please try again.');
    }
}

// UK Startup Resources
const ukStartupResources = {
    funding: [
        {
            name: 'Start Up Loans',
            description: 'Government-backed loans up to £25,000',
            url: 'https://www.startuploans.co.uk/',
            eligibility: 'UK residents, any age'
        },
        {
            name: 'Innovate UK',
            description: 'Grants for innovative businesses',
            url: 'https://www.ukri.org/councils/innovate-uk/',
            eligibility: 'UK-based innovative projects'
        },
        {
            name: 'British Business Bank',
            description: 'Various funding schemes',
            url: 'https://www.british-business-bank.co.uk/',
            eligibility: 'UK SMEs'
        }
    ],
    
    setup: [
        {
            step: 'Choose business structure',
            details: 'Limited company, sole trader, or partnership',
            cost: '£12-£100'
        },
        {
            step: 'Register with Companies House',
            details: 'Online registration for limited companies',
            cost: '£12'
        },
        {
            step: 'Register for taxes',
            details: 'Corporation tax, VAT (if applicable), PAYE',
            cost: 'Free'
        },
        {
            step: 'Open business bank account',
            details: 'Required for limited companies',
            cost: 'Varies'
        }
    ]
};

function showStartupResources() {
    // This could open a detailed resources modal
    console.log('UK Startup Resources:', ukStartupResources);
}
