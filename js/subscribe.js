document.addEventListener('DOMContentLoaded', function() {
    const subscribeForm = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('subscribe-email');
    const subscribeBtn = document.getElementById('subscribe-btn');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email', 'error');
                return;
            }
            
            subscribeBtn.disabled = true;
            subscribeBtn.textContent = 'Subscribing...';
            
            const formData = new FormData();
            formData.append('email', email);
            
            fetch('backend/subscribe.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    subscribeForm.reset();
                } else {
                    showMessage(data.message || 'Subscription failed', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Failed to subscribe. Please try again.', 'error');
            })
            .finally(() => {
                subscribeBtn.disabled = false;
                subscribeBtn.textContent = 'Subscribe';
            });
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const form = document.getElementById('subscribe-form');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form.nextSibling);
        }
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
});
