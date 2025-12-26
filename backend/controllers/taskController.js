import Task from "../models/Task.js";

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------------- GET TASKS ---------------- */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UPDATE TASK ---------------- */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- REORDER TASKS (DRAG & DROP) ---------------- */
export const reorderTasks = async (req, res) => {
  try {
    const { order } = req.body; // [{id, order}]

    const bulk = order.map((item) => ({
      updateOne: {
        filter: { _id: item.id, user: req.user.id },
        update: { order: item.order },
      },
    }));

    await Task.bulkWrite(bulk);
    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
