const mongoose = require('mongoose');
const {formatDate} = require("../utils/jalali")
const {schema} = require("./validation/PostValidation");
const blogSchema = new mongoose.Schema({
    title: {
        type: String, required: true, trim: true, minLength: 5, maxLength: 255
    }, body: {
        type: String, required: true,
    }, status: {
        type: Number, default: 0, enum: [0, 1]
    }, user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }, createdAt: {
        type: Date, default: Date.now
    }
});
const statusLabel = [{key: 0, value: "عمومی"}, {key: 1, value: "خصوصی"}];
const key = 'id';
blogSchema.virtual("statusLabel").get(function () {
    const result = statusLabel.find(obj => obj['key'] === this.status);
    return result ? result.value : null;
});

blogSchema.virtual("jalaliDate").get(function () {
    return formatDate(this.createdAt);
});
blogSchema.statics.PostValidation = function (body) {
    return schema.validate(body, {abortEarly: false});
}
module.exports = mongoose.model("Blog", blogSchema)