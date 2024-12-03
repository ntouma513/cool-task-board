// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

if (!Array.isArray(taskList)) {
    taskList = [];
  }

// Todo: create a function to generate a unique task id
function generateTaskId() {
return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $(`<div class="task-card card p-2 mb-2" data-id="${task.id}">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <p>Deadline: ${dayjs(task.deadline).format('MMM D, YYYY')}</p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>`);
    
      const today = dayjs();
      const deadline = dayjs(task.deadline);
      if (deadline.diff(today, 'day') <= 1 && !deadline.isBefore(today)) {
        card.css("background-color", "yellow");
      } else if (deadline.isBefore(today)) {
        card.css("background-color", "red");
      }
    
      return card;
    }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  ["todo-cards", "in-progress-cards", "done-cards"].forEach((id) =>
    $(`#${id}`).empty()
  );

  taskList.forEach((task) => {
    $(`#${task.status}-cards`).append(createTaskCard(task));
  });

  $(".task-card").draggable({
    revert: "invalid",
    start: function () {
      $(this).addClass("dragging");
    },
    stop: function () {
      $(this).removeClass("dragging");
    },
  });

  $(".delete-task").on("click", handleDeleteTask);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const deadline = $("#taskDeadline").val();
  
    const newTask = {
      id: generateTaskId(),
      title,
      description,
      deadline,
      status: "todo",
    };
  
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
    $("#formModal").modal("hide");
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest(".task-card").data("id");
    taskList = taskList.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data("id");
    const newStatus = $(this).closest(".lane").attr("id");
    const task = taskList.find((task) => task.id === taskId);
    if (task) {
      task.status = newStatus;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });
  
    $("#taskForm").on("submit", handleAddTask);
  
    $("#taskDeadline").datepicker({
      dateFormat: "yy-mm-dd",
    });
  });