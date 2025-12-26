import { useEffect, useState } from "react";
import "./EditTaskModal.css";
export default function EditTaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  // ✅ Load task data into modal form
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate
          ? task.dueDate.slice(0, 16)
          : "",
        priority: task.priority || "low",
      });
    }
  }, [task]);

  const submit = (e) => {
    e.preventDefault();
    onSave(task._id, form); // ✅ IMPORTANT
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Edit Task</h2>

        <form onSubmit={submit}>
          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Title"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
          />

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

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
