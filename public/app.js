class DevSecOpsAnalyzer {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.currentUser = null;
        this.certifications = [];
        this.currentCert = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadQuestions();
        await this.loadCertifications();
        this.checkUserStatus();
    }

    checkUserStatus() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const guestMode = localStorage.getItem('guestMode');
        
        if (user) {
            // User is logged in, hide form fields and show welcome
            document.getElementById('guestForm').style.display = 'none';
            document.getElementById('userWelcome').style.display = 'block';
            document.getElementById('userWelcome').textContent = 
                `Welcome back, ${user.firstName || user.name}! Click below to start your assessment.`;
        } else if (!guestMode) {
            // Show guest form
            document.getElementById('guestForm').style.display = 'block';
            document.getElementById('userWelcome').style.display = 'none';
        }
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startAssessment());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAssessment());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeAssessment());
        document.getElementById('submitCertBtn').addEventListener('click', () => this.submitCertification());
        document.getElementById('backToCertsBtn').addEventListener('click', () => this.showCertifications());
        document.getElementById('backToCertsBtn2').addEventListener('click', () => this.showCertifications());
        document.getElementById('retakeCertBtn').addEventListener('click', () => this.retakeCertification());
    }

    async loadCertifications() {
        try {
            const response = await fetch('/api/certifications');
            this.certifications = await response.json();
            this.renderCertifications();
        } catch (error) {
            console.error('Failed to load certifications:', error);
        }
    }

    renderCertifications() {
        const container = document.getElementById('certificationsList');
        container.innerHTML = `
            <div class="cert-grid">
                ${this.certifications.map(cert => `
                    <div class="cert-card" onclick="app.startCertification('${cert.id}')">
                        <div class="cert-title">${cert.name}</div>
                        <div class="cert-info">${cert.questionCount} Practice Questions</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async startCertification(certId) {
        try {
            const response = await fetch(`/api/certification/${certId}`);
            this.currentCert = await response.json();
            this.currentCert.id = certId;
            
            document.getElementById('certificationsList').style.display = 'none';
            document.getElementById('certificationTest').style.display = 'block';
            
            this.renderCertificationTest();
        } catch (error) {
            this.showAlert('Failed to load certification test', 'error');
        }
    }

    renderCertificationTest() {
        document.getElementById('certTestHeader').innerHTML = `
            <h3>📜 ${this.currentCert.name}</h3>
            <p>Answer all ${this.currentCert.questions.length} questions. Each question includes detailed explanations.</p>
        `;

        const container = document.getElementById('certQuestionsContainer');
        container.innerHTML = '';
        
        this.currentCert.questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-card';
            questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="category-badge">Question ${index + 1}</span>
                    <span class="question-number">${index + 1}/${this.currentCert.questions.length}</span>
                </div>
                <h3 class="question-text">${q.question}</h3>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <label class="option-label">
                            <input type="radio" name="cert_q${index}" value="${i}" class="option-input">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            container.appendChild(questionDiv);
        });
    }

    async submitCertification() {
        const answers = [];
        let unanswered = 0;
        
        this.currentCert.questions.forEach((_, index) => {
            const selected = document.querySelector(`input[name="cert_q${index}"]:checked`);
            if (selected) {
                answers.push(parseInt(selected.value));
            } else {
                answers.push(-1);
                unanswered++;
            }
        });

        if (unanswered > 0) {
            this.showAlert(`Please answer all questions (${unanswered} remaining)`, 'warning');
            return;
        }

        // Use current user or ask for info
        if (!this.currentUser) {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const guestMode = localStorage.getItem('guestMode');
            
            if (user) {
                this.currentUser = {
                    name: user.name || `${user.firstName} ${user.lastName}`,
                    email: user.email
                };
            } else if (guestMode) {
                const name = prompt('Enter your name:');
                const email = prompt('Enter your email:');
                if (!name || !email) return;
                this.currentUser = { name, email };
            } else {
                window.location.href = 'login.html';
                return;
            }
        }

        try {
            const response = await fetch(`/api/certification/${this.currentCert.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    answers, 
                    userInfo: this.currentUser 
                })
            });

            const result = await response.json();
            
            // Save certification results
            this.saveCertificationResults(result);
            
            this.showCertificationResults(result);
        } catch (error) {
            this.showAlert('Failed to submit test', 'error');
        }
    }

    saveCertificationResults(result) {
        const certData = {
            id: this.currentCert.id,
            name: this.currentCert.name,
            score: result.score,
            total: result.total,
            percentage: result.percentage,
            passed: result.percentage >= 70,
            date: new Date().toISOString(),
            results: result.results
        };

        // Save to certification history
        const certHistory = JSON.parse(localStorage.getItem('certificationHistory') || '[]');
        certHistory.push(certData);
        localStorage.setItem('certificationHistory', JSON.stringify(certHistory));

        // Update recent activity
        const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        recentActivity.unshift({
            icon: '📜',
            title: `${this.currentCert.name} Completed`,
            description: `Score: ${result.percentage}% - ${result.percentage >= 70 ? 'PASSED' : 'NEEDS WORK'}`,
            time: 'Just now'
        });
        
        if (recentActivity.length > 5) recentActivity.pop();
        localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
    }

    showCertificationResults(result) {
        document.getElementById('certificationTest').style.display = 'none';
        document.getElementById('certResults').style.display = 'block';
        
        const passStatus = result.percentage >= 70 ? 'PASS' : 'NEEDS IMPROVEMENT';
        const statusClass = result.percentage >= 70 ? 'good' : 'poor';
        
        document.getElementById('certResultsContainer').innerHTML = `
            <div class="score-summary">
                <div class="overall-score ${statusClass}">
                    <h2>${result.percentage}%</h2>
                    <p>${passStatus}</p>
                </div>
                <div class="score-details">
                    <p><strong>${result.score}</strong> out of <strong>${result.total}</strong> questions correct</p>
                    <p>Results have been sent to your email with detailed explanations.</p>
                </div>
            </div>
            
            <div class="category-breakdown">
                <h3>📝 Question Review</h3>
                ${result.results.map((res, index) => `
                    <div class="category-item">
                        <div class="question-review ${res.isCorrect ? 'correct' : 'incorrect'}">
                            <p><strong>Q${index + 1}:</strong> ${res.question}</p>
                            <p><strong>Your Answer:</strong> ${res.userAnswer} ${res.isCorrect ? '✅' : '❌'}</p>
                            ${!res.isCorrect ? `<p><strong>Correct Answer:</strong> ${res.correctAnswer}</p>` : ''}
                            <p class="explanation"><em>${res.explanation}</em></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showCertifications() {
        document.getElementById('certificationTest').style.display = 'none';
        document.getElementById('certResults').style.display = 'none';
        document.getElementById('certificationsList').style.display = 'block';
    }

    retakeCertification() {
        this.renderCertificationTest();
        document.getElementById('certResults').style.display = 'none';
        document.getElementById('certificationTest').style.display = 'block';
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/assessment');
            this.questions = await response.json();
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    }

    startAssessment() {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const guestMode = localStorage.getItem('guestMode');
        
        if (user) {
            // User is logged in, use their data
            this.currentUser = {
                name: user.name || `${user.firstName} ${user.lastName}`,
                email: user.email
            };
            this.showSection('assessment');
            this.renderQuestions();
        } else if (guestMode) {
            // Guest mode, ask for basic info
            const name = prompt('Enter your name for the assessment:');
            const email = prompt('Enter your email for results:');
            
            if (!name || !email) {
                this.showAlert('Name and email are required for assessment', 'error');
                return;
            }
            
            this.currentUser = { name, email };
            this.showSection('assessment');
            this.renderQuestions();
        } else {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
        }
    }

    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';
        
        this.questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-card';
            questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="category-badge">${q.category}</span>
                    <span class="question-number">Question ${index + 1}/${this.questions.length}</span>
                </div>
                <h3 class="question-text">${q.question}</h3>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <label class="option-label">
                            <input type="radio" name="q${index}" value="${i}" class="option-input">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            container.appendChild(questionDiv);
        });
    }

    async submitAssessment() {
        this.answers = [];
        let unanswered = 0;
        
        this.questions.forEach((_, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected) {
                this.answers.push(parseInt(selected.value));
            } else {
                this.answers.push(-1);
                unanswered++;
            }
        });

        if (unanswered > 0) {
            this.showAlert(`Please answer all questions (${unanswered} remaining)`, 'warning');
            return;
        }

        try {
            const response = await fetch('/api/assessment/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    answers: this.answers, 
                    userInfo: this.currentUser 
                })
            });

            if (!response.ok) throw new Error('Submission failed');
            
            const result = await response.json();
            
            // Save assessment results locally
            this.saveAssessmentResults(result);
            
            this.showResults(result);
        } catch (error) {
            this.showAlert('Failed to submit assessment. Please try again.', 'error');
            console.error('Submission error:', error);
        }
    }

    saveAssessmentResults(result) {
        // Save to localStorage for dashboard display
        const assessmentData = {
            score: result.score,
            total: this.questions.length,
            percentage: Math.round((result.score / this.questions.length) * 100),
            results: result.results,
            learningPath: result.learningPath,
            date: new Date().toISOString(),
            userId: result.userId
        };

        // Save individual assessment
        const assessmentHistory = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        assessmentHistory.push(assessmentData);
        localStorage.setItem('assessmentHistory', JSON.stringify(assessmentHistory));

        // Save latest results for dashboard
        localStorage.setItem('lastAssessmentResults', JSON.stringify(assessmentData));

        // Update recent activity
        const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        recentActivity.unshift({
            icon: '📝',
            title: 'DevSecOps Assessment Completed',
            description: `Score: ${assessmentData.percentage}% - ${this.getPerformanceText(assessmentData.percentage)}`,
            time: 'Just now'
        });
        
        // Keep only last 5 activities
        if (recentActivity.length > 5) recentActivity.pop();
        localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
    }

    getPerformanceText(percentage) {
        if (percentage >= 80) return "Excellent performance";
        if (percentage >= 70) return "Good performance";
        if (percentage >= 50) return "Average performance";
        return "Needs improvement";
    }

    showResults(result) {
        this.showSection('results');
        
        const overallScore = Math.round((result.score / this.questions.length) * 100);
        const scoreClass = overallScore >= 70 ? 'good' : overallScore >= 50 ? 'average' : 'poor';
        
        document.getElementById('resultsContainer').innerHTML = `
            <div class="score-summary">
                <div class="overall-score ${scoreClass}">
                    <h2>${overallScore}%</h2>
                    <p>Overall Score</p>
                </div>
                <div class="score-details">
                    <p><strong>${result.score}</strong> out of <strong>${this.questions.length}</strong> questions correct</p>
                    <p class="performance-level">${this.getPerformanceLevel(overallScore)}</p>
                </div>
            </div>

            <div class="category-breakdown">
                <h3>Category Performance</h3>
                ${Object.entries(result.results).map(([category, data]) => {
                    const percentage = Math.round((data.correct / data.total) * 100);
                    const barClass = percentage >= 70 ? 'good' : percentage >= 50 ? 'average' : 'poor';
                    return `
                        <div class="category-item">
                            <div class="category-header">
                                <span class="category-name">${category}</span>
                                <span class="category-score">${data.correct}/${data.total} (${percentage}%)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill ${barClass}" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="learning-path">
                <h3>🎯 Your Personalized Learning Path</h3>
                ${result.learningPath.length > 0 ? 
                    result.learningPath.map(item => `
                        <div class="learning-item priority-${item.priority.toLowerCase()}">
                            <div class="learning-header">
                                <h4>${item.category}</h4>
                                <span class="priority-badge ${item.priority.toLowerCase()}">${item.priority} Priority</span>
                            </div>
                            <div class="resources">
                                <p><strong>Recommended Resources:</strong></p>
                                <ul>
                                    ${item.resources.map(resource => `<li>${resource}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('') 
                    : '<p class="success-message">🎉 Great job! You\'re performing well across all categories.</p>'
                }
            </div>

            <div class="next-steps">
                <h3>📈 Your Next Steps</h3>
                <div class="next-steps-container">
                    <div class="next-step-item">
                        <h4>🎯 Immediate Actions</h4>
                        <div class="action-list">
                            ${result.learningPath.length > 0 ? 
                                result.learningPath.slice(0, 2).map(item => `
                                    <div class="action-item priority-${item.priority.toLowerCase()}">
                                        <strong>${item.category}</strong> - ${item.priority} Priority
                                        <div class="course-recommendations">
                                            ${this.getCourseRecommendations(item.category)}
                                        </div>
                                    </div>
                                `).join('') 
                                : '<p>Great job! Focus on advanced topics and certifications.</p>'
                            }
                        </div>
                    </div>
                    
                    <div class="next-step-item">
                        <h4>📚 Recommended Learning Platforms</h4>
                        <div class="platform-grid">
                            <div class="platform-card">
                                <h5>KodeKloud</h5>
                                <p>Hands-on DevOps & Cloud labs</p>
                                <span class="platform-price">$15/month</span>
                                <a href="https://kodekloud.com/" target="_blank" class="platform-btn">Explore Courses</a>
                            </div>
                            <div class="platform-card">
                                <h5>Udemy</h5>
                                <p>Comprehensive DevSecOps courses</p>
                                <span class="platform-price">$49-89/course</span>
                                <a href="https://www.udemy.com/courses/search/?q=devsecops" target="_blank" class="platform-btn">Browse Courses</a>
                            </div>
                            <div class="platform-card">
                                <h5>Pluralsight</h5>
                                <p>Advanced skill assessments</p>
                                <span class="platform-price">$29/month</span>
                                <a href="https://www.pluralsight.com/browse/information-cyber-security" target="_blank" class="platform-btn">Start Learning</a>
                            </div>
                        </div>
                    </div>

                    ${overallScore >= 80 ? `
                    <div class="next-step-item advanced-opportunities">
                        <h4>🌟 Advanced Opportunities</h4>
                        <div class="opportunity-grid">
                            <div class="opportunity-card">
                                <h5>💼 Start Mentoring</h5>
                                <p>Share your expertise and earn $50-200/hour</p>
                                <div class="opportunity-links">
                                    <a href="https://adplist.org/" target="_blank">ADPList</a>
                                    <a href="https://mentorcruise.com/" target="_blank">MentorCruise</a>
                                </div>
                            </div>
                            <div class="opportunity-card">
                                <h5>🔧 Open Source Contribution</h5>
                                <p>Build your reputation in the DevSecOps community</p>
                                <div class="opportunity-links">
                                    <a href="https://github.com/kubernetes/kubernetes" target="_blank">Kubernetes</a>
                                    <a href="https://owasp.org/projects/" target="_blank">OWASP Projects</a>
                                </div>
                            </div>
                            <div class="opportunity-card">
                                <h5>🎤 Speaking & Writing</h5>
                                <p>Share knowledge through conferences and blogs</p>
                                <div class="opportunity-links">
                                    <a href="https://www.devsecops.org/" target="_blank">DevSecOps Community</a>
                                    <a href="https://www.cncf.io/community/" target="_blank">CNCF Community</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getPerformanceLevel(score) {
        if (score >= 80) return "🌟 Excellent - You're DevSecOps ready!";
        if (score >= 70) return "✅ Good - Minor improvements needed";
        if (score >= 50) return "⚠️ Average - Focus on key areas";
        return "🔴 Needs Improvement - Significant learning required";
    }

    getCourseRecommendations(category) {
        const courseMap = {
            "CI/CD": [
                { name: "Complete CI/CD Pipeline using Jenkins", platform: "Udemy", url: "https://www.udemy.com/course/complete-cicd-pipeline-using-jenkins/" },
                { name: "Kubernetes for Absolute Beginners", platform: "KodeKloud", url: "https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/" }
            ],
            "Security": [
                { name: "DevSecOps: Secure Software Development", platform: "Udemy", url: "https://www.udemy.com/course/devsecops-secure-software-development/" },
                { name: "Certified Kubernetes Security Specialist", platform: "KodeKloud", url: "https://kodekloud.com/courses/certified-kubernetes-security-specialist-cks/" }
            ],
            "Cloud": [
                { name: "AWS Certified Solutions Architect", platform: "KodeKloud", url: "https://kodekloud.com/courses/aws-certified-solutions-architect-associate/" },
                { name: "AWS Security Best Practices", platform: "Pluralsight", url: "https://www.pluralsight.com/courses/aws-security-best-practices" }
            ]
        };

        const courses = courseMap[category] || [];
        return courses.map(course => 
            `<a href="${course.url}" target="_blank" class="course-link">${course.name} (${course.platform})</a>`
        ).join('');
    }

    retakeAssessment() {
        this.answers = [];
        this.showSection('userForm');
        document.getElementById('name').value = this.currentUser?.name || '';
        document.getElementById('email').value = this.currentUser?.email || '';
    }

    showSection(sectionId) {
        ['userForm', 'assessment', 'results'].forEach(id => {
            document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
        });
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Global functions
function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.add('active');
    selectedTab.style.display = 'block';
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DevSecOpsAnalyzer();
});
