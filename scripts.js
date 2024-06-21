document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const showAllTasksButton = document.getElementById('showAllTasks');
    const showCompletedTasksButton = document.getElementById('showCompletedTasks');
    const showPendingTasksButton = document.getElementById('showPendingTasks');
    const sortTasksByPriorityButton = document.getElementById('sortTasksByPriority');
    const notification = document.getElementById('notification');

    let users = {}; // Object to store tasks by username

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const description = document.getElementById('description').value.trim();
        const priority = parseInt(document.getElementById('priority').value);

        if (!username || !description || isNaN(priority) || priority < 1 || priority > 5) {
            showNotification('Please enter valid username, task description, and priority (1-5).');
            return;
        }

        addTask(username, description, priority);
        taskForm.reset();
    });

    showAllTasksButton.addEventListener('click', function() {
        showAllTasksButton.classList.add('burst');
        setTimeout(() => showAllTasksButton.classList.remove('burst'), 500);
        showAllTasks();
    });

    showCompletedTasksButton.addEventListener('click', function() {
        showCompletedTasksButton.classList.add('burst');
        setTimeout(() => showCompletedTasksButton.classList.remove('burst'), 500);
        showCompletedTasks();
    });

    showPendingTasksButton.addEventListener('click', function() {
        showPendingTasksButton.classList.add('burst');
        setTimeout(() => showPendingTasksButton.classList.remove('burst'), 500);
        showPendingTasks();
    });

    sortTasksByPriorityButton.addEventListener('click', function() {
        sortTasksByPriorityButton.classList.add('burst');
        setTimeout(() => sortTasksByPriorityButton.classList.remove('burst'), 500);
        sortTasksByPriority();
    });

    function addTask(username, description, priority) {
        if (!users[username]) {
            users[username] = []; // Initialize array for the username if it doesn't exist
        }

        const task = {
            id: Date.now(),
            description,
            priority,
            completed: false
        };

        users[username].push(task);
        renderTasks(username);
        showNotification(`Task "${description}" added successfully for ${username}!`);
    }

    function renderTasks(username, filter = 'all') {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '<h2>Completed Tasks</h2>';

        let filteredTasks = users[username] || [];
        if (filter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (filter === 'priority') {
            filteredTasks = [...filteredTasks].sort((a, b) => a.priority - b.priority);
        }

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');

            const taskDescription = document.createElement('span');
            taskDescription.textContent = `${task.description} (Priority: ${task.priority})`;
            if (task.completed) {
                taskDescription.classList.add('completed');
            }

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-button');
            completeButton.addEventListener('click', () => {
                completeButton.classList.add('burst');
                setTimeout(() => completeButton.classList.remove('burst'), 500);
                task.completed = true;
                renderTasks(username, filter);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteButton.classList.add('burst');
                setTimeout(() => deleteButton.classList.remove('burst'), 500);
                users[username] = users[username].filter(t => t.id !== task.id);
                renderTasks(username, filter);
                showNotification(`Task "${task.description}" deleted successfully for ${username}!`);
            });

            taskElement.appendChild(taskDescription);
            if (!task.completed) {
                taskElement.appendChild(completeButton);
            }
            taskElement.appendChild(deleteButton);

            if (task.completed) {
                completedTaskList.appendChild(taskElement);
            } else {
                taskList.appendChild(taskElement);
            }
        });
    }

    function showAllTasks() {
        completedTaskList.style.display = 'block';
        const username = document.getElementById('username').value.trim();
        if (username && users[username]) {
            renderTasks(username, 'all');
        } else {
            showNotification('Please enter a valid username to show tasks.');
        }
    }

    function showCompletedTasks() {
        completedTaskList.style.display = 'block';
        const username = document.getElementById('username').value.trim();
        if (username && users[username]) {
            renderTasks(username, 'completed');
        } else {
            showNotification('Please enter a valid username to show tasks.');
        }
    }

    function showPendingTasks() {
        completedTaskList.style.display = 'none';
        const username = document.getElementById('username').value.trim();
        if (username && users[username]) {
            renderTasks(username, 'pending');
        } else {
            showNotification('Please enter a valid username to show tasks.');
        }
    }

    function sortTasksByPriority() {
        const username = document.getElementById('username').value.trim();
        if (username && users[username]) {
            renderTasks(username, 'priority');
        } else {
            showNotification('Please enter a valid username to show tasks.');
        }
    }

    function showNotification(message, type = 'info') {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification', type);
        notificationElement.textContent = message;
        notification.appendChild(notificationElement);

        setTimeout(() => {
            notification.removeChild(notificationElement);
        }, 3000);
    }
});
