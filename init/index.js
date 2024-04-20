// This we use to put some data so we can work upon it later
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/nomadnest";
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { object } = require("joi");

main().then(() => {
    console.log("Connected to Server");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => (
        { ...obj, owner: "6621b4a8e5b7cc6b2ef44de4"}
    ));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();