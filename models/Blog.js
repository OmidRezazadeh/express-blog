const mongoose = require('mongoose');
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
})

module.exports = mongoose.model("Blog", blogSchema)