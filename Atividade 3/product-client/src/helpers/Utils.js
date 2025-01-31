export function login(userName, password) {
    localStorage.setItem('username', userName.trim());
    localStorage.setItem('password', password.trim());
}

export function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
}

export function getUser() {
    const username = localStorage.getItem('username');
    return username === 'null' ? null : username;
}

export function getPassword() {
    const password = localStorage.getItem('password');
    return password === 'null' ? null : password;
}