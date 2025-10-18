class DevSecOpsAnalyzer {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadQuestions();
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startAssessment());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAssessment());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeAssessment());
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
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!name || !email) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        this.currentUser = { name, email };
        this.showSection('assessment');
        this.renderQuestions();
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
            this.showResults(result);
        } catch (error) {
            this.showAlert('Failed to submit assessment. Please try again.', 'error');
            console.error('Submission error:', error);
        }
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
                <h3>📈 Next Steps</h3>
                <div class="recommendations">
                    ${this.getRecommendations(result.learningPath, overallScore)}
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

    getRecommendations(learningPath, score) {
        const recommendations = [];
        
        if (score < 50) {
            recommendations.push("Start with fundamentals - focus on one category at a time");
            recommendations.push("Consider taking a structured DevSecOps course");
        } else if (score < 70) {
            recommendations.push("Practice hands-on labs for weak areas");
            recommendations.push("Join DevSecOps communities for peer learning");
        } else {
            recommendations.push("Explore advanced topics and certifications");
            recommendations.push("Consider mentoring others or contributing to open source");
        }

        if (learningPath.length > 0) {
            const highPriority = learningPath.filter(item => item.priority === 'High');
            if (highPriority.length > 0) {
                recommendations.unshift(`Priority focus: ${highPriority.map(item => item.category).join(', ')}`);
            }
        }

        return recommendations.map(rec => `<div class="recommendation-item">• ${rec}</div>`).join('');
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DevSecOpsAnalyzer();
});
