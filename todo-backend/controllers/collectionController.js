const Collection = require("../models/Collection");
const Task = require("../models/Task");

exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    if (name === "Default") {
      return res.status(400).json({ error: "You cannot create collection Default try with other name." });
    }
    const collection = await Collection.create({ name, user: req.user.id });
    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create collection." });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id, deleted: false });
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch collections." });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { ...req.body, updated: Date.now() },
      { new: true }
    );
    if (!collection)
      return res.status(404).json({ error: "Collection not found." });
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update collection." });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    // Find a collection and check its name 
    const collectionrec = await Collection.findOne({ _id: id, user: req.user.id });

    if(!collectionrec){
      return res.status(404).json({ error: "Collection not found." });
    }

    if(collectionrec.name === "Default"){
      return res.status(400).json({ error: "You cannot delete collection Default." });
    }

    const collection = await Collection.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { deleted: true, updated: Date.now() },
      { new: true }
    );

    const tasks = await Task.updateMany(
      { collection: id, user: req.user.id },
      { deleted: true, updated: Date.now() },
      { new: true }
    );

    res.json({ message: `Collection deleted successfully. ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete collection." });
  }
};
