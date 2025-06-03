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

export function menuSelector(e) {
    let id =  e.srcElement.id || e.srcElement.parentNode.id;
    switch (id) {
        case 'agenda':
            return {'activeId' : id, 'activeTasks': loadAgenda(userData.tasks)};
            break;
        case 'today':
            return {'activeId' : id, 'activeTasks': loadToday(userData.tasks)};
            break;
        case 'calendar':
            return {'activeId' : id, 'activeTasks' : userData.tasks};
            break;
    }
}

//Sort tasks for agenda
function loadAgenda(tasks) {
    return tasks.sort((a,b) => new Date(a.duedate) - new Date(b.duedate));
}

//Filter today's tasks
function loadToday(tasks) {
    return tasks.filter((task) => task.duedate === currentDate);
}


renderAuthScreen(login);