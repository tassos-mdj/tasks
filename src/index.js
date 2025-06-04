import { style } from "./style.css";
import { renderAuthScreen, renderDashboard } from "./sreenController.js";
import { index } from "./staticContent.js";
import { updateIndex } from "./storageController.js";
import { format } from "date-fns";
import { User } from "./user.js";

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
        console.log(userData);
        // displayCategories(catLoader(userData.tasks));
        document.getElementById('all-cat').classList.add('active-menu-item');
        console.log('Login check: loading dashboard');
    }
}

export function menuSelector(e, currentSection) {
    let selection =  e.srcElement.id || e.srcElement.parentNode.id;
    const menuItems = ['agenda', 'today', 'calendar'];
    return menuItems.includes(selection) ? tasksLoader(userData.tasks, selection, 'cat-all') : tasksLoader(userData.tasks, currentSection, selection);
}

function tasksLoader(tasks, section, rawFilter) {
    let filter = rawFilter.slice(4);
    console.log(filter);
    let activeTasks;
    switch (section) {
        case 'agenda':
            filter === 'all' ? activeTasks = loadAgenda(tasks) : activeTasks = loadAgenda(catFilter(tasks, filter));
            break;
        case 'today':
            filter === 'all' ? activeTasks = loadToday(tasks) : activeTasks = loadToday(catFilter(tasks, filter));
            break;
        case 'calendar':
            filter === 'all' ? activeTasks = tasks : activeTasks = catFilter(tasks, filter);
            break;
    }

return {'activeId': section, 'activeData': activeTasks};
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
    for (let task of tasks) {
        for (let category of task.categories) {
            if (!catList.includes(category)) {
                catList.push(category);
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


renderAuthScreen(login);