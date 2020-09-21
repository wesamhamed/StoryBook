const mongoose = require("mongoose");

const connectBD = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
module.exports = connectBD;