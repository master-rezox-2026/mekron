const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";

function getAuthCredentials() {
    const stored = localStorage.getItem('mekron_admin_creds');
    if (stored) {
        return JSON.parse(stored);
    }
    return { username: DEFAULT_USER, password: DEFAULT_PASS };
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('login-username').value.trim();
        const passInput = document.getElementById('login-password').value.trim();
        const creds = getAuthCredentials();
        const errorAlert = document.getElementById('error-alert');

        if (userInput === creds.username && passInput === creds.password) {
            sessionStorage.setItem('mekron_admin_logged_in', 'true');
            sessionStorage.setItem('mekron_admin_user', userInput);
            window.location.href = 'admin.html';
        } else {
            errorAlert.classList.remove('hidden');
        }
    });
}

function logoutAdmin() {
    sessionStorage.removeItem('mekron_admin_logged_in');
    window.location.href = 'login.html';
}

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('mekron_admin_logged_in');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}