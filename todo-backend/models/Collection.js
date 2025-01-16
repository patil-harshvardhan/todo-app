const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated : {
        type: Date,
        default: Date.now,
        required: true
    },
    cretaed : {
        type: Date,
        default: Date.now,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model('Collection', CollectionSchema);