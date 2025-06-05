import logofile from './images/logo.png';
import taskAddIconSrc from './images/task-add.svg';
import agendaIconSrc from './images/agenda.svg';
import todayIconSrc from './images/task-today.svg';
import calendarIconSrc from './images/task-all.svg';
import hashIconSrc from './images/hash.svg';
import slidersIconSrc from './images/sliders.svg';
import closeIconSrc from './images/x-circle.svg';
import { catLoader, loadToday, menuSelector } from './index.js';
import { format } from 'date-fns';

const wrapper = document.querySelector('#wrapper');


export function renderAuthScreen(loginFunction) {
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
    loginButton.addEventListener('click', (e) => {loginFunction()});

    const disclaimer = document.createElement('p');
    disclaimer.setAttribute('id', 'disclaimer');
    disclaimer.textContent = 'Note: Currently user info and tasks are stored locally on your computer. You cannot access your data from a different device. Currently designed for desktop use only.';
    welcomeSection.appendChild(disclaimer);

    wrapper.appendChild(welcomeSection);
}

export function renderDashboard(userData, section) {
    wrapper.innerHTML = '';
    const container = document.createElement('div');
    container.classList.add('container');

    container.appendChild(renderAside(userData));
    container.appendChild(renderHeader());
    container.appendChild(renderNewTaskDialog());

    const taskViewDialog = document.createElement('dialog');
    taskViewDialog.setAttribute('id', 'task-view');
    container.appendChild(taskViewDialog);

    const dataArea = document.createElement('div');
    dataArea.classList.add('data-area');

    wrapper.appendChild(container);
    container.appendChild(renderDataArea(dataArea, section, userData.tasks));
    navigationHandler(dataArea);
    renderCategories(catLoader(userData.tasks));

  
}

function renderAside(userData) {
    const aside = document.createElement('aside');

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userPfp = document.createElement('p');
    userPfp.setAttribute('id', 'user-pfp');
    userPfp.setAttribute('data-letters', userData.username.charAt(0));
    userInfo.appendChild(userPfp);

    const userNameDisplay = document.createElement('p');
    userNameDisplay.classList.add('user-name-display');
    userNameDisplay.textContent = userData.username;
    userInfo.appendChild(userNameDisplay);
    aside.appendChild(userInfo);

    const menu = document.createElement('menu');
    const menuUl = document.createElement('ul');

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
    agenda.classList.add('active-menu-item');
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

    menuUl.appendChild(taskAdd);
    menuUl.appendChild(agenda);
    menuUl.appendChild(today);
    menuUl.appendChild(calendar);
    
    menu.appendChild(menuUl);
    
    

    aside.appendChild(menu);

    const nav = document.createElement('nav');
    const navUl = document.createElement('ul');
    navUl.setAttribute('id', 'cat-ul');

    const allCategories = document.createElement('li');
    allCategories.setAttribute('id', 'cat-all');
    const hashIcon = new Image;
    hashIcon.src = hashIconSrc;
    const allCatPara = document.createElement('p');
    allCatPara.textContent = 'All Categories';
    allCategories.appendChild(hashIcon);
    allCategories.appendChild(allCatPara);

    navUl.appendChild(allCategories);
    nav.appendChild(navUl);

    aside.appendChild(nav);

    const logoutUl = document.createElement('ul');
    const li = document.createElement('li');
    li.setAttribute('id', 'logout');
    li.textContent = 'Logout';
    logoutUl.appendChild(li);
    aside.appendChild(logoutUl);

    return aside;
}

function navigationHandler(dataArea) {
    const menu = document.querySelector('menu');
    const lis = menu.querySelectorAll('li');
    let currentSection;
    for (let i = 0; i < lis.length ; i++) {
        if (lis[i].classList.contains('active-menu-item')) {
            currentSection = lis[i].id;
        }
    }
    const aside = document.querySelector('aside')
    aside.addEventListener("click", (e) => {
        let activeData = menuSelector(e);
        if (activeData) {
            renderCategories(catLoader(activeData.unfilteredSectionData));
            renderDataArea(dataArea, activeData.activeId, activeData.activeData);
            resetActiveMenuItems(activeData.activeId, currentSection, activeData.activeCategory);
        }
    });
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

function renderTasks(dataArea, userTasks) {


    if (userTasks.length === 0) {
        let task = document.createElement('div');
        task.classList.add('task');

        let taskDescription = document.createElement('p');
        taskDescription.classList.add('task-description');
        taskDescription.textContent = 'All clear!';
        task.appendChild(taskDescription);
        dataArea.appendChild(task);
    }

    for (let currentTask of userTasks) {
        renderSingleTask(dataArea, currentTask, currentTask.id);
    }
    return dataArea;
}

function renderSingleTask(container, currentTask, taskID) {
    let task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('id', `task-${taskID}`);

    let taskTitle = document.createElement('h3');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = currentTask.title;
    task.appendChild(taskTitle);

    let taskDescription = document.createElement('p');
    taskDescription.classList.add('task-description');
    taskDescription.textContent = currentTask.description;
    task.appendChild(taskDescription);

    const categories = document.createElement('div');
    categories.classList.add('task-categories');
    
    for (let category of currentTask.categories) {
        let span = document.createElement('span');
        span.classList.add('task-category');

        // Add delete button on active task only
        const link = document.createElement('a');
        link.addEventListener('click', e => task.id === 'task-active-task' ? removeCategory(task, currentTask, category) : console.log('Task open'));
        link.textContent = ' x';
        span.textContent = '#' + category;
        if (task.id === 'task-active-task') { span.appendChild(link); }

        categories.appendChild(span);
    }
    // Add + button for adding categories
    const addButton = document.createElement('span');
    addButton.classList.add('task-category-add-button');
    addButton.textContent = '+';
    if (task.id === 'task-active-task') {categories.appendChild(addButton);}

    task.appendChild(categories);

    let dueDate = document.createElement('div');
    dueDate.classList.add('due-date');
    dueDate.textContent = currentTask.duedate;
    task.appendChild(dueDate);

    container.appendChild(task);
}

function renderDataArea(dataArea, section, userTasks) {
    dataArea.innerHTML = '';

    const heading = document.createElement('h2');
    heading.setAttribute('id', section);
    heading.classList.add('heading');
    heading.textContent = section;
    dataArea.appendChild(heading);

    if (section === "calendar") {
        renderCalendar(userTasks);
    } else {
        const article = document.createElement('article');
        article.classList.add('list-view');
        renderTasks(article, userTasks);
        dataArea.appendChild(article);
    }

    return dataArea;
}

function resetActiveMenuItems(item, section, selectedCategory = 'cat-all') {
    document.getElementById('agenda').classList.remove('active-menu-item');
    document.getElementById('today').classList.remove('active-menu-item');
    document.getElementById('calendar').classList.remove('active-menu-item');
    
    document.getElementById(item).classList.add('active-menu-item');

    const nav = document.getElementById('cat-ul');
    const categories = nav.querySelectorAll('li');
    for (let category of categories) {
        category.classList.remove('active-menu-item');
    }

    document.getElementById(selectedCategory).classList.add('active-menu-item');
}

function renderCalendar(userTasks) {
    
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const day = document.querySelector(".calendar-dates");

    const currdate = document
        .querySelector(".calendar-current-date");

    const dataArea = document.querySelector('.data-area');
    const container = document.createElement('div');
    container.classList.add('calendar-container');
    dataArea.appendChild(container);

    // Array of month names
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Function to generate the calendar
    const manipulate = () => {

        // Get the first day of the month
        let dayone = new Date(year, month, 0).getDay();

        // Get the last date of the month
        let lastdate = new Date(year, month + 1, 0).getDate();

        // Get the day of the last date of the month
        let dayend = new Date(year, month, lastdate).getDay();

        // Get the last date of the previous month
        let monthlastdate = new Date(year, month, 0).getDate();

        
        // Loop to add the last dates of the previous month
        for (let i = dayone; i > 0; i--) {
            const li = document.createElement('div');
            li.classList.add('inactive');
            const p = document.createElement('p');
            p.textContent = monthlastdate - i + 1;
            li.appendChild(p);

            // Load day's tasks
            renderTasks(li, userTasks.filter((task) => task.duedate === format(new Date(year, month - 1, monthlastdate - i + 1), "yyy-MM-dd")));

            container.appendChild(li);
      }


        // Loop to add the dates of the current month
        for (let i = 1; i <= lastdate; i++) {

            // Check if the current date is today
            let isToday = i === date.getDate()
                && month === new Date().getMonth()
                && year === new Date().getFullYear()
                ? "active"
                : "idle";

                const li = document.createElement('div');
                li.classList.add(isToday);
                const p = document.createElement('p');
                p.textContent = i;
                li.appendChild(p);

                // Load day's tasks
                renderTasks(li, userTasks.filter((task) => task.duedate === format(new Date(year, month, i), "yyy-MM-dd")));

                container.appendChild(li);
        }

        // Loop to add the first dates of the next month
        for (let i = dayend; i < 6; i++) {

            const li = document.createElement('div');
            li.classList.add('inactive');
            const p = document.createElement('p');
            p.textContent = i - dayend + 1;
            li.appendChild(p);

            // Load day's tasks
            renderTasks(li, userTasks.filter((task) => task.duedate === format(new Date(year, month + 1, i - dayend + 1), "yyy-MM-dd")));

            container.appendChild(li);
        }

        const tasks = document.querySelectorAll('.task');
        for (let task of tasks) {
            task.classList.add('task-calendar');
        }

    }

manipulate();

}

function renderCategories(catList) {
    const catUl = document.getElementById('cat-ul');
    catUl.innerHTML ='';
    const allCatLi = document.createElement('li');
    allCatLi.setAttribute('id', 'cat-all');
    let img = new Image();
    img.src = hashIconSrc;
    const allCatP  = document.createElement('p');
        allCatP.textContent = 'All Categories';
        allCatLi.appendChild(img);
        allCatLi.appendChild(allCatP);
        catUl.appendChild(allCatLi);
    for (let item of catList) {
        let itemId = 'cat-' + item.toLowerCase();
        const li = document.createElement('li');
        li.setAttribute('id', itemId);
        img = new Image();
        img.src = hashIconSrc;
        const p  = document.createElement('p');
        p.textContent = item;
        li.appendChild(img);
        li.appendChild(p);
        catUl.appendChild(li);
    }
    console.log("renderCategories Run!!");
}