const express = require('express');
const { createCollection, getCollections, updateCollection, deleteCollection } = require('../controllers/collectionController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.route('/').get(protect, getCollections).post(protect, createCollection);
router.route('/:id').put(protect, updateCollection).delete(protect, deleteCollection);

module.exports = router;