import mongoose from "mongoose";

function connectToDb (){
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to Database')
        })
        .catch(error => {
            console.log('Error Connecting to Database'.error)
        })
}

export default connectToDb