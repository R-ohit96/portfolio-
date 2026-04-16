// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
}));

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations (Intersection Observer)
const faders = document.querySelectorAll('.section-title, .about-text, .terminal-widget, .skill-category, .project-card, .contact-info, .contact-form');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    fader.classList.add('fade-in');
    appearOnScroll.observe(fader);
});

// Matrix Background & Particle Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Grid Scanner System
const gridPoints = [];
const spacing = 35; // Space between dots
let mouse = {
    x: null,
    y: null,
    radius: 180 // Scanning radius
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class GridPoint {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = 1.2;
        this.color = 'rgba(69, 162, 158, 0.1)'; // Default dim color
        this.targetColor = this.color;
    }

    update() {
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.baseX;
            let dy = mouse.y - this.baseY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Glow effect intensity based on proximity
                const force = (mouse.radius - distance) / mouse.radius;
                this.x = this.baseX + (dx / distance) * force * 10; // Parallax shift
                this.y = this.baseY + (dy / distance) * force * 10;
                this.color = `rgba(102, 252, 241, ${0.1 + force * 0.7})`; // Fade to bright
                this.size = 1.2 + force * 1.5;
            } else {
                // Smoothly return to base state
                this.x += (this.baseX - this.x) * 0.1;
                this.y += (this.baseY - this.y) * 0.1;
                this.color = 'rgba(69, 162, 158, 0.15)';
                this.size = 1.2;
            }
        } else {
            this.x += (this.baseX - this.x) * 0.1;
            this.y += (this.baseY - this.y) * 0.1;
            this.color = 'rgba(69, 162, 158, 0.15)';
            this.size = 1.2;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initGrid() {
    gridPoints.length = 0;
    for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
            gridPoints.push(new GridPoint(x, y));
        }
    }
}

function drawScene() {
    ctx.fillStyle = '#0b0c10'; // Solid clear for the scanner look
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Matrix drops (Extremely Subtle Background)
    ctx.fillStyle = 'rgba(69, 162, 158, 0.05)';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    // Draw Grid Points
    for (let i = 0; i < gridPoints.length; i++) {
        gridPoints[i].update();
        gridPoints[i].draw();

        // Optional: Short connection lines only inside the scanner radius
        if (mouse.x !== null && mouse.y !== null) {
            // This is computationally expensive for every pair, 
            // so we only draw lines if we find another point close by AND inside the radius
            // For better performance, we'll skip lines for this specific "cleaner" look
        }
    }
    requestAnimationFrame(drawScene);
}

initGrid();
drawScene();

// Handle window resize for canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGrid();
});

// --- EmailJS Integration ---
// 1. Initialize EmailJS
// NOTE: Insert your actual EmailJS Public Key here (find it in EmailJS Account -> API keys)
emailjs.init("Qc3LXXvXaydVIkWU8");

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Transmitting...'; // Hacker theme touch

        // 2. Send the Form
        // NOTE: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your real IDs from EmailJS Dashboard
        emailjs.sendForm('service_osgi1hr', 'template_h6leooc', this)
            .then(() => {
                alert('Transmission Successful! Message delivered to target.');
                contactForm.reset();
            }, (error) => {
                console.error("EmailJS Error:", error);
                alert('Transmission Failed! Handshake error. Please check configuration.');
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
            });
    });
}
