const Collection = require("../models/Collection");
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const {collectionId} = req.params;
    // check if the collection exists
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) return res.status(404).json({ error: "Collection not found." });

    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      user: req.user.id,
      collection:collectionId,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Unable to create task." });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const tasks = await Task.find({ user: req.user.id, deleted: false, collection: collectionId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch tasks." });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId, collectionId } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id, collection: collectionId },
      { ...req.body, updated: Date.now() },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Unable to update task." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId, collectionId } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id, collection: collectionId },
      { deleted: true, updated: Date.now() },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete task." });
  }
};
