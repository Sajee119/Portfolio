// Main JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadPortfolioContent();
    initializeInteractions();
    
    // Listen for data updates
    document.addEventListener('portfolioDataUpdated', function() {
        loadPortfolioContent();
    });
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
}

// Load portfolio content from data
function loadPortfolioContent() {
    if (typeof window.portfolioData === 'undefined') return;
    
    const profile = window.portfolioData.getProfile();
    
    if (profile) {
        updateProfileContent(profile);
        updateSocialLinks(profile);
    }
    
    // Load content based on current page
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            loadHomepageContent();
            break;
        case 'about':
            loadAboutContent();
            break;
        case 'portfolio':
            loadPortfolioPageContent();
            break;
        case 'contact':
            loadContactContent();
            break;
    }
}

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    if (filename === '' || filename === 'index.html') return 'index';
    if (filename === 'about.html') return 'about';
    if (filename === 'portfolio.html') return 'portfolio';
    if (filename === 'contact.html') return 'contact';
    
    return 'index';
}

// Update profile content throughout the site
function updateProfileContent(profile) {
    // Update name elements
    const nameElements = document.querySelectorAll('#hero-name, #about-name, #footer-name, #footer-copyright-name');
    nameElements.forEach(el => {
        if (el) el.textContent = profile.fullName;
    });
    
    // Update title elements
    const titleElements = document.querySelectorAll('#hero-title, #about-title');
    titleElements.forEach(el => {
        if (el) el.textContent = profile.title;
    });
    
    // Update description elements
    const descElements = document.querySelectorAll('#hero-description, #footer-description');
    descElements.forEach(el => {
        if (el) el.textContent = profile.bioShort;
    });
    
    // Update contact information
    updateElementText('#contact-email, #about-email', profile.email);
    updateElementText('#contact-phone, #about-phone', profile.phone);
    updateElementText('#contact-location, #about-location', profile.location);
    
    // Update about page specific content
    updateElementText('#about-description', profile.bioLong);
    
    // Update CV download link
    const cvLink = document.getElementById('download-cv');
    if (cvLink && profile.cvUrl) {
        cvLink.href = profile.cvUrl;
        cvLink.style.display = 'inline-flex';
    } else if (cvLink) {
        cvLink.style.display = 'none';
    }
}

// Update social links
function updateSocialLinks(profile) {
    const socialLinks = {
        '#github-link, #contact-github, #footer-github': profile.github,
        '#linkedin-link, #contact-linkedin, #footer-linkedin': profile.linkedin,
        '#twitter-link, #contact-twitter, #footer-twitter': profile.twitter,
        '#email-link': `mailto:${profile.email}`,
        '#contact-instagram': profile.instagram
    };
    
    for (const [selectors, url] of Object.entries(socialLinks)) {
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            if (el && url) {
                el.href = url;
                el.style.display = 'flex';
            } else if (el) {
                el.style.display = 'none';
            }
        });
    }
}

// Load homepage content
function loadHomepageContent() {
    loadFeaturedProjects();
    loadSkills();
}

// Load featured projects
function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects');
    if (!container) return;
    
    const featuredProjects = window.portfolioData.getFeaturedProjects();
    
    if (featuredProjects.length === 0) {
        container.innerHTML = '<p class="text-center">No featured projects available.</p>';
        return;
    }
    
    container.innerHTML = featuredProjects.map(project => `
        <div class="project-card" onclick="openProjectModal('${project.id}')">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<i class="fas fa-code"></i>'}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${window.portfolioHelpers.getCategoryName(project.category)}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => 
                        `<span class="tech-tag">${tech.trim()}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Load skills for homepage
function loadSkills() {
    const container = document.getElementById('skills-grid');
    if (!container) return;
    
    const skills = window.portfolioData.getSkills();
    
    if (skills.length === 0) {
        container.innerHTML = '<p class="text-center">No skills available.</p>';
        return;
    }
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-item">
            <div class="skill-icon">
                <i class="${skill.icon}"></i>
            </div>
            <h3 class="skill-name">${skill.name}</h3>
            <p class="skill-level">${skill.level}</p>
        </div>
    `).join('');
}

// Load about page content
function loadAboutContent() {
    loadExperience();
    loadEducation();
    loadSkillsCategories();
}

// Load experience timeline
function loadExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;
    
    const experience = window.portfolioData.getExperience();
    
    if (experience.length === 0) {
        container.innerHTML = '<p class="text-center">No experience data available.</p>';
        return;
    }
    
    container.innerHTML = experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-date">
                ${window.portfolioHelpers.formatDate(exp.startDate)} - ${exp.current ? 'Present' : window.portfolioHelpers.formatDate(exp.endDate)}
            </div>
            <h3 class="timeline-title">${exp.title}</h3>
            <p class="timeline-company">${exp.company} • ${exp.location}</p>
            <p>${exp.description}</p>
        </div>
    `).join('');
}

// Load education timeline
function loadEducation() {
    const container = document.getElementById('education-timeline');
    if (!container) return;
    
    const education = window.portfolioData.getEducation();
    
    if (education.length === 0) {
        container.innerHTML = '<p class="text-center">No education data available.</p>';
        return;
    }
    
    container.innerHTML = education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-date">
                ${window.portfolioHelpers.formatDate(edu.startDate)} - ${window.portfolioHelpers.formatDate(edu.endDate)}
            </div>
            <h3 class="timeline-title">${edu.degree}</h3>
            <p class="timeline-company">${edu.institution} • ${edu.location}</p>
            <p>${edu.description}</p>
        </div>
    `).join('');
}

// Load skills categories for about page
function loadSkillsCategories() {
    const container = document.getElementById('skills-categories');
    if (!container) return;
    
    const skills = window.portfolioData.getSkills();
    
    if (skills.length === 0) {
        container.innerHTML = '<p class="text-center">No skills available.</p>';
        return;
    }
    
    // Group skills by level
    const skillsByLevel = skills.reduce((acc, skill) => {
        if (!acc[skill.level]) acc[skill.level] = [];
        acc[skill.level].push(skill);
        return acc;
    }, {});
    
    container.innerHTML = Object.entries(skillsByLevel).map(([level, skillList]) => `
        <div class="skill-category">
            <h3>${level}</h3>
            <div class="skills-grid">
                ${skillList.map(skill => `
                    <div class="skill-item">
                        <div class="skill-icon">
                            <i class="${skill.icon}"></i>
                        </div>
                        <h4 class="skill-name">${skill.name}</h4>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Load portfolio page content
function loadPortfolioPageContent() {
    loadAllProjects();
    initializeProjectFilters();
}

// Load all projects for portfolio page
function loadAllProjects(filterCategory = 'all') {
    const container = document.getElementById('portfolio-grid');
    if (!container) return;
    
    let projects = window.portfolioData.getProjects();
    
    // Filter projects by category
    if (filterCategory !== 'all') {
        projects = projects.filter(project => project.category === filterCategory);
    }
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="text-center">No projects available.</p>';
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}" onclick="openProjectModal('${project.id}')">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<i class="fas fa-code"></i>'}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${window.portfolioHelpers.getCategoryName(project.category)}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => 
                        `<span class="tech-tag">${tech.trim()}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize project filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            const category = this.getAttribute('data-filter');
            loadAllProjects(category);
        });
    });
}

// Load contact page content
function loadContactContent() {
    initializeContactForm();
    initializeFAQ();
}

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const message = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Add message to data
        window.portfolioData.addMessage(message);
        
        // Show success message
        showMessage('form-success');
        form.reset();
        
        // Add activity log
        window.portfolioData.addActivity({
            type: 'contact',
            action: 'New message received',
            details: `From: ${message.name} (${message.email})`
        });
    });
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize other interactions
function initializeInteractions() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize modals
    initializeModals();
}

// Initialize modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking X button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Open project modal
function openProjectModal(projectId) {
    const project = window.portfolioData.getProjectById(projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="project-detail">
            <div class="project-detail-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<div class="image-placeholder"><i class="fas fa-code"></i></div>'}
            </div>
            <div class="project-detail-content">
                <h2>${project.title}</h2>
                <p class="project-category">${window.portfolioHelpers.getCategoryName(project.category)}</p>
                <p class="project-description">${project.details || project.description}</p>
                
                <div class="project-meta">
                    ${project.client ? `<div class="meta-item"><strong>Client:</strong> ${project.client}</div>` : ''}
                    ${project.year ? `<div class="meta-item"><strong>Year:</strong> ${project.year}</div>` : ''}
                    ${project.duration ? `<div class="meta-item"><strong>Duration:</strong> ${project.duration}</div>` : ''}
                </div>
                
                <div class="project-tech">
                    <h4>Technologies Used:</h4>
                    ${project.technologies.split(',').map(tech => 
                        `<span class="tech-tag">${tech.trim()}</span>`
                    ).join('')}
                </div>
                
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank"><i class="fas fa-external-link-alt"></i> View Demo</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> View Code</a>` : ''}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Helper functions
function updateElementText(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (el && text) el.textContent = text;
    });
}

function showMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'flex';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Utility function to animate counters
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Initialize animations when elements come into view
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters if they exist
                const counters = entry.target.querySelectorAll('[data-count]');
                if (counters.length > 0) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.project-card, .skill-item, .timeline-item, .stat-card').forEach(el => {
        observer.observe(el);
    });
}