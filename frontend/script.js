document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    let casesSwiper = null;
    
    function initSwiper() {
        if (document.querySelector('.cases-swiper')) {
            casesSwiper = new Swiper('.cases-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 1, 
                        spaceBetween: 30,
                    }
                },
                on: {
                    init: function () {
                        console.log('Слайдер инициализирован');
                    }
                }
            });
            
            function updateNavigationVisibility() {
                const prevBtn = document.querySelector('.swiper-button-prev');
                const nextBtn = document.querySelector('.swiper-button-next');
                
                if (window.innerWidth < 768) {
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                } else {
                    if (prevBtn) prevBtn.style.display = 'flex';
                    if (nextBtn) nextBtn.style.display = 'flex';
                }
            }
            
            updateNavigationVisibility();
            window.addEventListener('resize', updateNavigationVisibility);
        }
    }
    if (typeof Swiper !== 'undefined') {
        initSwiper();
    } else {
        console.warn('Библиотека Swiper не загружена');
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const hasSubmenu = this.nextElementSibling && 
                              this.nextElementSibling.classList.contains('mobile-submenu');
            
            if (hasSubmenu) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const isActive = submenu.classList.contains('active');
                document.querySelectorAll('.mobile-submenu.active').forEach(activeSubmenu => {
                    if (activeSubmenu !== submenu) {
                        activeSubmenu.classList.remove('active');
                        const icon = activeSubmenu.previousElementSibling.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                });

                submenu.classList.toggle('active');
                const icon = this.querySelector('i');
                if (icon) {
                    if (isActive) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    } else {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            }
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            document.querySelectorAll('.mobile-submenu.active').forEach(submenu => {
                submenu.classList.remove('active');
                const icon = submenu.previousElementSibling.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        }
    });

    const tariffCards = document.querySelectorAll('.tariff-card');
    const tariffButtons = document.querySelectorAll('.btn-tariff');
    const selectedTariffInfo = document.getElementById('selectedTariffInfo');
    const selectedTariffName = document.getElementById('selectedTariffName');
    const selectedTariffPrice = document.getElementById('selectedTariffPrice');
    const tariffNameInput = document.getElementById('tariffName');
    const tariffPriceInput = document.getElementById('tariffPrice');
    
    function selectTariff(card) {
        tariffCards.forEach(c => {
            c.classList.remove('selected');
            const checkmark = c.querySelector('.tariff-checkmark');
            if (checkmark) checkmark.remove();
        });
        card.classList.add('selected');
        const checkmark = document.createElement('div');
        checkmark.className = 'tariff-checkmark';
        checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
        card.querySelector('.tariff-header').appendChild(checkmark);
        const name = card.querySelector('h3').textContent;
        const price = card.querySelector('.tariff-price').textContent;
        
        selectedTariffName.textContent = name;
        selectedTariffPrice.textContent = price;
        if (selectedTariffInfo) selectedTariffInfo.style.display = 'block';
        
        if (tariffNameInput) tariffNameInput.value = name;
        if (tariffPriceInput) tariffPriceInput.value = price;
    }
    
    if (tariffCards.length) {
        tariffCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn-tariff') || e.target.closest('.btn-tariff')) {
                    return;
                }
                selectTariff(this);
            });
        });
    }
    
    if (tariffButtons.length) {
        tariffButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.tariff-card');
                selectTariff(card);
                setTimeout(() => {
                    const formSection = document.getElementById('form');
                    if (formSection) {
                        formSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            });
        });
    }
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
    
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            alert('Чат скоро будет доступен!');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .advantage-card, .tariff-card, .team-member, .quick-order-card').forEach(el => {
        observer.observe(el);
    });
    
    setTimeout(() => {
        const businessTariff = document.querySelector('.tariff-card[data-tariff="business"]');
        if (businessTariff) {
            selectTariff(businessTariff);
        }
    }, 1000);
});
