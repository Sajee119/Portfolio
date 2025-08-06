// Portfolio Data Management
class PortfolioData {
    constructor() {
        this.init();
    }

    init() {
        // Initialize default data if not exists
        if (!this.getProfile()) {
            this.initDefaultData();
        }
    }

    // Profile Data
    getProfile() {
        return JSON.parse(localStorage.getItem('portfolioProfile')) || null;
    }

    setProfile(profile) {
        localStorage.setItem('portfolioProfile', JSON.stringify(profile));
        this.updateWebsite();
    }

    // Projects Data
    getProjects() {
        return JSON.parse(localStorage.getItem('portfolioProjects')) || [];
    }

    setProjects(projects) {
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        this.updateWebsite();
    }

    addProject(project) {
        const projects = this.getProjects();
        project.id = Date.now().toString();
        project.createdAt = new Date().toISOString();
        projects.push(project);
        this.setProjects(projects);
        return project;
    }

    updateProject(id, updatedProject) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updatedProject, id };
            this.setProjects(projects);
            return projects[index];
        }
        return null;
    }

    deleteProject(id) {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(p => p.id !== id);
        this.setProjects(filteredProjects);
    }

    getProjectById(id) {
        const projects = this.getProjects();
        return projects.find(p => p.id === id) || null;
    }

    getFeaturedProjects() {
        const projects = this.getProjects();
        return projects.filter(p => p.featured).slice(0, 3);
    }

    // Skills Data
    getSkills() {
        return JSON.parse(localStorage.getItem('portfolioSkills')) || [];
    }

    setSkills(skills) {
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        this.updateWebsite();
    }

    // Experience Data
    getExperience() {
        return JSON.parse(localStorage.getItem('portfolioExperience')) || [];
    }

    setExperience(experience) {
        localStorage.setItem('portfolioExperience', JSON.stringify(experience));
        this.updateWebsite();
    }

    // Education Data
    getEducation() {
        return JSON.parse(localStorage.getItem('portfolioEducation')) || [];
    }

    setEducation(education) {
        localStorage.setItem('portfolioEducation', JSON.stringify(education));
        this.updateWebsite();
    }

    // Messages Data
    getMessages() {
        return JSON.parse(localStorage.getItem('portfolioMessages')) || [];
    }

    addMessage(message) {
        const messages = this.getMessages();
        message.id = Date.now().toString();
        message.timestamp = new Date().toISOString();
        message.read = false;
        messages.unshift(message);
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        return message;
    }

    markMessageRead(id) {
        const messages = this.getMessages();
        const message = messages.find(m => m.id === id);
        if (message) {
            message.read = true;
            localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        }
    }

    deleteMessage(id) {
        const messages = this.getMessages();
        const filteredMessages = messages.filter(m => m.id !== id);
        localStorage.setItem('portfolioMessages', JSON.stringify(filteredMessages));
    }

    getUnreadMessageCount() {
        const messages = this.getMessages();
        return messages.filter(m => !m.read).length;
    }

    // Activity Log
    addActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('portfolioActivities')) || [];
        activity.id = Date.now().toString();
        activity.timestamp = new Date().toISOString();
        activities.unshift(activity);
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        localStorage.setItem('portfolioActivities', JSON.stringify(activities));
    }

    getRecentActivities(limit = 10) {
        const activities = JSON.parse(localStorage.getItem('portfolioActivities')) || [];
        return activities.slice(0, limit);
    }

    // Statistics
    getStats() {
        return {
            projects: this.getProjects().length,
            skills: this.getSkills().length,
            messages: this.getMessages().length,
            unreadMessages: this.getUnreadMessageCount()
        };
    }

    // Update website content
    updateWebsite() {
        // This method will be called whenever data changes
        // Other scripts can listen for data changes
        document.dispatchEvent(new CustomEvent('portfolioDataUpdated'));
    }

    // Initialize default data
    initDefaultData() {
        const defaultProfile = {
            fullName: "John Doe",
            title: "Full Stack Developer",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            location: "New York, USA",
            website: "https://johndoe.dev",
            bioShort: "Passionate about creating beautiful and functional web experiences. I specialize in modern web technologies and love turning ideas into reality.",
            bioLong: "I'm a passionate full-stack developer with over 5 years of experience creating beautiful and functional web applications. I love combining creative design with robust functionality to deliver exceptional user experiences.",
            github: "https://github.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
            twitter: "https://twitter.com/johndoe",
            instagram: "https://instagram.com/johndoe",
            profileImage: "",
            heroImage: "",
            cvUrl: ""
        };

        const defaultProjects = [
            {
                id: "1",
                title: "E-Commerce Platform",
                category: "fullstack",
                description: "A modern e-commerce platform built with React and Node.js",
                details: "Full-featured e-commerce solution with user authentication, payment processing, inventory management, and admin dashboard. Built with React, Node.js, Express, and MongoDB.",
                technologies: "React, Node.js, Express, MongoDB, Stripe",
                client: "Tech Startup",
                year: 2024,
                duration: "4 months",
                demoUrl: "https://demo-ecommerce.com",
                githubUrl: "https://github.com/johndoe/ecommerce",
                image: "",
                featured: true,
                createdAt: new Date().toISOString()
            },
            {
                id: "2",
                title: "Task Management App",
                category: "frontend",
                description: "A responsive task management application with drag-and-drop functionality",
                details: "Intuitive task management app with features like drag-and-drop task organization, team collaboration, deadline tracking, and real-time notifications.",
                technologies: "React, TypeScript, CSS3, Socket.io",
                client: "Freelance",
                year: 2024,
                duration: "2 months",
                demoUrl: "https://demo-taskapp.com",
                githubUrl: "https://github.com/johndoe/taskapp",
                image: "",
                featured: true,
                createdAt: new Date().toISOString()
            },
            {
                id: "3",
                title: "Weather Dashboard",
                category: "web",
                description: "A beautiful weather dashboard with interactive charts and forecasts",
                details: "Comprehensive weather dashboard featuring current conditions, 7-day forecasts, interactive maps, and data visualization with charts and graphs.",
                technologies: "JavaScript, Chart.js, Weather API, CSS3",
                client: "Personal Project",
                year: 2023,
                duration: "1 month",
                demoUrl: "https://demo-weather.com",
                githubUrl: "https://github.com/johndoe/weather",
                image: "",
                featured: true,
                createdAt: new Date().toISOString()
            }
        ];

        const defaultSkills = [
            { name: "JavaScript", level: "Expert", icon: "fab fa-js" },
            { name: "React", level: "Expert", icon: "fab fa-react" },
            { name: "Node.js", level: "Advanced", icon: "fab fa-node-js" },
            { name: "Python", level: "Intermediate", icon: "fab fa-python" },
            { name: "HTML/CSS", level: "Expert", icon: "fab fa-html5" },
            { name: "MongoDB", level: "Advanced", icon: "fas fa-database" },
            { name: "Git", level: "Advanced", icon: "fab fa-git-alt" },
            { name: "Docker", level: "Intermediate", icon: "fab fa-docker" }
        ];

        const defaultExperience = [
            {
                id: "1",
                title: "Senior Full Stack Developer",
                company: "Tech Solutions Inc.",
                location: "New York, NY",
                startDate: "2022-01",
                endDate: null,
                current: true,
                description: "Lead development of web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices."
            },
            {
                id: "2",
                title: "Full Stack Developer",
                company: "Digital Agency Co.",
                location: "Boston, MA",
                startDate: "2020-06",
                endDate: "2021-12",
                current: false,
                description: "Developed responsive web applications and e-commerce solutions. Collaborated with design team to implement pixel-perfect interfaces."
            },
            {
                id: "3",
                title: "Frontend Developer",
                company: "StartupXYZ",
                location: "San Francisco, CA",
                startDate: "2019-03",
                endDate: "2020-05",
                current: false,
                description: "Built modern frontend applications with React and Vue.js. Optimized application performance and implemented responsive designs."
            }
        ];

        const defaultEducation = [
            {
                id: "1",
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Technology",
                location: "Boston, MA",
                startDate: "2015-09",
                endDate: "2019-05",
                description: "Focused on software engineering, algorithms, and web technologies. Graduated Magna Cum Laude."
            },
            {
                id: "2",
                degree: "Full Stack Web Development Bootcamp",
                institution: "Code Academy",
                location: "Online",
                startDate: "2018-06",
                endDate: "2018-12",
                description: "Intensive 6-month program covering modern web development technologies including React, Node.js, and database management."
            }
        ];

        // Set default data
        this.setProfile(defaultProfile);
        this.setProjects(defaultProjects);
        this.setSkills(defaultSkills);
        this.setExperience(defaultExperience);
        this.setEducation(defaultEducation);

        // Add initial activity
        this.addActivity({
            type: "system",
            action: "Portfolio initialized with default data",
            details: "Default profile, projects, and skills have been set up"
        });
    }

    // Import/Export functionality
    exportData() {
        const data = {
            profile: this.getProfile(),
            projects: this.getProjects(),
            skills: this.getSkills(),
            experience: this.getExperience(),
            education: this.getEducation(),
            messages: this.getMessages(),
            activities: this.getRecentActivities(100),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.profile) this.setProfile(data.profile);
            if (data.projects) this.setProjects(data.projects);
            if (data.skills) this.setSkills(data.skills);
            if (data.experience) this.setExperience(data.experience);
            if (data.education) this.setEducation(data.education);
            if (data.messages) {
                localStorage.setItem('portfolioMessages', JSON.stringify(data.messages));
            }
            
            this.addActivity({
                type: "system",
                action: "Data imported",
                details: "Portfolio data has been imported successfully"
            });
            
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem('portfolioProfile');
        localStorage.removeItem('portfolioProjects');
        localStorage.removeItem('portfolioSkills');
        localStorage.removeItem('portfolioExperience');
        localStorage.removeItem('portfolioEducation');
        localStorage.removeItem('portfolioMessages');
        localStorage.removeItem('portfolioActivities');
    }
}

// Create global instance
window.portfolioData = new PortfolioData();

// Helper functions for formatting
window.portfolioHelpers = {
    formatDate(dateString) {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    },

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString();
    },

    slugify(text) {
        return text.toLowerCase()
                  .replace(/[^\w ]+/g, '')
                  .replace(/ +/g, '-');
    },

    truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    getCategoryColor(category) {
        const colors = {
            'web': '#3498db',
            'mobile': '#2ecc71',
            'frontend': '#e74c3c',
            'backend': '#9b59b6',
            'fullstack': '#f39c12',
            'ui-ux': '#1abc9c'
        };
        return colors[category] || '#95a5a6';
    },

    getCategoryName(category) {
        const names = {
            'web': 'Web Design',
            'mobile': 'Mobile Apps',
            'frontend': 'Frontend',
            'backend': 'Backend',
            'fullstack': 'Full Stack',
            'ui-ux': 'UI/UX Design'
        };
        return names[category] || category;
    }
};