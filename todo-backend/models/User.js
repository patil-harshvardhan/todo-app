const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email : {
        id : mongoose.Schema.Types.UUID,
        type : String,
        required : true,
        unique : true,
        active : {
            type : Boolean,
            default : true
        }
    },
    password : {
        type : String,
        required : true
    }
})

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
});

module.exports = mongoose.model('User', UserSchema)