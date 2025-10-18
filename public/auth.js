class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthState();
    }

    bindEvents() {
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Guest access button
        const guestBtn = document.querySelector('.auth-btn.secondary');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => this.continueAsGuest());
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        // Validate passwords match
        if (userData.password !== userData.confirmPassword) {
            this.showAlert('Passwords do not match', 'error');
            return;
        }

        // Validate password strength
        if (userData.password.length < 8) {
            this.showAlert('Password must be at least 8 characters long', 'error');
            return;
        }

        // Check terms acceptance
        if (!userData.terms) {
            this.showAlert('Please accept the Terms of Service', 'error');
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showAlert('Account created successfully! Please check your email.', 'success');
                localStorage.setItem('user', JSON.stringify(result.user));
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                this.showAlert(result.message || 'Signup failed', 'error');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'error');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showAlert('Login successful!', 'success');
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', result.token);
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showAlert(result.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'error');
        }
    }

    continueAsGuest() {
        localStorage.setItem('guestMode', 'true');
        window.location.href = 'index.html';
    }

    checkAuthState() {
        const user = localStorage.getItem('user');
        const currentPage = window.location.pathname;
        
        if (user && (currentPage.includes('login.html') || currentPage.includes('signup.html'))) {
            window.location.href = 'dashboard.html';
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add alert styles dynamically
const alertStyles = `
    .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
    }
    
    .alert-success { background: #28a745; }
    .alert-error { background: #dc3545; }
    .alert-info { background: #17a2b8; }
    .alert-warning { background: #ffc107; color: #212529; }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = alertStyles;
document.head.appendChild(styleSheet);
