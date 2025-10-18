class Dashboard {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.bindEvents();
        this.loadDashboardData();
    }

    checkAuth() {
        const user = localStorage.getItem('user');
        const guestMode = localStorage.getItem('guestMode');
        
        if (!user && !guestMode) {
            // Show login options instead of redirecting
            this.showLoginPrompt();
            return;
        }
        
        if (user) {
            this.user = JSON.parse(user);
            document.getElementById('userName').textContent = this.user.firstName || this.user.name || 'User';
        } else {
            document.getElementById('userName').textContent = 'Guest';
        }
    }

    showLoginPrompt() {
        document.querySelector('.dashboard-main').innerHTML = `
            <div class="login-prompt">
                <div class="prompt-card">
                    <h2>🛡️ Welcome to DevSecOps Analyzer</h2>
                    <p>Sign in to access your personalized dashboard and track your progress</p>
                    <div class="prompt-actions">
                        <a href="signup.html" class="prompt-btn primary">🚀 Create Account</a>
                        <a href="login.html" class="prompt-btn secondary">Sign In</a>
                        <button onclick="continueAsGuest()" class="prompt-btn tertiary">Continue as Guest</button>
                    </div>
                </div>
            </div>
        `;
    }

    loadUserData() {
        // Load user-specific data from localStorage or API
        const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        const certificationHistory = JSON.parse(localStorage.getItem('certificationHistory') || '[]');
        
        this.updateStats(assessmentHistory, certificationHistory);
    }

    updateStats(assessments, certifications) {
        // Update overview stats
        const overallScore = assessments.length > 0 ? 
            Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length) : 0;
        
        document.getElementById('overallScore').textContent = overallScore + '%';
        document.getElementById('assessmentCount').textContent = assessments.length;
        document.getElementById('certCount').textContent = certifications.length;
        
        // Determine skill level
        let skillLevel = 'Beginner';
        if (overallScore >= 80) skillLevel = 'Expert';
        else if (overallScore >= 60) skillLevel = 'Intermediate';
        else if (overallScore >= 40) skillLevel = 'Developing';
        
        document.getElementById('skillLevel').textContent = skillLevel;
    }

    bindEvents() {
        // Navigation events are handled by global functions
    }

    async loadDashboardData() {
        // Load recent activity, progress data, etc.
        this.loadRecentActivity();
        this.loadAssessmentsList();
        this.loadCertificationsList();
    }

    loadRecentActivity() {
        const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        const container = document.getElementById('recentActivity');
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">🚀</div>
                    <div class="activity-content">
                        <h4>Welcome to DevSecOps Analyzer!</h4>
                        <p>Take your first assessment to get started</p>
                        <span class="activity-time">Just now</span>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    loadAssessmentsList() {
        const assessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        const container = document.getElementById('assessmentsList');
        
        if (assessments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No assessments yet</h3>
                    <p>Take your first DevSecOps skill assessment to get personalized recommendations</p>
                    <button class="primary-btn" onclick="startNewAssessment()">Take Assessment</button>
                </div>
            `;
            return;
        }

        container.innerHTML = assessments.map((assessment, index) => `
            <div class="assessment-card">
                <div class="assessment-header">
                    <h4>DevSecOps Assessment #${index + 1}</h4>
                    <span class="assessment-score ${this.getScoreClass(assessment.percentage)}">${assessment.percentage}%</span>
                </div>
                <div class="assessment-details">
                    <p>Score: ${assessment.score}/${assessment.total} questions correct</p>
                    <p>Date: ${new Date(assessment.date).toLocaleDateString()}</p>
                </div>
                <div class="assessment-actions">
                    <button class="btn-secondary" onclick="viewAssessmentDetails(${index})">View Details</button>
                    <button class="btn-primary" onclick="retakeAssessment(${index})">Retake</button>
                </div>
            </div>
        `).join('');
    }

    loadCertificationsList() {
        const certifications = JSON.parse(localStorage.getItem('certificationHistory') || '[]');
        const container = document.getElementById('certificationsList');
        
        if (certifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📜</div>
                    <h3>No certification practice yet</h3>
                    <p>Practice with real AWS and security certification questions</p>
                    <button class="primary-btn" onclick="browseCertifications()">Browse Certifications</button>
                </div>
            `;
            return;
        }

        container.innerHTML = certifications.map((cert, index) => `
            <div class="certification-card">
                <div class="cert-header">
                    <h4>${cert.name}</h4>
                    <span class="cert-status ${cert.passed ? 'passed' : 'failed'}">${cert.passed ? 'PASSED' : 'NEEDS WORK'}</span>
                </div>
                <div class="cert-details">
                    <p>Score: ${cert.score}/${cert.total} (${cert.percentage}%)</p>
                    <p>Date: ${new Date(cert.date).toLocaleDateString()}</p>
                </div>
                <div class="cert-actions">
                    <button class="btn-secondary" onclick="viewCertDetails(${index})">View Results</button>
                    <button class="btn-primary" onclick="retakeCert('${cert.id}')">Practice Again</button>
                </div>
            </div>
        `).join('');
    }

    getScoreClass(percentage) {
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'poor';
    }
}

// Global functions for navigation and actions
function showDashboardTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function startNewAssessment() {
    window.location.href = 'main.html#assessment';
}

function browseCertifications() {
    window.location.href = 'main.html#certifications';
}

function continueAsGuest() {
    localStorage.setItem('guestMode', 'true');
    location.reload();
}

function viewLearningPath() {
    // Show learning path based on last assessment
    const lastAssessment = JSON.parse(localStorage.getItem('lastAssessmentResults') || 'null');
    if (lastAssessment) {
        window.location.href = 'main.html#results';
    } else {
        startNewAssessment();
    }
}

function editProfile() {
    alert('Profile editing coming soon!');
}

function viewSettings() {
    alert('Settings page coming soon!');
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    window.location.href = 'login.html';
}

function viewAssessmentDetails(index) {
    const assessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    const assessment = assessments[index];
    
    alert(`Assessment Details:\nScore: ${assessment.score}/${assessment.total}\nPercentage: ${assessment.percentage}%\nDate: ${new Date(assessment.date).toLocaleDateString()}`);
}

function retakeAssessment(index) {
    startNewAssessment();
}

function viewCertDetails(index) {
    const certifications = JSON.parse(localStorage.getItem('certificationHistory') || '[]');
    const cert = certifications[index];
    
    alert(`Certification: ${cert.name}\nScore: ${cert.score}/${cert.total} (${cert.percentage}%)\nStatus: ${cert.passed ? 'PASSED' : 'NEEDS WORK'}`);
}

function retakeCert(certId) {
    window.location.href = `main.html#cert-${certId}`;
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Add additional styles for new elements
const additionalStyles = `
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #6c757d;
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .empty-state h3 {
        color: #495057;
        margin-bottom: 10px;
    }
    
    .assessment-card, .certification-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
    }
    
    .assessment-header, .cert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .assessment-score, .cert-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .assessment-score.excellent, .cert-status.passed { background: #d4edda; color: #155724; }
    .assessment-score.good { background: #d1ecf1; color: #0c5460; }
    .assessment-score.average { background: #fff3cd; color: #856404; }
    .assessment-score.poor, .cert-status.failed { background: #f8d7da; color: #721c24; }
    
    .assessment-actions, .cert-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .btn-secondary {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .btn-primary {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
