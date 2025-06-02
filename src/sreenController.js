import logofile from './images/logo.png';
import taskAddIconSrc from './images/task-add.svg';
import agendaIconSrc from './images/agenda.svg';
import todayIconSrc from './images/task-today.svg';
import calendarIconSrc from './images/task-all.svg';
import hashIconSrc from './images/hash.svg';
import slidersIconSrc from './images/sliders.svg';
import closeIconSrc from './images/x-circle.svg';

const wrapper = document.querySelector('#wrapper');


export function renderAuthScreen() {
    wrapper.innerHTML = '';

    const welcomeSection = document.createElement('section');
    welcomeSection.setAttribute('id', 'welcome-section');

    const logo = new Image();
    logo.setAttribute('id', 'logo');
    logo.src = logofile;
    welcomeSection.appendChild(logo);

    const welcomeText = document.createElement('p');
    welcomeText.setAttribute('id', 'welcome-text');
    welcomeText.textContent = 'Welcome to Mdj-Do!';
    welcomeSection.appendChild(welcomeText);

    const welcomeSubText = document.createElement('p');
    welcomeSubText.setAttribute('id', 'welcome-subtext');
    welcomeSubText.textContent = 'Please enter your username below:';
    welcomeSection.appendChild(welcomeSubText);

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('id', 'username');
    welcomeSection.appendChild(usernameInput);

    const loginButton = document.createElement('button');
    loginButton.setAttribute('id', 'login-button');
    loginButton.textContent = 'Login';
    welcomeSection.appendChild(loginButton);

    const disclaimer = document.createElement('p');
    disclaimer.setAttribute('id', 'disclaimer');
    disclaimer.textContent = 'Note: Currently user info and tasks are stored locally on your computer. You cannot access your data from a different device. Currently designed for desktop use only.';
    welcomeSection.appendChild(disclaimer);

    wrapper.appendChild(welcomeSection);
}

export function renderDashboard() {
    wrapper.innerHTML = '';
    const container = document.createElement('div');
    container.classList.add('container');

    container.appendChild(renderAside());
    container.appendChild(renderHeader());
    container.appendChild(renderNewTaskDialog());

    const taskViewDialog = document.createElement('dialog');
    taskViewDialog.setAttribute('id', 'task-view');
    container.appendChild(taskViewDialog);

    const dataArea = document.createElement('div');
    dataArea.classList.add('data-area');
    container.appendChild(dataArea);

    wrapper.appendChild(container);
}

function renderAside() {
    const aside = document.createElement('aside');

    aside.appendChild(renderUserInfo());
    aside.appendChild(renderMenu());
    aside.appendChild(renderNav());

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.setAttribute('id', 'logout');
    li.textContent = 'Logout';
    ul.appendChild(li);
    aside.appendChild(ul);
    return aside;
}

function renderUserInfo() {
    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userPfp = document.createElement('p');
    userPfp.setAttribute('id', 'user-pfp');
    userPfp.setAttribute('data-letters', '');
    userInfo.appendChild(userPfp);

    const userNameDisplay = document.createElement('p');
    userNameDisplay.classList.add('user-name-display');
    userInfo.appendChild(userNameDisplay);
    return userInfo;
}

function renderMenu() {
    const menu = document.createElement('menu');
    const ul = document.createElement('ul');

    const taskAdd = document.createElement('li');
    taskAdd.setAttribute('id', 'task-add');
    const taskAddIcon = new Image;
    taskAddIcon.setAttribute('id', 'task-add-icon');
    taskAddIcon.setAttribute('alt', 'Add Task Icon');
    taskAddIcon.src = taskAddIconSrc;
    const taskAddPara = document.createElement('p');
    taskAddPara.textContent = 'Add Task';
    taskAdd.appendChild(taskAddIcon);
    taskAdd.appendChild(taskAddPara);

    const agenda = document.createElement('li');
    agenda.setAttribute('id', 'agenda');
    const agendaIcon = new Image;
    agendaIcon.setAttribute('alt', 'Agenda Icon');
    agendaIcon.src = agendaIconSrc;
    const agendaPara = document.createElement('p');
    agendaPara.textContent = 'Agenda';
    agenda.appendChild(agendaIcon);
    agenda.appendChild(agendaPara);

    const today = document.createElement('li');
    today.setAttribute('id', 'today');
    const todayIcon = new Image;
    todayIcon.setAttribute('alt', 'Today Icon');
    todayIcon.src = todayIconSrc;
    const todayPara = document.createElement('p');
    todayPara.textContent = 'Today';
    today.appendChild(todayIcon);
    today.appendChild(todayPara);

    const calendar = document.createElement('li');
    calendar.setAttribute('id', 'calendar');
    const calendarIcon = new Image;
    calendarIcon.setAttribute('alt', 'View All Icon');
    calendarIcon.src = calendarIconSrc;
    const calendarPara = document.createElement('p');
    calendarPara.textContent = 'Calendar';
    calendar.appendChild(calendarIcon);
    calendar.appendChild(calendarPara);

    ul.appendChild(taskAdd);
    ul.appendChild(agenda);
    ul.appendChild(today);
    ul.appendChild(calendar);
    
    menu.appendChild(ul);

    return menu;
}

function renderNav() {
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'cat-ul');

    const allCategories = document.createElement('li');
    allCategories.setAttribute('id', 'all-cat');
    const hashIcon = new Image;
    hashIcon.src = hashIconSrc;
    const allCatPara = document.createElement('p');
    allCatPara.textContent = 'All Categories';
    allCategories.appendChild(hashIcon);
    allCategories.appendChild(allCatPara);

    ul.appendChild(allCategories);
    nav.appendChild(ul);

    return nav;
}

function renderHeader() {
    const header = document.createElement('header');

    const toggleView = document.createElement('div');
    toggleView.classList.add('toggle-view');
    const slidersIcon = new Image;
    slidersIcon.setAttribute('alt', 'Change View Icon');
    slidersIcon.src = slidersIconSrc;
    const toggleViewPara = document.createElement('p');
    toggleViewPara.textContent = 'View';
    toggleView.appendChild(slidersIcon);
    toggleView.appendChild(toggleViewPara);

    header.appendChild(toggleView);
    return header;
}

function renderNewTaskDialog() {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('id', 'new-task');

    const form = document.createElement('form');
    form.setAttribute('id', 'new-task-form');

    const closeIcon = new Image;
    closeIcon.classList.add('close');
    closeIcon.setAttribute('alt', 'Close dialog button');
    closeIcon.src = closeIconSrc;
    form.appendChild(closeIcon);

    const legend = document.createElement('legend');
    legend.textContent = "What's on your mind?";
    form.appendChild(legend);

    const inputTitleField = document.createElement('div');
    inputTitleField.setAttribute('id', 'input-title-field');
    const newTitle = document.createElement('input');
    newTitle.setAttribute('type', 'text');
    newTitle.setAttribute('name', 'new-title');
    newTitle.setAttribute('id', 'new-title');
    newTitle.setAttribute('placeholder', 'Title');
    const small = document.createElement('small');
    inputTitleField.appendChild(newTitle);
    inputTitleField.appendChild(small);
    form.appendChild(inputTitleField);

    const inputDescField = document.createElement('div');
    const newDescription = document.createElement('input');
    newDescription.setAttribute('type', 'text');
    newDescription.setAttribute('name', 'new-description');
    newDescription.setAttribute('id', 'new-description');
    newDescription.setAttribute('placeholder', 'Description');
    inputDescField.appendChild(newDescription);
    form.appendChild(inputDescField);

    const inputCatField = document.createElement('div');
    const newCategories = document.createElement('input');
    newCategories.setAttribute('type', 'text');
    newCategories.setAttribute('name', 'new-categories');
    newCategories.setAttribute('id', 'new-categories');
    newCategories.setAttribute('placeholder', "Categories (e.g. 'category1, category2, ...')");
    inputCatField.appendChild(newCategories);
    form.appendChild(inputCatField);

    const inputDateField = document.createElement('div');
    const label = document.createElement('label');
    label.setAttribute('for', 'new-date');
    label.textContent = 'Due date:';
    const newDate = document.createElement('input');
    newDate.setAttribute('type', 'date');
    newDate.setAttribute('name', 'new-date');
    newDate.setAttribute('id', 'new-date');
    inputDateField.appendChild(label);
    inputDateField.appendChild(newDate);
    form.appendChild(inputDateField);

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', 'Add task');
    submit.setAttribute('id', 'submit-task');
    form.appendChild(submit);

    dialog.appendChild(form);
    return dialog;
}

