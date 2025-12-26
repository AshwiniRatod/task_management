import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import Header from "../components/Header";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import EditTaskModal from "../components/EditTaskModal";
import TaskStatsChart from "../components/TaskStatsChart";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [overdueCount, setOverdueCount] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [notifications, setNotifications] = useState([]);        // stores notifications
const [showNotifications, setShowNotifications] = useState(false); // toggle dropdown

  const notifiedRef = useRef(new Set());

  /* TOGGLES */
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");

  /* LOAD TASKS */
  const loadTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /* ADD TASK */
  const addTask = async (e) => {
    e.preventDefault();
    await api.post("/tasks", form);
    setForm({ title: "", description: "", dueDate: "", priority: "low" });
    setShowAddForm(false);
    loadTasks();
  };

  const toggle = async (id, completed) => {
    await api.put(`/tasks/${id}`, { completed: !completed });
    loadTasks();
  };

  const del = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  const updateTask = async (id, data) => {
    await api.put(`/tasks/${id}`, data);
    setEditingTask(null);
    loadTasks();
  };

  /* SEARCH + FILTER */
  let visible = [...tasks];

  if (search.trim()) {
    visible = visible.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter === "pending") visible = visible.filter((t) => !t.completed);
  if (filter === "completed") visible = visible.filter((t) => t.completed);

  if (sort === "date") {
    visible.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  if (sort === "priority") {
    const p = { high: 1, medium: 2, low: 3 };
    visible.sort((a, b) => p[a.priority] - p[b.priority]);
  }
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    let count = 0;

    tasks.forEach((task) => {
      if (task.completed || !task.dueDate) return;

      const diff = new Date(task.dueDate).getTime() - now;

      // Notify at exact due time or if overdue
      if (diff <= 0 && !notifiedRef.current.has(task._id)) {
        if (Notification.permission === "granted") {
          new Notification("⏰ Task Due", {
            body: `"${task.title}" is due now!`,
          });
        }

        notifiedRef.current.add(task._id);

        // Save notification for bell dropdown
        setNotifications((prev) => [
          { id: task._id, title: task.title, dueDate: task.dueDate },
          ...prev,
        ]);
      }

      // Count tasks due soon for badge
      if (diff <= 3600000 && diff > -86400000) { // 1 hour before to 1 day overdue
        count++;
      }
    });

    setOverdueCount(count);
  }, 15000); // check every 15 seconds

  return () => clearInterval(interval);
}, [tasks]);


  return (
    <>
      <Header
  search={search}
  setSearch={setSearch}
  notifications={notifications}
/>

      

      <main className="main-container">

        {/* ANALYTICS TOGGLE */}
        <button
          className="primary-btn"
          style={{ marginBottom: "20px" }}
          onClick={() => setShowAnalytics((p) => !p)}
        >
          📊 {showAnalytics ? "Hide Analytics" : "View Analytics"}
        </button>

        {/* ANALYTICS PANEL */}
        {showAnalytics && (
          <section className="analytics-panel">

            <section className="stats-grid">
              <div className="stat-card">
                <h4>Total Tasks</h4>
                <p>{tasks.length}</p>
              </div>

              <div className="stat-card pending">
                <h4>Pending</h4>
                <p>{tasks.filter(t => !t.completed).length}</p>
              </div>

              <div className="stat-card completed">
                <h4>Completed</h4>
                <p>{tasks.filter(t => t.completed).length}</p>
              </div>

              <div className="stat-card due">
                <h4>Due Soon</h4>
                <p>{overdueCount}</p>
              </div>
            </section>

            <TaskStatsChart tasks={tasks} dueSoon={overdueCount} />
          </section>
        )}

        {/* ADD TASK BUTTON */}
        {!showAddForm && (
          <button
            className="primary-btn"
            style={{ marginBottom: "24px" }}
            onClick={() => setShowAddForm(true)}
          >
            + Add Task
          </button>
        )}

        {/* ADD TASK FORM */}
        {showAddForm && (
          <form className="task-form-card floating" onSubmit={addTask}>
            <h2>Add New Task</h2>

            <input
              required
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="form-row">
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />

              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="primary-btn">Add Task</button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* FILTER BAR */}
        <div className="filter-card">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* TASK LIST */}
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <section
                className="task-grid"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {visible.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task-card ${task.completed ? "done" : ""}`}
                      >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <span className="meta">
                          {task.priority} • {task.dueDate?.slice(0, 16)}
                        </span>

                        <div className="actions">
                          <button onClick={() => toggle(task._id, task.completed)}>
                            {task.completed ? "Undo" : "Complete"}
                          </button>
                          <button className="danger" onClick={() => del(task._id)}>
                            Delete
                          </button>
                          <button onClick={() => setEditingTask(task)}>
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        </DragDropContext>

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={updateTask}
          />
        )}
      </main>
    </>
  );
}
