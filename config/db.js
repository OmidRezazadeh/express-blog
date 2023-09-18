const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {family: 4})
        console.log(`MongoDB connect ${conn.connection.host}`)
    } catch (error){
        console.error('Failed to connect to MongoDB', error);
    }
}
//*Connection,Schema&&Model,Instance,Mongoose Methods
module.exports = connectDB;