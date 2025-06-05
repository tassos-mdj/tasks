import { style } from "./style.css";
import { renderAuthScreen, renderDashboard } from "./sreenController.js";
import { index } from "./staticContent.js";
import { updateIndex } from "./storageController.js";
import { format } from "date-fns";
import { User } from "./user.js";
import { Task } from "./task.js";

const currentDate = format(new Date(), "yyyy-MM-dd");
let currentIndex = index; // || updateIndex();
let userData;
let activeUser;
let section = 'agenda';

function login() {
    const usernameInput = document.querySelector('#username');
    activeUser = usernameInput.value; //.toLowerCase();
    loadDashboard(activeUser, section);
}

function loadDashboard(activeUser) {
    //find user
    userData = currentIndex.reduce((final, entry) => {
        if (entry.username === activeUser){
            final = entry;
            
        }  
            return final;
        } , {})
    
    //check if user exists to load dashboard. If not add user & load dashboard
    if (Object.keys(userData).length === 0) {
        let addUser = new User(activeUser);
        currentIndex.push(addUser);
        console.log(currentIndex);
        // updateIndex(currentIndex);
        console.log('Login check: new user added');
        loadDashboard(activeUser);
    } else {
        // loadAgenda(userData.tasks);
        renderDashboard(userData, 'agenda');
        // displayCategories(catLoader(userData.tasks));
        document.getElementById('cat-all').classList.add('active-menu-item');
        console.log('Login check: loading dashboard');
    }
}

export function menuSelector(e) {
    let selection = e.srcElement.id || e.srcElement.parentNode.id;

    const menuItems = ['agenda', 'today', 'calendar'];
    let currentSection;

     
        for (let i = 0; i < menuItems.length; i++) {
            if (document.getElementById(menuItems[i]).classList.contains('active-menu-item')) {
                currentSection = menuItems[i];
            }
        }
    

    if (selection === 'task-add') {
        taskAdd();
    } else {
        if (selection === 'logout') {
            renderAuthScreen(login);
        } else {
            if (!userData.tasks) {
                window.alert("Nothing here! Try adding some tasks first!");
                return;
            }
            return menuItems.includes(selection) ? tasksLoader(userData.tasks, selection, 'cat-all') : tasksLoader(userData.tasks, currentSection, selection);
        }
    }
}

function tasksLoader(tasks, section, rawFilter) {
    let filter = rawFilter.slice(4);
    let activeTasks;
    let unfilteredSectionData;
    switch (section) {
        case 'agenda':
            filter === 'all' ? activeTasks = loadAgenda(tasks) : activeTasks = loadAgenda(catFilter(tasks, filter));
            unfilteredSectionData = loadAgenda(tasks);
            break;
        case 'today':
            filter === 'all' ? activeTasks = loadToday(tasks) : activeTasks = loadToday(catFilter(tasks, filter));
            unfilteredSectionData = loadToday(tasks);
            break;
        case 'calendar':
            filter === 'all' ? activeTasks = tasks : activeTasks = catFilter(tasks, filter);
            unfilteredSectionData = tasks;
            break;
    }
return {'activeId': section, 'activeData': activeTasks, 'activeCategory': rawFilter, 'unfilteredSectionData': unfilteredSectionData};
}

//Sort tasks for agenda
function loadAgenda(tasks) {
    return tasks.sort((a,b) => new Date(a.duedate) - new Date(b.duedate));
}

//Filter today's tasks
function loadToday(tasks) {
    return tasks.filter((task) => task.duedate === currentDate);
}

//Retrieve user task categories from all tasks
export function catLoader(tasks) {
    let catList = [];

    if (tasks) {
        for (let task of tasks) {
            for (let category of task.categories) {
                if (!catList.includes(category)) {
                    catList.push(category);
                }
            }
        }
    }
    return catList;
}

function catFilter(tasks, id) {
    let filteredTasksList = [];
    for (let task of tasks) {
        if (task.categories.includes(id)) {
             filteredTasksList.push(task);
        }
    }
    return filteredTasksList;
}

function taskAdd() {
    const newTask = document.querySelector('#new-task');
    newTask.showModal();
    let form = document.getElementById('new-task-form');
    const formDefault = form;
    const dateField = document.getElementById('new-date');
    dateField.value = format(new Date(), 'yyyy-MM-dd');
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', (e) => newTask.close());

    // show a message with a type of the input
    function showMessage(input, message, type) {
        // get the small element and set the message
        const msg = input.parentNode.querySelector("small");
        msg.innerText = message;
        // update the class for the input
        input.className = type ? "success" : "error";
        return type;
    }

    function showError(input, message) {
        return showMessage(input, message, false);
    }

    function showSuccess(input) {
        return showMessage(input, "", true);
    }

    function hasValue(input, message) {
        if (input.value.trim() === "") {
            return showError(input, message);
        }
        return showSuccess(input);
    }

    const TITLE_REQUIRED = "Please enter a title";
    

    form.addEventListener("submit", function (event) {
        // stop form submission
        event.preventDefault();

        // validate the form
        let nameValid = hasValue(form.elements["new-title"], TITLE_REQUIRED);
        
        if (nameValid) {
            const inputCategories = form.elements[2].value.split(',');
            const trimmedInputCategories = inputCategories.map(cat => cat.trim());
            let lastId;
            !userData.tasks ? userData.tasks = [] : userData.tasks;
            if (userData.tasks.length > 0) {
                lastId = userData.tasks.reduce((acc, val) => {return acc.id > val.id ? acc : val}) + 1;
            } else {
                lastId = 0;
            }
            const newEntry = new Task({title: form.elements[0].value, description: form.elements[1].value, categories: trimmedInputCategories, dueDate: form.elements[3].value, id: lastId});
            console.log("New task: ",newEntry);
            userData.tasks.push(newEntry);
            loadDashboard(activeUser);
            form.innerHTML = formDefault.innerHTML;
            newTask.close();
        }
    });

}

renderAuthScreen(login);