let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("tasks");
const addTaskBtn = document.getElementById("addTaskBtn");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
const timeline = document.getElementById("timeline");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = percent + "%";
    progressText.innerText = percent + "% Completed";
}

function renderTasks() {
    taskList.innerHTML = "";
    timeline.innerHTML = "";

    tasks.sort((a,b) => new Date(a.date) - new Date(b.date));

    tasks.forEach((task, index) => {
        // Task List
        const li = document.createElement("li");
        li.className = `task-card ${task.completed ? "completed" : ""} ${task.priority === "High" ? "high-priority" : ""}`;
        li.innerHTML = `
            <span>${task.title} (${task.subject}) - ${task.date} [${task.priority}]</span>
            <div>
                <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Done"}</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);

        // Timeline
        const tli = document.createElement("li");
        tli.innerHTML = `<strong>${task.date}</strong>: ${task.title} (${task.subject}) [${task.priority}]`;
        timeline.appendChild(tli);
    });

    updateProgress();
    checkReminders();
}

// Add Task
function addTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const subject = document.getElementById("taskSubject").value.trim();
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;

    if (title && subject && date) {
        tasks.push({ title, subject, date, priority, completed: false });
        saveTasks();
        renderTasks();
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskSubject").value = "";
        document.getElementById("taskDate").value = "";
    } else {
        alert("Please fill all fields!");
    }
}

// Toggle complete
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(index) {
    if(confirm("Delete this task?")){
        tasks.splice(index,1);
        saveTasks();
        renderTasks();
    }
}

// Reminders for today's tasks
function checkReminders() {
    const today = new Date().toISOString().split("T")[0];
    tasks.forEach(task => {
        if(task.date === today && !task.completed){
            console.log(`Reminder: Task "${task.title}" is due today!`);
        }
    });
}

addTaskBtn.addEventListener("click", addTask);
renderTasks();
