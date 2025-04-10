// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    header.classList.toggle('menu-open');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        header.classList.remove('menu-open');
    });
});

// Header scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
        // Scrolling down
        header.classList.add('scrolled');
    } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
        // Scrolling up
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
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

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in-section.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add typing effect to hero section
const heroText = document.querySelector('.hero p');
if (heroText) {
    const text = heroText.textContent;
    heroText.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    typeWriter();
}

// Particle Animation
class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        this.radius = Math.random() * 2;
        this.color = '#06B6D4'; // Cyan color matching your theme
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Bounce off edges
        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        // Draw connections
        particles.forEach(particle => {
            const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
            if (distance < 100) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(6, 182, 212, ${1 - distance / 100})`; // Fade based on distance
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
            }
        });

        this.draw();
    }
}

// Initialize canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function createParticles() {
    const particleCount = Math.min(50, (canvas.width * canvas.height) / 20000);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => particle.update());
    animationFrameId = requestAnimationFrame(animate);
}

// Handle window resize
function handleResize() {
    initCanvas();
    createParticles();
}

// Initialize animation
window.addEventListener('load', () => {
    initCanvas();
    createParticles();
    animate();
});

window.addEventListener('resize', handleResize);

// Mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: 100
};

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

    particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            particle.velocity.x -= Math.cos(angle) * force * 0.5;
            particle.velocity.y -= Math.sin(angle) * force * 0.5;
        }
    });
});

// Email copying functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailLink = document.getElementById('emailLink');
    const emailNotification = document.getElementById('emailNotification');

    emailLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = this.getAttribute('data-email');
        
        // Copy email to clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Show notification
            emailNotification.style.display = 'block';
            setTimeout(() => {
                emailNotification.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
        });
    });
}); 