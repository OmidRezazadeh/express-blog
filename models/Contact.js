const mongoose = require('mongoose');
const {formatDate} = require("../utils/jalali")
const {schema} = require("./validation/PostValidation");
const contactSchema = new mongoose.Schema({
    fullname:{
        require:true,
        type:String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
    ,message:{
        require:true,
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

contactSchema.virtual("jalaliDate").get(function () {
    return formatDate(this.createdAt);
});

module.exports = mongoose.model("Contact", contactSchema)