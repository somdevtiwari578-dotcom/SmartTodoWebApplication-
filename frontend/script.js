const API_BASE = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("smarttodo_token");
}

function authHeaders(json = false) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;

  return headers;
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function showMessage(id, message, success = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.color = success ? "#15803d" : "#b91c1c";
}

// ---------- Login ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage("loginMessage", data.message || "Login failed");
        return;
      }

      // Supports either {token: "..."} or {jwt: "..."} response naming.
      const token = data.token || data.jwt || data.accessToken;

      if (!token) {
        showMessage("loginMessage", "Login succeeded, but JWT token was not found in the response.");
        return;
      }

      localStorage.setItem("smarttodo_token", token);
      localStorage.setItem("smarttodo_user_email", email);

      showMessage("loginMessage", "Login successful. Redirecting...", true);
      setTimeout(() => {
        window.location.href = "todo.html";
      }, 500);
    } catch (error) {
      showMessage("loginMessage", "Cannot connect to Spring Boot backend.");
    }
  });
}

// ---------- Register ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (password.length < 6) {
      showMessage("registerMessage", "Password must contain at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage("registerMessage", data.message || "Registration failed");
        return;
      }

      showMessage("registerMessage", "Registration successful. Go to Login.", true);
      registerForm.reset();
    } catch (error) {
      showMessage("registerMessage", "Cannot connect to Spring Boot backend.");
    }
  });
}

// ---------- Todo page ----------
const todoList = document.getElementById("todoList");

let currentPage = 0;
let totalPages = 1;

async function loadTodos() {
  if (!getToken()) {
    window.location.href = "index.html";
    return;
  }

  const search = document.getElementById("searchInput").value.trim();
  const completed = document.getElementById("completedFilter").value;
  const size = document.getElementById("pageSize").value;

  const params = new URLSearchParams();
  params.set("page", currentPage);
  params.set("size", size);
  if (search) params.set("search", search);
  if (completed !== "") params.set("completed", completed);

  try {
    const response = await fetch(`${API_BASE}/api/todos?${params.toString()}`, {
      headers: authHeaders()
    });

    const data = await readResponse(response);

    if (response.status === 401 || response.status === 403) {
      showMessage("todoMessage", "Session expired or access denied. Please login again.");
      localStorage.removeItem("smarttodo_token");
      setTimeout(() => window.location.href = "index.html", 800);
      return;
    }

    if (!response.ok) {
      showMessage("todoMessage", data.message || "Could not load todos.");
      return;
    }

    renderTodos(data);

    totalPages = Number(data.totalPages ?? 1);
    currentPage = Number(data.pageNumber ?? currentPage);

    document.getElementById("pageInfo").textContent =
      `Page ${currentPage + 1} of ${Math.max(totalPages, 1)}`;

    document.getElementById("prevBtn").disabled = currentPage <= 0;
    document.getElementById("nextBtn").disabled =
      currentPage >= Math.max(totalPages - 1, 0);

  } catch (error) {
    showMessage("todoMessage", "Cannot connect to Spring Boot backend.");
  }
}

function extractTodos(data) {
  if (Array.isArray(data)) return data;
  return data.content || data.todos || data.data || [];
}

function renderTodos(data) {
  const todos = extractTodos(data);
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = `<p class="muted">No todos found.</p>`;
    return;
  }

  todos.forEach(todo => {
    const item = document.createElement("article");
    item.className = "todo-item";

    const status = todo.completed ? "Completed" : "Pending";
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(todo.title ?? "")}</h3>
        <p>${escapeHtml(todo.description ?? "")}</p>
        <span class="status">${status}</span>
      </div>
      <div class="actions">
        <button data-action="toggle">${todo.completed ? "Mark Pending" : "Complete"}</button>
        <button data-action="delete" class="secondary">Delete</button>
      </div>
    `;

    item.querySelector('[data-action="toggle"]').addEventListener("click", () => {
      updateTodo(todo);
    });

    item.querySelector('[data-action="delete"]').addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    todoList.appendChild(item);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Create ----------
const todoForm = document.getElementById("todoForm");

if (todoForm) {
  todoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("todoTitle").value.trim();
    const description = document.getElementById("todoDescription").value.trim();
    const completed = document.getElementById("todoCompleted").checked;

    try {
      const response = await fetch(`${API_BASE}/api/todos`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({ title, description, completed })
      });

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage("todoMessage", data.message || "Could not create Todo.");
        return;
      }

      showMessage("todoMessage", "Todo created successfully.", true);
      todoForm.reset();
      currentPage = 0;
      loadTodos();
    } catch (error) {
      showMessage("todoMessage", "Cannot connect to Spring Boot backend.");
    }
  });
}

// ---------- Update ----------
async function updateTodo(todo) {
  const updated = {
    title: todo.title,
    description: todo.description,
    completed: !todo.completed
  };

  try {
    const response = await fetch(`${API_BASE}/api/todos/${todo.id}`, {
      method: "PUT",
      headers: authHeaders(true),
      body: JSON.stringify(updated)
    });

    const data = await readResponse(response);

    if (!response.ok) {
      showMessage("todoMessage", data.message || "Could not update Todo.");
      return;
    }

    showMessage("todoMessage", "Todo updated successfully.", true);
    loadTodos();
  } catch (error) {
    showMessage("todoMessage", "Cannot connect to Spring Boot backend.");
  }
}

// ---------- Delete ----------
async function deleteTodo(id) {
  if (!confirm("Are you sure you want to delete this Todo?")) return;

  try {
    const response = await fetch(`${API_BASE}/api/todos/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });

    const data = await readResponse(response);

    if (!response.ok) {
      showMessage("todoMessage", data.message || "Could not delete Todo.");
      return;
    }

    showMessage("todoMessage", data.message || "Todo deleted successfully.", true);
    loadTodos();
  } catch (error) {
    showMessage("todoMessage", "Cannot connect to Spring Boot backend.");
  }
}

// ---------- Controls ----------
document.getElementById("searchBtn")?.addEventListener("click", () => {
  currentPage = 0;
  loadTodos();
});

document.getElementById("refreshBtn")?.addEventListener("click", loadTodos);

document.getElementById("prevBtn")?.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    loadTodos();
  }
});

document.getElementById("nextBtn")?.addEventListener("click", () => {
  if (currentPage < totalPages - 1) {
    currentPage++;
    loadTodos();
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("smarttodo_token");
  localStorage.removeItem("smarttodo_user_email");
  window.location.href = "index.html";
});

if (todoList) {
  const email = localStorage.getItem("smarttodo_user_email");
  document.getElementById("welcomeText").textContent = email ? `Logged in as ${email}` : "";
  loadTodos();
}
