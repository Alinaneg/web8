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
    selectedTariffInfo.style.display = 'block';
    
    tariffNameInput.value = name;
    tariffPriceInput.value = price;
    }
    

    tariffCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-tariff') || e.target.closest('.btn-tariff')) {
                return;
            }
            
            selectTariff(this);
        });
    });
    

    tariffButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.tariff-card');
            selectTariff(card);
            setTimeout(() => {
                document.getElementById('form').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    });
    
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
    
    const form = document.getElementById('supportForm');
    const formMessage = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            fetch('https://formcarry.com/s/STVF7PqkDUr', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showMessage('Спасибо! Ваша заявка отправлена успешно. Мы свяжемся с вами в ближайшее время.', 'success');
                    form.reset();
                    selectedTariffInfo.style.display = 'none';
                    tariffCards.forEach(c => c.classList.remove('selected'));
                } else {
                    showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const agree = document.getElementById('agree');
    
    // Сбрасываем предыдущие ошибки
    [name, email, phone].forEach(field => {
        field.style.borderColor = '';
    });
    
    if (!name.value.trim()) {
        showMessage('Пожалуйста, введите ваше имя.', 'error');
        name.style.borderColor = '#ff4444';
        name.focus();
        return false;
    }
    
    if (!email.value.trim()) {
        showMessage('Пожалуйста, введите ваш email.', 'error');
        email.style.borderColor = '#ff4444';
        email.focus();
        return false;
    }
    
    if (!validateEmail(email.value)) {
        showMessage('Пожалуйста, введите корректный email адрес.', 'error');
        email.style.borderColor = '#ff4444';
        email.focus();
        return false;
    }
    
    if (!phone.value.trim()) {
        showMessage('Пожалуйста, введите ваш телефон.', 'error');
        phone.style.borderColor = '#ff4444';
        phone.focus();
        return false;
    }
    
    if (!validatePhone(phone.value)) {
        showMessage('Введите номер в формате: +79991234567 (от 10 до 15 цифр после +)', 'error');
        phone.style.borderColor = '#ff4444';
        phone.focus();
        return false;
    }
    
    if (!agree.checked) {
        showMessage('Пожалуйста, согласитесь на обработку персональных данных.', 'error');
        agree.style.outline = '2px solid #ff4444';
        agree.focus();
        return false;
    }
    
    return true;
}

function validatePhone(phone) {
    // Удаляем все пробелы в начале проверки
    const cleanPhone = phone.trim();
    
    // Проверяем: начинается с +, потом ТОЛЬКО цифры, от 10 до 15 цифр
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(cleanPhone);
}
        
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
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