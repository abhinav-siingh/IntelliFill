// Initialize Icons
lucide.createIcons();

// --- POPUP CONTROLLER ---
function openPopup(id) {
    const modal = document.getElementById('modal-' + id);
    modal.classList.add('active');
    lucide.createIcons(); // Re-initialize icons in modal
    handleAction(`Opening ${id.toUpperCase()}`);
}

function closePopup(id) {
    const modal = document.getElementById('modal-' + id);
    modal.classList.remove('active');
}

// --- CONTACT FORM LOGIC ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('msgSubject').value;
        const message = document.getElementById('senderMsg').value;
        const mailtoLink = `mailto:abhinavsinghchandel8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        handleAction("Opening Email Client...");
        setTimeout(() => {
            window.location.href = mailtoLink;
            closePopup('contact');
        }, 800);
    });
}

// --- TOAST NOTIFICATION ---
function handleAction(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = "bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold mb-3 border border-white/20 flex items-center gap-3";
    toast.innerHTML = `<i data-lucide="bell" class="w-5 h-5"></i> ${msg}`;
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Animated Counters on Scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.querySelector('.counter')) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(c => animateCounter(c));
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.card-reveal').forEach(el => observer.observe(el));

function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    let current = 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        current = progress * target;
        el.innerText = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Simple logic to oscillate the "Time Saved" number to make it look live
let baseTime = 420;
setInterval(() => {
    const display = document.getElementById('time-saved-display');
    if (display) {
        const fluctuation = Math.floor(Math.random() * 5);
        display.innerText = (baseTime + fluctuation).toLocaleString();
    }
}, 3000);


