class CertificationPractice {
    constructor() {
        this.currentExam = null;
        this.questions = [];
        this.answers = [];
        this.userId = this.getUserId();
        this.init();
    }

    async init() {
        await this.loadQuestionStats();
        this.bindEvents();
    }

    async loadQuestionStats() {
        try {
            const response = await fetch('/api/questions/stats');
            const data = await response.json();
            
            // Update question counts for each certification
            Object.entries(data.statistics).forEach(([exam, stats]) => {
                const countElement = document.getElementById(`${exam.toLowerCase().replace('-', '-')}-count`);
                if (countElement) {
                    countElement.textContent = `${stats.total} Questions`;
                }
            });
        } catch (error) {
            console.error('Failed to load question stats:', error);
        }
    }

    bindEvents() {
        document.getElementById('startPractice').addEventListener('click', () => this.loadPracticeQuestions());
        document.getElementById('submitPractice').addEventListener('click', () => this.submitPractice());
        document.getElementById('backToCerts').addEventListener('click', () => this.backToCertifications());
    }

    async startCertPractice(examType) {
        this.currentExam = examType;
        document.querySelector('.certification-grid').style.display = 'none';
        document.getElementById('practiceInterface').style.display = 'block';
        
        const examNames = {
            'AWS-SAA': 'AWS Solutions Architect Associate',
            'AWS-Security': 'AWS Security Specialty',
            'CISSP': 'CISSP',
            'CKA': 'Certified Kubernetes Administrator',
            'DevSecOps': 'Tech Professional'
        };
        
        document.getElementById('practiceTitle').textContent = examNames[examType] + ' Practice';
    }

    async loadPracticeQuestions() {
        const difficulty = document.getElementById('difficultySelect').value;
        const count = document.getElementById('questionCount').value;
        
        try {
            const response = await fetch(`/api/questions/${this.currentExam}?count=${count}&difficulty=${difficulty}&userId=${this.userId}`);
            const data = await response.json();
            
            this.questions = data.questions;
            this.renderQuestions();
            
            document.querySelector('.practice-controls').style.display = 'none';
            document.getElementById('submitPractice').style.display = 'block';
        } catch (error) {
            console.error('Failed to load questions:', error);
            alert('Failed to load practice questions. Please try again.');
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
                    <span class="question-number">Question ${index + 1}/${this.questions.length}</span>
                    <span class="difficulty-badge ${q.difficulty}">${q.difficulty}</span>
                    <span class="domain-badge">${q.domain}</span>
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
                <div class="question-explanation" id="explanation_${index}" style="display: none;">
                    <h4>Explanation:</h4>
                    <p>${q.explanation}</p>
                    <p><strong>Source:</strong> ${q.source}</p>
                </div>
            `;
            container.appendChild(questionDiv);
        });
    }

    async submitPractice() {
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
            alert(`Please answer all questions (${unanswered} remaining)`);
            return;
        }

        this.showResults();
    }

    showResults() {
        let score = 0;
        const results = this.questions.map((q, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === q.correct;
            if (isCorrect) score++;
            
            return {
                question: q.question,
                userAnswer: q.options[userAnswer],
                correctAnswer: q.options[q.correct],
                isCorrect,
                explanation: q.explanation,
                domain: q.domain
            };
        });

        const percentage = Math.round((score / this.questions.length) * 100);
        const passed = percentage >= 70;

        // Hide practice interface, show results
        document.getElementById('practiceInterface').style.display = 'none';
        document.getElementById('resultsInterface').style.display = 'block';

        // Render results
        document.getElementById('practiceResults').innerHTML = `
            <div class="score-summary">
                <div class="overall-score ${passed ? 'passed' : 'failed'}">
                    <h2>${percentage}%</h2>
                    <p>${passed ? 'PASSED' : 'NEEDS WORK'}</p>
                </div>
                <div class="score-details">
                    <p><strong>${score}</strong> out of <strong>${this.questions.length}</strong> questions correct</p>
                    <p>Passing score: 70%</p>
                </div>
            </div>

            <div class="domain-breakdown">
                <h3>Performance by Domain</h3>
                ${this.getDomainBreakdown(results)}
            </div>

            <div class="question-review">
                <h3>Question Review</h3>
                ${results.map((result, index) => `
                    <div class="review-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                        <h4>Question ${index + 1}</h4>
                        <p><strong>Q:</strong> ${result.question}</p>
                        <p><strong>Your Answer:</strong> ${result.userAnswer} ${result.isCorrect ? '✅' : '❌'}</p>
                        ${!result.isCorrect ? `<p><strong>Correct Answer:</strong> ${result.correctAnswer}</p>` : ''}
                        <div class="explanation">
                            <strong>Explanation:</strong> ${result.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Save results
        this.saveResults(score, percentage, passed);
    }

    getDomainBreakdown(results) {
        const domains = {};
        results.forEach(result => {
            if (!domains[result.domain]) {
                domains[result.domain] = { correct: 0, total: 0 };
            }
            domains[result.domain].total++;
            if (result.isCorrect) domains[result.domain].correct++;
        });

        return Object.entries(domains).map(([domain, data]) => {
            const percentage = Math.round((data.correct / data.total) * 100);
            return `
                <div class="domain-item">
                    <div class="domain-header">
                        <span class="domain-name">${domain}</span>
                        <span class="domain-score">${data.correct}/${data.total} (${percentage}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${percentage >= 70 ? 'good' : percentage >= 50 ? 'average' : 'poor'}" 
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    saveResults(score, percentage, passed) {
        const result = {
            exam: this.currentExam,
            score,
            total: this.questions.length,
            percentage,
            passed,
            date: new Date().toISOString()
        };

        // Save to localStorage
        const history = JSON.parse(localStorage.getItem('certificationHistory') || '[]');
        history.push(result);
        localStorage.setItem('certificationHistory', JSON.stringify(history));
    }

    retakePractice() {
        document.getElementById('resultsInterface').style.display = 'none';
        document.getElementById('practiceInterface').style.display = 'block';
        document.querySelector('.practice-controls').style.display = 'block';
        document.getElementById('submitPractice').style.display = 'none';
        document.getElementById('questionsContainer').innerHTML = '';
    }

    backToCertifications() {
        document.getElementById('practiceInterface').style.display = 'none';
        document.getElementById('resultsInterface').style.display = 'none';
        document.querySelector('.certification-grid').style.display = 'block';
        
        // Reset interface
        document.querySelector('.practice-controls').style.display = 'block';
        document.getElementById('submitPractice').style.display = 'none';
        document.getElementById('questionsContainer').innerHTML = '';
    }

    getUserId() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user?.id || 'guest_' + Date.now();
    }
}

// Global functions
function startCertPractice(examType) {
    window.certPractice.startCertPractice(examType);
}

function retakePractice() {
    window.certPractice.retakePractice();
}

function backToCertifications() {
    window.certPractice.backToCertifications();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.certPractice = new CertificationPractice();
});

// Add certification-specific styles
const certStyles = `
    .certification-grid {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .cert-category h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.5rem;
    }
    
    .cert-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .cert-card {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 15px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .cert-card:hover {
        border-color: #667eea;
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
    }
    
    .cert-icon {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .cert-stats {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
        font-size: 0.9rem;
    }
    
    .question-count {
        background: #e7f3ff;
        color: #0066cc;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
    }
    
    .difficulty {
        background: #fff3cd;
        color: #856404;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
    }
    
    .practice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .practice-controls {
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .domain-badge {
        background: #f8f9fa;
        color: #495057;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .review-item {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
    }
    
    .review-item.correct {
        border-left: 4px solid #28a745;
    }
    
    .review-item.incorrect {
        border-left: 4px solid #dc3545;
    }
    
    .overall-score.passed {
        background: #d4edda;
        color: #155724;
    }
    
    .overall-score.failed {
        background: #f8d7da;
        color: #721c24;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = certStyles;
document.head.appendChild(styleSheet);
