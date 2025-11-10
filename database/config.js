import mongoose from "mongoose";
const mongoURI = "mongodb://127.0.0.1:27017/payment";

const connectTOMongoDB = async () => {
    mongoose.set('strictQuery', true);

    mongoose.connect(mongoURI).then(() => {
        console.log("Connected to MongoDB successfully");
    })
        .catch((err) => {
            console.log("Error connecting to MongoDB:", err);
        });

}


export default connectTOMongoDB;