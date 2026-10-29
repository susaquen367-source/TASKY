// Base de datos de prueba pre-cargada con varias tareas para probar las funciones
let tasks = [
  { id: 1, name: "Taller de Geometría", dueDate: "2026-10-27", status: "Pendiente" },
  { id: 2, name: "Ensayo de Español - Generación del 27", dueDate: "2026-10-25", status: "Completada" },
  { id: 3, name: "Exposición de Biología (Célula)", dueDate: "2026-10-29", status: "Pendiente" },
  { id: 4, name: "Ejercicios de Química Orgánica", dueDate: "2026-10-22", status: "Completada" },
  { id: 5, name: "Proyecto de Historia Colombia", dueDate: "2026-11-02", status: "Pendiente" },
  { id: 6, name: "Lectura de Inglés Unit 4", dueDate: "2026-10-31", status: "Pendiente" }
];

// Inicializar la aplicación cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});

// Guardar o Actualizar Tarea (Requisito: Evitar duplicados / Agregar / Modificar)
function handleTaskSubmit(event) {
  event.preventDefault();

  const idInput = document.getElementById("edit-id").value;
  const nameInput = document.getElementById("task-name").value.trim();
  const dueDateInput = document.getElementById("due-date").value;
  const statusInput = document.getElementById("task-status").value;

  if (!nameInput || !dueDateInput) {
    showAlert("Por favor completa todos los campos", "error");
    return;
  }

  // Validación de tareas duplicadas (Algoritmo 3)
  const isDuplicate = tasks.some(
    t => t.name.toLowerCase() === nameInput.toLowerCase() && t.id.toString() !== idInput
  );

  if (isDuplicate) {
    showAlert("¡Error! Ya existe una tarea con el mismo nombre.", "error");
    return;
  }

  if (idInput) {
    // Requisito: Modificar tarea
    const taskIndex = tasks.findIndex(t => t.id.toString() === idInput);
    if (taskIndex !== -1) {
      tasks[taskIndex].name = nameInput;
      tasks[taskIndex].dueDate = dueDateInput;
      tasks[taskIndex].status = statusInput;
      showAlert("Tarea actualizada correctamente", "success");
    }
  } else {
    // Requisito: Agregar tarea
    const newTask = {
      id: Date.now(),
      name: nameInput,
      dueDate: dueDateInput,
      status: statusInput
    };
    tasks.push(newTask);
    showAlert("Tarea guardada con éxito", "success");
  }

  resetForm();
  renderTasks();
}

// Algoritmo 1 y 2: Ordenar por fecha y renderizar en la tabla
function renderTasks() {
  const tbody = document.getElementById("task-list-body");
  const filterValue = document.getElementById("status-filter").value;
  tbody.innerHTML = "";

  // Ordenar por fecha de entrega ascendente (Algoritmo 1: más próxima primero)
  let sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Filtrar según estado seleccionado
  let filteredTasks = sortedTasks.filter(t => {
    if (filterValue === "Todas") return true;
    return t.status === filterValue;
  });

  // Mostrar filas en la tabla
  filteredTasks.forEach((task, index) => {
    const tr = document.createElement("tr");

    const badgeClass = task.status === "Completada" ? "badge-completed" : "badge-pending";

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${escapeHtml(task.name)}</strong></td>
      <td>${task.dueDate}</td>
      <td><span class="badge ${badgeClass}">${task.status}</span></td>
      <td>
        <div class="action-icons">
          <button class="btn-icon" title="Cambiar estado" onclick="toggleTaskStatus(${task.id})">
            ${task.status === "Completada" ? "↩️" : "✅"}
          </button>
          <button class="btn-icon" title="Editar" onclick="editTask(${task.id})">✏️</button>
          <button class="btn-icon" title="Eliminar" onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  if (filteredTasks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
          No hay tareas registradas para mostrar.
        </td>
      </tr>
    `;
  }

  updateStats();
}

// Requisito: Marcar tarea como completada / pendiente
function toggleTaskStatus(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === "Pendiente" ? "Completada" : "Pendiente";
    showAlert(`Estado cambiado a '${task.status}'`, "success");
    renderTasks();
  }
}

// Requisito: Modificar tarea (Cargar datos en el formulario)
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById("edit-id").value = task.id;
    document.getElementById("task-name").value = task.name;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("task-status").value = task.status;

    document.getElementById("form-title").innerText = "Editar Tarea";
    document.getElementById("btn-save").innerText = "🔄 Actualizar Tarea";
    document.getElementById("btn-cancel-edit").classList.remove("hidden");
    
    // Enfocar campo de texto
    document.getElementById("task-name").focus();
  }
}

// Requisito: Eliminar tarea
function deleteTask(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
    tasks = tasks.filter(t => t.id !== id);
    showAlert("Tarea eliminada correctamente", "success");
    renderTasks();
  }
}

// Actualizar contadores del resumen
function updateStats() {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pendiente").length;
  const completed = tasks.filter(t => t.status === "Completada").length;

  document.getElementById("total-tasks").innerText = total;
  document.getElementById("pending-tasks").innerText = pending;
  document.getElementById("completed-tasks").innerText = completed;
}

// Limpiar formulario
function resetForm() {
  document.getElementById("task-form").reset();
  document.getElementById("edit-id").value = "";
  document.getElementById("form-title").innerText = "Agregar Tarea";
  document.getElementById("btn-save").innerText = "💾 Guardar Tarea";
  document.getElementById("btn-cancel-edit").classList.add("hidden");
}

// Cambiar filtro desde botones inferiores
function setFilter(status) {
  document.getElementById("status-filter").value = status;
  renderTasks();
}

function focusAddForm() {
  resetForm();
  document.getElementById("task-name").focus();
}

// Mostrar mensajes
function showAlert(message, type) {
  const alertBox = document.getElementById("alert-box");
  alertBox.innerText = message;
  alertBox.className = `alert-box ${type}`;

  setTimeout(() => {
    alertBox.className = "alert-box hidden";
  }, 3000);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}
