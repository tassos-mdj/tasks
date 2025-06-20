import { style } from "./style.css";
import { renderAuthScreen, renderDashboard, renderNewUserWelcome } from "./sreenController.js";
import { index } from "./staticContent.js";
import { updateIndex } from "./storageController.js";
import { format } from "date-fns";
import { User } from "./user.js";
import { Task } from "./task.js";
import { parseISO } from "date-fns/fp";

const currentDate = format(new Date(), "yyyy-MM-dd");

let currentIndex = updateIndex();
export let userData;
let activeUser;
let section = 'agenda';

//Get user from login screen
function login() {
    const usernameInput = document.querySelector('#username');
    activeUser = usernameInput.value; //.toLowerCase();
    loadDashboard(activeUser, section);
}

function findUser(activeUser, indexSet) {
    //find user
    return indexSet.reduce((final, entry) => {
        if (entry.username === activeUser){
            final = entry;
            
        }  
            return final;
        } , {})
}

//Check user & load application
function loadDashboard(activeUser) {
    userData = findUser(activeUser, currentIndex);
    
    //check if user exists to load dashboard. If not add user & load dashboard
    if (Object.keys(userData).length === 0) {
        let addUser = new User(activeUser);
        console.log(currentIndex);
        renderNewUserWelcome();

        //Sample data option selector
        const buttons = document.querySelectorAll('.sample-load-button');
            for (let button of buttons) {
            button.addEventListener('click', () => {
                if (button.value === 'Load sample') {
                    let sampleUser = findUser('Tassos', index);
                    addUser.tasks = sampleUser.tasks;
                    currentIndex.push(addUser);
                    updateIndex(currentIndex);
                    loadDashboard(activeUser);

                } else {
                    currentIndex.push(addUser);
                    updateIndex(currentIndex);
                    loadDashboard(activeUser);}
                console.log(button.value);
            });
            }
            console.log(currentIndex);
            console.log('Login check: new user added');

    } else {
        renderDashboard(userData, 'agenda');
        document.getElementById('cat-all').classList.add('active-menu-item');
        console.log('Login check: loading dashboard');
    }
}

//Menu selector logic
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

function updateUserData(userData) {
    let position;
    let user = currentIndex.reduce((final, entry) => {
        if (entry.username === activeUser){
            final = entry
        }  
        return final;
        } , {})

    position = currentIndex.indexOf(user);
    currentIndex[position].tasks = userData.tasks;
    updateIndex(currentIndex);
}

//Load tasks that meet criteria
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
    return tasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
}

//Filter today's tasks
function loadToday(tasks) {
    return tasks.filter((task) => task.dueDate === currentDate);
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

//Filter tasks by selected category
function catFilter(tasks, id) {
    let filteredTasksList = [];
    for (let task of tasks) {
        if (task.categories.includes(id)) {
             filteredTasksList.push(task);
        }
    }
    return filteredTasksList;
}

//Add new task logic
function taskAdd() {
    const newTask = document.querySelector('#new-task');
    newTask.showModal();
    let form = document.getElementById('new-task-form');
    const dateField = document.getElementById('new-date');
    dateField.value = format(new Date(), 'yyyy-MM-dd');
    const closeBtn = document.querySelector('.close');
    taskSubmit(form, newTask);
    const formDefault = form;
    form.innerHTML = formDefault.innerHTML;
}

export function taskSubmit(form, container) {


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
        let nameValid = hasValue(form.elements["new-title"] || form.elements["task-title"], TITLE_REQUIRED);

        if (nameValid) {
            const inputCategories = form.elements[2].value.split(',');
            const trimmedInputCategories = inputCategories.map(cat => cat.trim());
            let lastId;
            !userData.tasks ? userData.tasks = [] : userData.tasks;
            if (userData.tasks.length > 0) {
                lastId = userData.tasks.reduce((acc, val) => { return acc.id > val.id ? acc : val }) + 1;
            } else {
                lastId = 0;
            }

            const newEntry = new Task({ title: form.elements[0].value, description: form.elements[1].value, categories: trimmedInputCategories, dueDate: form.elements[3].value, id: lastId });
            const currentid = document.querySelector('#task-in-edit');

            if (!currentid) {
                console.log("New task: ", newEntry);
                userData.tasks.push(newEntry);
            } else {
                
                for (let task of userData.tasks) {
                    if (task.id === parseInt(currentid.value)) {
                        task.title = newEntry.title;
                        task.description = newEntry.description;
                        task.categories = newEntry.categories;
                        task.dueDate = newEntry.dueDate;
                    }
                }
                
            }
            updateUserData(userData);
            loadDashboard(activeUser);
            // container.close();
        }
    });
}

//Remove task logic
export function removeTask(task) {
    const index = userData.tasks.indexOf(task);
    userData.tasks.splice(index, 1);
    loadDashboard(activeUser);
}

//Remove categories
export function removeCategory(task, category) {
    task.categories = task.categories.filter(item => item !== category);
    loadDashboard(activeUser);
}

//Add categories
export function addCategory(task, category) {
    task.categories.push(category);
    loadDashboard(activeUser);
}

//Login screen loader
renderAuthScreen(login);