const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    // id : mongoose.Schema.Types.UUID,
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    created : {
        type : Date,
        default : Date.now
    },
    updated : {
        type : Date,
        default : Date.now
    },
    deleted : {
        type : Boolean,
        default : false
    },
    collection : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Collection',
        required : true
    }
})

module.exports = mongoose.model('Task', TaskSchema)