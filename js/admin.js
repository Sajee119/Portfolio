// Admin Dashboard Management
document.addEventListener('DOMContentLoaded', function() {
    if (!window.adminUtils.checkAuth()) return;
    
    initializeAdminSidebar();
    loadDashboardData();
    initializeStatsCards();
    loadRecentActivity();
    updateMessageCount();
    
    // Listen for data updates
    document.addEventListener('portfolioDataUpdated', function() {
        loadDashboardData();
        updateMessageCount();
    });
});

// Initialize admin sidebar
function initializeAdminSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    
    // Desktop sidebar toggle
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Mobile sidebar toggle
    if (mobileSidebarToggle && sidebar) {
        mobileSidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isToggleButton = mobileSidebarToggle && mobileSidebarToggle.contains(e.target);
            
            if (!isClickInsideSidebar && !isToggleButton && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        }
    });
    
    // Update active navigation item
    updateActiveNavItem();
}

// Update active navigation item based on current page
function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page nav item
    const navMapping = {
        'dashboard.html': 'dashboard.html',
        'profile.html': 'profile.html',
        'projects.html': 'projects.html',
        'skills.html': 'skills.html',
        'experience.html': 'experience.html',
        'messages.html': 'messages.html',
        'settings.html': 'settings.html'
    };
    
    const targetPage = navMapping[currentPage];
    if (targetPage) {
        const navLink = document.querySelector(`.nav-item[href="${targetPage}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }
    }
}

// Load dashboard data
function loadDashboardData() {
    if (typeof window.portfolioData === 'undefined') return;
    
    const stats = window.portfolioData.getStats();
    updateStatsDisplay(stats);
}

// Initialize stats cards with animation
function initializeStatsCards() {
    const statsCards = document.querySelectorAll('.stat-card');
    
    // Add intersection observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate the number
                const numberElement = entry.target.querySelector('h3');
                if (numberElement) {
                    animateNumber(numberElement);
                }
            }
        });
    }, { threshold: 0.1 });
    
    statsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Update stats display
function updateStatsDisplay(stats) {
    const projectsCount = document.getElementById('projects-count');
    const skillsCount = document.getElementById('skills-count');
    const messagesCount = document.getElementById('messages-count');
    
    if (projectsCount) projectsCount.textContent = stats.projects;
    if (skillsCount) skillsCount.textContent = stats.skills;
    if (messagesCount) messagesCount.textContent = stats.messages;
}

// Animate number counting
function animateNumber(element) {
    const target = parseInt(element.textContent) || 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.getElementById('activity-list');
    if (!activityContainer || typeof window.portfolioData === 'undefined') return;
    
    const activities = window.portfolioData.getRecentActivities(5);
    
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <p>No recent activity</p>
                    <span class="activity-time">Start using the admin panel to see activity here</span>
                </div>
            </div>
        `;
        return;
    }
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.action}</p>
                <span class="activity-time">${window.portfolioHelpers.formatTimeAgo(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

// Get icon for activity type
function getActivityIcon(type) {
    const icons = {
        'auth': 'fas fa-sign-in-alt',
        'contact': 'fas fa-envelope',
        'project': 'fas fa-folder',
        'profile': 'fas fa-user',
        'skill': 'fas fa-code',
        'system': 'fas fa-cog'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Update message count in sidebar
function updateMessageCount() {
    const messageCountElement = document.getElementById('message-count');
    if (!messageCountElement || typeof window.portfolioData === 'undefined') return;
    
    const unreadCount = window.portfolioData.getUnreadMessageCount();
    messageCountElement.textContent = unreadCount;
    
    if (unreadCount > 0) {
        messageCountElement.style.display = 'inline-block';
    } else {
        messageCountElement.style.display = 'none';
    }
}

// Quick actions functionality
function initializeQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Dashboard utilities
window.dashboardUtils = {
    // Refresh dashboard data
    refreshData() {
        loadDashboardData();
        loadRecentActivity();
        updateMessageCount();
        window.adminUtils.showSuccess('Dashboard data refreshed');
    },
    
    // Add activity log
    addActivity(type, action, details) {
        if (window.portfolioData) {
            window.portfolioData.addActivity({
                type: type,
                action: action,
                details: details
            });
            loadRecentActivity();
        }
    },
    
    // Get dashboard stats
    getStats() {
        if (window.portfolioData) {
            return window.portfolioData.getStats();
        }
        return null;
    },
    
    // Export all data
    exportData() {
        if (!window.portfolioData) {
            window.adminUtils.showError('Portfolio data not available');
            return;
        }
        
        try {
            const data = window.portfolioData.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addActivity('system', 'Data exported', 'Portfolio data exported to JSON file');
            window.adminUtils.showSuccess('Data exported successfully');
        } catch (error) {
            console.error('Export failed:', error);
            window.adminUtils.showError('Failed to export data');
        }
    },
    
    // Import data
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = e.target.result;
                    const success = window.portfolioData.importData(jsonData);
                    
                    if (success) {
                        this.refreshData();
                        window.adminUtils.showSuccess('Data imported successfully');
                    } else {
                        window.adminUtils.showError('Failed to import data - invalid format');
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    window.adminUtils.showError('Failed to import data');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    },
    
    // Clear all data (with confirmation)
    clearAllData() {
        const confirmed = window.adminUtils.confirmAction(
            'Are you sure you want to clear all portfolio data? This action cannot be undone.'
        );
        
        if (confirmed) {
            const doubleConfirmed = window.adminUtils.confirmAction(
                'This will permanently delete all your portfolio data. Are you absolutely sure?'
            );
            
            if (doubleConfirmed) {
                window.portfolioData.clearAllData();
                window.location.reload();
            }
        }
    }
};

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            domContentLoaded: 0,
            resourceLoadTime: 0
        };
        this.init();
    }
    
    init() {
        // Measure page load time
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now();
            this.logMetrics();
        });
        
        // Measure DOM content loaded time
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domContentLoaded = performance.now();
        });
    }
    
    logMetrics() {
        console.log('Performance Metrics:', this.metrics);
        
        // Add performance data to activity log
        if (window.portfolioData) {
            window.portfolioData.addActivity({
                type: 'system',
                action: 'Page performance measured',
                details: `Load time: ${Math.round(this.metrics.pageLoadTime)}ms`
            });
        }
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor;

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Log error to activity
    if (window.portfolioData) {
        window.portfolioData.addActivity({
            type: 'system',
            action: 'JavaScript error occurred',
            details: `${e.error.name}: ${e.error.message}`
        });
    }
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    
    // Log error to activity
    if (window.portfolioData) {
        window.portfolioData.addActivity({
            type: 'system',
            action: 'Promise rejection',
            details: `Unhandled promise rejection: ${e.reason}`
        });
    }
});

// Initialize features when ready
document.addEventListener('DOMContentLoaded', function() {
    initializeQuickActions();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Shift + E to export data
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            window.dashboardUtils.exportData();
        }
        
        // Ctrl/Cmd + Shift + R to refresh dashboard
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            window.dashboardUtils.refreshData();
        }
    });
});

// Auto-refresh data every 5 minutes
setInterval(() => {
    if (document.visibilityState === 'visible') {
        loadRecentActivity();
        updateMessageCount();
    }
}, 5 * 60 * 1000);