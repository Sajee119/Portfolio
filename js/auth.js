// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.initializeLoginForm();
        this.initializeLogoutButtons();
        this.checkPageAccess();
    }

    // Check for existing session
    checkExistingSession() {
        const session = localStorage.getItem('portfolioAdminSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                
                if (now - sessionData.timestamp < this.sessionTimeout) {
                    this.currentUser = sessionData.user;
                    this.updateSessionTimestamp();
                    return true;
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        }
        return false;
    }

    // Initialize login form
    initializeLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        // Password toggle functionality
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // Handle form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        // Auto-fill demo credentials for testing
        const usernameInput = document.getElementById('username');
        const passwordInputField = document.getElementById('password');
        
        if (usernameInput && passwordInputField) {
            // Pre-fill for demo purposes
            usernameInput.value = 'admin';
            passwordInputField.value = 'admin123';
        }
    }

    // Handle login attempt
    async handleLogin(event) {
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Simple authentication - in real app, this would be server-side
        if (this.validateCredentials(username, password)) {
            const user = {
                username: username,
                role: 'admin',
                loginTime: new Date().toISOString()
            };

            this.createSession(user, remember);
            this.redirectToDashboard();
            
            // Add activity log
            if (window.portfolioData) {
                window.portfolioData.addActivity({
                    type: 'auth',
                    action: 'Admin login',
                    details: `User ${username} logged in`
                });
            }
        } else {
            this.showLoginError();
        }
    }

    // Validate credentials
    validateCredentials(username, password) {
        // Demo credentials - in real app, validate against server
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'demo', password: 'demo123' }
        ];

        return validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
    }

    // Create user session
    createSession(user, remember) {
        this.currentUser = user;
        
        const sessionData = {
            user: user,
            timestamp: new Date().getTime(),
            remember: remember
        };

        if (remember) {
            // Store in localStorage for persistent session
            localStorage.setItem('portfolioAdminSession', JSON.stringify(sessionData));
        } else {
            // Store in sessionStorage for session-only
            sessionStorage.setItem('portfolioAdminSession', JSON.stringify(sessionData));
        }
    }

    // Update session timestamp
    updateSessionTimestamp() {
        const session = localStorage.getItem('portfolioAdminSession') || 
                      sessionStorage.getItem('portfolioAdminSession');
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                sessionData.timestamp = new Date().getTime();
                
                if (sessionData.remember) {
                    localStorage.setItem('portfolioAdminSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('portfolioAdminSession', JSON.stringify(sessionData));
                }
            } catch (error) {
                console.error('Error updating session:', error);
            }
        }
    }

    // Redirect to dashboard
    redirectToDashboard() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    // Show login error
    showLoginError() {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.style.display = 'flex';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    // Initialize logout buttons
    initializeLogoutButtons() {
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.logout();
            });
        });
    }

    // Logout user
    logout() {
        if (this.currentUser && window.portfolioData) {
            window.portfolioData.addActivity({
                type: 'auth',
                action: 'Admin logout',
                details: `User ${this.currentUser.username} logged out`
            });
        }

        this.currentUser = null;
        localStorage.removeItem('portfolioAdminSession');
        sessionStorage.removeItem('portfolioAdminSession');
        
        // Redirect to login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    // Check if user has access to current page
    checkPageAccess() {
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.includes('/admin/') && !currentPath.includes('login.html');
        
        if (isAdminPage && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        
        if (currentPath.includes('login.html') && this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return false;
        }
        
        return true;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Require authentication
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Require specific role
    requireRole(role) {
        if (!this.hasRole(role)) {
            this.logout();
            return false;
        }
        return true;
    }

    // Update user display
    updateUserDisplay() {
        if (!this.currentUser) return;

        const usernameElements = document.querySelectorAll('#admin-username');
        usernameElements.forEach(el => {
            if (el) el.textContent = this.currentUser.username;
        });
    }

    // Session activity tracking
    trackActivity() {
        if (!this.isAuthenticated()) return;

        // Update session timestamp on user activity
        let activityTimeout;
        const updateActivity = () => {
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                this.updateSessionTimestamp();
            }, 1000);
        };

        // Track various user activities
        document.addEventListener('click', updateActivity);
        document.addEventListener('keypress', updateActivity);
        document.addEventListener('scroll', updateActivity);
    }

    // Auto logout on inactivity
    setupAutoLogout(inactivityTime = 30 * 60 * 1000) { // 30 minutes default
        let inactivityTimer;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.logout();
                alert('You have been logged out due to inactivity.');
            }, inactivityTime);
        };

        // Reset timer on activity
        document.addEventListener('click', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('scroll', resetTimer);
        document.addEventListener('mousemove', resetTimer);

        // Initial timer setup
        resetTimer();
    }

    // Change password functionality
    changePassword(currentPassword, newPassword) {
        // In a real app, this would validate current password and update on server
        if (this.validateCredentials(this.currentUser.username, currentPassword)) {
            // Simulate password change
            console.log('Password changed successfully');
            
            if (window.portfolioData) {
                window.portfolioData.addActivity({
                    type: 'auth',
                    action: 'Password changed',
                    details: `User ${this.currentUser.username} changed password`
                });
            }
            
            return true;
        }
        return false;
    }

    // Password strength validator
    validatePasswordStrength(password) {
        const requirements = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;
        
        return {
            score: score,
            requirements: requirements,
            isStrong: score >= 4
        };
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Make it globally available
window.authManager = authManager;

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Update user display
    authManager.updateUserDisplay();
    
    // Track activity for session management
    authManager.trackActivity();
    
    // Setup auto logout (optional - uncomment to enable)
    // authManager.setupAutoLogout();
    
    // Add session warning before expiry
    setupSessionWarning();
});

// Session warning system
function setupSessionWarning() {
    if (!authManager.isAuthenticated()) return;
    
    const warningTime = 5 * 60 * 1000; // 5 minutes before expiry
    
    setInterval(() => {
        const session = localStorage.getItem('portfolioAdminSession') || 
                      sessionStorage.getItem('portfolioAdminSession');
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                const timeLeft = authManager.sessionTimeout - (now - sessionData.timestamp);
                
                if (timeLeft > 0 && timeLeft <= warningTime) {
                    showSessionWarning(Math.floor(timeLeft / 60000)); // minutes left
                }
            } catch (error) {
                console.error('Error checking session expiry:', error);
            }
        }
    }, 60000); // Check every minute
}

// Show session warning
function showSessionWarning(minutesLeft) {
    const shouldExtend = confirm(
        `Your session will expire in ${minutesLeft} minute(s). ` +
        'Do you want to extend your session?'
    );
    
    if (shouldExtend) {
        authManager.updateSessionTimestamp();
    }
}

// Utility functions for admin pages
window.adminUtils = {
    // Check authentication before performing admin actions
    checkAuth() {
        return authManager.requireAuth();
    },
    
    // Get current user info
    getCurrentUser() {
        return authManager.getCurrentUser();
    },
    
    // Logout user
    logout() {
        authManager.logout();
    },
    
    // Show success message
    showSuccess(message) {
        const successElement = document.getElementById('success-message');
        if (successElement) {
            successElement.style.display = 'flex';
            const messageSpan = successElement.querySelector('span');
            if (messageSpan) messageSpan.textContent = message;
            
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 3000);
        }
    },
    
    // Show error message
    showError(message) {
        alert(message); // Simple implementation - could be enhanced with custom modal
    },
    
    // Confirm action
    confirmAction(message) {
        return confirm(message);
    }
};