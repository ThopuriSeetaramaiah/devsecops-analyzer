class ProFeatures {
    constructor() {
        this.userId = this.getUserId();
        this.sessionId = this.generateSessionId();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadAnalytics();
        this.checkSubscription();
    }

    bindEvents() {
        document.getElementById('generateQuestions').addEventListener('click', () => this.generateAIQuestions());
        document.getElementById('loadTrending').addEventListener('click', () => this.loadTrendingQuestions());
        document.getElementById('startUnlimitedPractice').addEventListener('click', () => this.startUnlimitedPractice());
    }

    async checkSubscription() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.subscription !== 'pro') {
            this.showUpgradePrompt();
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`/api/pro/analytics/${this.userId}`, {
                headers: { 'session-id': this.sessionId }
            });
            
            if (response.status === 403) {
                this.showUpgradePrompt();
                return;
            }

            const data = await response.json();
            this.displayAnalytics(data);
        } catch (error) {
            console.error('Analytics loading failed:', error);
        }
    }

    displayAnalytics(data) {
        // Display industry benchmarking
        if (data.benchmarks) {
            document.getElementById('industryPercentile').textContent = 
                `${data.benchmarks.industry_percentile?.overall || 75}th percentile`;
            document.getElementById('peerComparison').textContent = 
                'Above average';
        }

        // Display predictions
        if (data.predictions) {
            const certSuccess = Math.round((data.predictions.certification_success_probability || 0.8) * 100);
            const interviewSuccess = Math.round((data.predictions.job_interview_readiness || 0.75) * 100);
            
            document.getElementById('certPrediction').style.width = `${certSuccess}%`;
            document.getElementById('interviewPrediction').style.width = `${interviewSuccess}%`;
        }

        // Track analytics view
        this.trackBehavior('analytics_viewed', { timestamp: new Date() });
    }

    async generateAIQuestions() {
        const focusAreas = Array.from(document.getElementById('focusAreas').selectedOptions)
            .map(option => option.value);
        const difficulty = document.getElementById('difficulty').value;

        if (focusAreas.length === 0) {
            alert('Please select at least one focus area');
            return;
        }

        try {
            const response = await fetch('/api/pro/questions/generate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'session-id': this.sessionId
                },
                body: JSON.stringify({
                    userId: this.userId,
                    weakAreas: focusAreas,
                    difficulty: difficulty,
                    count: 5
                })
            });

            if (response.status === 403) {
                this.showUpgradePrompt();
                return;
            }

            const data = await response.json();
            this.displayQuestions(data.questions, 'aiQuestions');
            
            // Track question generation
            this.trackBehavior('ai_questions_generated', {
                focusAreas,
                difficulty,
                count: data.questions.length
            });
        } catch (error) {
            console.error('AI question generation failed:', error);
            this.showError('Failed to generate AI questions. Please try again.');
        }
    }

    async loadTrendingQuestions() {
        try {
            const response = await fetch('/api/pro/questions/trending');
            const data = await response.json();
            
            this.displayQuestions(data.questions, 'trendingQuestions');
            this.trackBehavior('trending_questions_loaded', { count: data.questions.length });
        } catch (error) {
            console.error('Trending questions loading failed:', error);
        }
    }

    async startUnlimitedPractice() {
        try {
            const response = await fetch(`/api/pro/practice/unlimited/${this.userId}`, {
                headers: { 'session-id': this.sessionId }
            });

            if (response.status === 403) {
                this.showUpgradePrompt();
                return;
            }

            const data = await response.json();
            
            // Redirect to practice mode with unlimited questions
            localStorage.setItem('unlimitedPractice', JSON.stringify(data));
            window.location.href = 'main.html#unlimited-practice';
        } catch (error) {
            console.error('Unlimited practice failed:', error);
        }
    }

    displayQuestions(questions, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'ai-question-card';
            questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="tech-badge">${q.technology_focus || 'DevSecOps'}</span>
                    <span class="difficulty-badge ${q.difficulty_level}">${q.difficulty_level || 'intermediate'}</span>
                </div>
                <h4>${q.question}</h4>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <label class="option-label">
                            <input type="radio" name="ai_q${index}" value="${i}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="question-actions">
                    <button onclick="this.showExplanation(${index})" class="btn-explanation">Show Explanation</button>
                </div>
                <div class="explanation" id="explanation_${index}" style="display: none;">
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                    <p><strong>Correct Answer:</strong> ${q.options[q.correct_answer_index]}</p>
                </div>
            `;
            container.appendChild(questionDiv);
        });
    }

    showExplanation(index) {
        const explanation = document.getElementById(`explanation_${index}`);
        explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
    }

    async trackBehavior(action, data) {
        try {
            await fetch('/api/pro/track', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'session-id': this.sessionId
                },
                body: JSON.stringify({
                    userId: this.userId,
                    action: action,
                    data: data
                })
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    }

    showUpgradePrompt() {
        const overlay = document.createElement('div');
        overlay.className = 'upgrade-overlay';
        overlay.innerHTML = `
            <div class="upgrade-modal">
                <h2>🚀 Upgrade to Pro</h2>
                <p>Unlock advanced analytics, AI-generated questions, and unlimited practice</p>
                <div class="upgrade-features">
                    <div class="feature">✅ Advanced Analytics Dashboard</div>
                    <div class="feature">✅ AI-Generated Personalized Questions</div>
                    <div class="feature">✅ Industry Benchmarking</div>
                    <div class="feature">✅ Unlimited Practice Mode</div>
                    <div class="feature">✅ Predictive Career Insights</div>
                </div>
                <div class="upgrade-actions">
                    <button onclick="this.upgradeToPro()" class="btn-upgrade">Upgrade to Pro - $29/month</button>
                    <button onclick="this.closeUpgradeModal()" class="btn-close">Maybe Later</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    async upgradeToPro() {
        try {
            const response = await fetch('/api/subscription/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    plan: 'pro'
                })
            });

            const result = await response.json();
            
            // Update local user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.subscription = 'pro';
            localStorage.setItem('user', JSON.stringify(user));
            
            this.closeUpgradeModal();
            location.reload();
        } catch (error) {
            console.error('Upgrade failed:', error);
        }
    }

    closeUpgradeModal() {
        const overlay = document.querySelector('.upgrade-overlay');
        if (overlay) overlay.remove();
    }

    getUserId() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id || 'guest_' + Date.now();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'error-alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 5000);
    }
}

// Initialize Pro Features
document.addEventListener('DOMContentLoaded', () => {
    new ProFeatures();
});

// Add Pro-specific styles
const proStyles = `
    .ai-question-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .question-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }
    
    .tech-badge, .difficulty-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .tech-badge {
        background: #e7f3ff;
        color: #0066cc;
    }
    
    .difficulty-badge.beginner { background: #d4edda; color: #155724; }
    .difficulty-badge.intermediate { background: #fff3cd; color: #856404; }
    .difficulty-badge.advanced { background: #f8d7da; color: #721c24; }
    .difficulty-badge.expert { background: #d1ecf1; color: #0c5460; }
    
    .upgrade-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .upgrade-modal {
        background: white;
        border-radius: 15px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
    }
    
    .upgrade-features {
        margin: 20px 0;
        text-align: left;
    }
    
    .feature {
        padding: 8px 0;
        color: #28a745;
    }
    
    .btn-upgrade {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        margin: 10px;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = proStyles;
document.head.appendChild(styleSheet);
