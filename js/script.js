document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        disable: 'phone'
    });
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
        });
        
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
        
        const touchItems = document.querySelectorAll('.fivem-item, .unity-item, .project-card');
        touchItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-close">&times;</div>
            <div class="modal-content"></div>
        </div>
    `;
    document.body.appendChild(modalContainer);
    
    const modal = modalContainer.querySelector('.modal');
    const modalClose = modalContainer.querySelector('.modal-close');
    const modalContent = modalContainer.querySelector('.modal-content');
    
    function openModal(content) {
        modalContent.innerHTML = content;
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (isMobile) {
            setTimeout(() => {
                modal.scrollTop = 0;
            }, 100);
        }
    }
    
    function closeModal() {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });
    
    const projectItems = document.querySelectorAll('.fivem-item, .unity-item, .project-card');
    
    projectItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const itemClone = item.cloneNode(true);
            itemClone.classList.add('modal-item');
            openModal(itemClone.outerHTML);
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            const formElements = contactForm.elements;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = true;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = 'Message Sent!';
                submitBtn.classList.add('success');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('success');
                    for (let i = 0; i < formElements.length; i++) {
                        formElements[i].disabled = false;
                    }
                }, 3000);
            }, 1500);
        });
    }
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    function setMobileViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setMobileViewportHeight();
    window.addEventListener('resize', setMobileViewportHeight);
});

document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    function animateOnScroll() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

const style = document.createElement('style');
style.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        transform: translateY(20px);
        z-index: 999;
    }
    
    .scroll-top-btn.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item, .project-card, .section-title {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s, transform 0.6s;
    }
    
    .skill-item.animate, .project-card.animate, .section-title.animate {
        opacity: 1;
        transform: translateY(0);
    }

    .image-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 80%;
    }
    
    .modal-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: white;
        font-size: 28px;
        cursor: pointer;
    }

    #dev-notice {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        justify-content: center;
        align-items: center;
        z-index: 1001;
    }
    
    .dev-modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        max-width: 500px;
        width: 90%;
    }
    
    .dev-close, .dev-ok-btn {
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s;
    }
    
    .dev-close:hover, .dev-ok-btn:hover {
        background-color: darken(var(--primary-color), 10%);
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalImage = document.createElement('img');
    modalImage.className = 'modal-image';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    
    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    document.querySelectorAll('.fivem-item-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImage.src = this.src;
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const devModal = document.getElementById('dev-notice');
    const closeBtn = document.querySelector('.dev-close');
    const okBtn = document.querySelector('.dev-ok-btn');
    
    if (!localStorage.getItem('devNoticeShown')) {
        setTimeout(() => {
            devModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }, 800);
    }
    
    function closeModal() {
        devModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        localStorage.setItem('devNoticeShown', 'true');
    }
    
    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === devModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && devModal.style.display === 'flex') {
            closeModal();
        }
    });
});

function copyDiscordTag() {
    const discordTag = document.getElementById('discord-username').textContent;
    navigator.clipboard.writeText(discordTag).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    });
}
