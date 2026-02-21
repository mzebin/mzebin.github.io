// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    });
});

// Enhanced active section detection with smoother transitions
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to current section's link
            const activeId = entry.target.id;
            const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Carousel
const carousel = document.querySelector('.projects-carousel');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectCards = document.querySelectorAll('.project-card');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let cardWidth = 0; // Will be calculated dynamically

// Function to update dots based on current index
function updateDots() {
    if (!dotsContainer) return;
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Function to scroll to a specific card
function scrollToCard(index) {
    if (!carousel || index < 0 || index >= projectCards.length) return;
    const card = projectCards[index];
    carousel.scrollTo({
        left: card.offsetLeft - carousel.offsetLeft,
        behavior: 'smooth'
    });
    currentIndex = index;
    updateDots();
}

// Build dots based on number of cards
if (dotsContainer && projectCards.length > 0) {
    projectCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => scrollToCard(index));
        dotsContainer.appendChild(dot);
    });
    updateDots();
}

// Previous button click
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            scrollToCard(currentIndex - 1);
        } else {
            // Optionally loop to last card
            scrollToCard(projectCards.length - 1);
        }
    });
}

// Next button click
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < projectCards.length - 1) {
            scrollToCard(currentIndex + 1);
        } else {
            // Optionally loop to first card
            scrollToCard(0);
        }
    });
}

// Update active dot based on scroll position (when user drags manually)
if (carousel) {
    carousel.addEventListener('scroll', () => {
        // Find the card that is most visible
        const scrollPosition = carousel.scrollLeft;
        let closestIndex = 0;
        let smallestDiff = Infinity;

        projectCards.forEach((card, index) => {
            const cardLeft = card.offsetLeft - carousel.offsetLeft;
            const diff = Math.abs(cardLeft - scrollPosition);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestIndex = index;
            }
        });

        if (closestIndex !== currentIndex) {
            currentIndex = closestIndex;
            updateDots();
        }
    });
}
