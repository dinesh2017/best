const mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connection.on("error", (err) => {
    console.log(err);
    process.exit(-1);
})

// if(env == 'development'){

// }

exports.connect = () => {
    
    mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
        console.log("mongoDB connected...."), (error) => {
            console.log(error)
        }
    })
}