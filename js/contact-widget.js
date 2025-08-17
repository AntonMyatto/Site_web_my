// Contact Widget with Multi-language Support
class ContactWidget {
    constructor() {
        this.isOpen = false;
        this.currentLang = this.detectLanguage();
        this.translations = {
            en: {
                title: "Contact Us",
                name: "Name",
                surname: "Surname", 
                text: "Message",
                selecth: "Service Type",
                submit: "Send Message",
                close: "×",
                namePlaceholder: "Enter your name",
                surnamePlaceholder: "Enter your surname",
                textPlaceholder: "Enter your message",
                selecthPlaceholder: "Choose service type",
                successMessage: "Message sent successfully!",
                errorMessage: "Error sending message. Please try again.",
                loading: "Sending...",
                required: "This field is required"
            },
            ru: {
                title: "Связаться со мною",
                name: "Имя",
                surname: "Фамилия",
                text: "Сообщение", 
                selecth: "Тип услуги",
                submit: "Отправить сообщение",
                close: "×",
                namePlaceholder: "Введите ваше имя",
                surnamePlaceholder: "Введите вашу фамилию",
                textPlaceholder: "Введите ваше сообщение",
                selecthPlaceholder: "Выберите тип услуги",
                successMessage: "Сообщение отправлено успешно!",
                errorMessage: "Ошибка отправки сообщения. Попробуйте еще раз.",
                loading: "Отправка...",
                required: "Это поле обязательно для заполнения"
            }
        };
        
        this.init();
    }

    detectLanguage() {
        if (window.location.pathname.includes('/ru/')) {
            return 'ru';
        }
        return 'en';
    }

    getBackendPath() {
        if (this.currentLang === 'ru') {
            return '../backend/mail.php';
        }
        return 'backend/mail.php';
    }

    init() {
        this.createWidget();
        this.bindEvents();
    }

    createWidget() {
        const widgetHTML = `
            <div class="contact-widget">
                <button class="widget-toggle" id="widgetToggle">
                    <i class="fas fa-comments"></i>
                </button>
                <div class="widget-container" id="widgetContainer">
                    <div class="widget-header">
                        <h3 class="widget-title">${this.translations[this.currentLang].title}</h3>
                        <button class="widget-close" id="widgetClose">${this.translations[this.currentLang].close}</button>
                    </div>
                    <form id="contactForm">
                        <div class="form-group">
                            <label for="name">${this.translations[this.currentLang].name} *</label>
                            <input type="text" class="form-control" id="name" name="name" 
                                   placeholder="${this.translations[this.currentLang].namePlaceholder}" required>
                        </div>
                        <div class="form-group">
                            <label for="surname">${this.translations[this.currentLang].surname} *</label>
                            <input type="text" class="form-control" id="surname" name="surname" 
                                   placeholder="${this.translations[this.currentLang].surnamePlaceholder}" required>
                        </div>
                        <div class="form-group">
                            <label for="selecth">${this.translations[this.currentLang].selecth}</label>
                            <select class="form-control" id="selecth" name="selecth">
                                <option value="">${this.translations[this.currentLang].selecthPlaceholder}</option>
                                <option value="web-development">Web Development</option>
                                <option value="web-design">Web Design</option>
                                <option value="consultation">Consultation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="text">${this.translations[this.currentLang].text} *</label>
                            <textarea class="form-control" id="text" name="text" 
                                      placeholder="${this.translations[this.currentLang].textPlaceholder}" required></textarea>
                        </div>
                        <button type="submit" class="btn-submit" id="submitBtn">
                            ${this.translations[this.currentLang].submit}
                        </button>
                    </form>
                    <div class="success-message" id="successMessage"></div>
                    <div class="error-message" id="errorMessage"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('widgetToggle');
        const close = document.getElementById('widgetClose');
        const form = document.getElementById('contactForm');

        toggle.addEventListener('click', () => this.toggleWidget());
        close.addEventListener('click', () => this.closeWidget());
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.contact-widget')) {
                this.closeWidget();
            }
        });
    }

    toggleWidget() {
        if (this.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        const container = document.getElementById('widgetContainer');
        container.classList.add('show');
        this.isOpen = true;
    }

    closeWidget() {
        const container = document.getElementById('widgetContainer');
        container.classList.remove('show');
        this.isOpen = false;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMessage');
        const errorMsg = document.getElementById('errorMessage');

        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        if (!this.validateForm(form)) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = this.translations[this.currentLang].loading;

        try {
            const formData = new FormData(form);
            const response = await fetch(this.getBackendPath(), {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showMessage(successMsg, this.translations[this.currentLang].successMessage);
                form.reset();
                setTimeout(() => this.closeWidget(), 2000);
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage(errorMsg, this.translations[this.currentLang].errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = this.translations[this.currentLang].submit;
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#e1e5e9';
            }
        });

        return isValid;
    }

    showMessage(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactWidget();
});
