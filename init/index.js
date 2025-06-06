const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust1');
    
}

const initDb = async () =>{
    await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({...obj,owner:"683dcc643cf35a7e179f4a96"}))
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDb();

// const mongoose = require("mongoose");
// const Listing = require("../models/listing");
// const initData = require("./data.js");

// async function main() {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//         console.log("Connected to DB");
//         await initDb();
//     } catch (err) {
//         console.log("Error connecting to DB:", err);
//     } finally {
//         mongoose.connection.close(); // Close DB connection after initialization
//     }
// }

// const initDb = async () => {
//     try {
//         await Listing.deleteMany({});
//         await Listing.insertMany(initData.data);
//         console.log("Data was initialized");
//     } catch (err) {
//         console.log("Error initializing data:", err);
//     }
// };

// initDb();
