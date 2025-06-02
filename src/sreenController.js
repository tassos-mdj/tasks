import logofile from './images/logo.png';
const wrapper = document.querySelector('#wrapper');


export function renderAuthScreen() {
    wrapper.innerHTML = '';

    const welcomeSection = document.createElement('section');
    welcomeSection.setAttribute('id', 'welcome-section');

    const logo = new Image();
    logo.setAttribute('id', 'logo');
    logo.src = logofile;

    const welcomeText = document.createElement('p');
    welcomeText.setAttribute('id', 'welcome-text');
    welcomeText.textContent = 'Welcome to Mdj-Do!\nPlease enter your username below:';

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('id', 'username');

    const loginButton = document.createElement('button');
    loginButton.setAttribute('id', 'login-button');
    loginButton.textContent = 'Login';

    const disclaimer = document.createElement('p');
    disclaimer.setAttribute('id', 'disclaimer');
    disclaimer.textContent = 'Note: Currently user info and tasks are stored locally on your computer. You cannot access your data from a different device. Currently designed for desktop use only.';

    welcomeSection.appendChild(logo);
    welcomeSection.appendChild(welcomeText);
    welcomeSection.appendChild(usernameInput);
    welcomeSection.appendChild(loginButton);
    welcomeSection.appendChild(disclaimer);

    wrapper.appendChild(welcomeSection);
}