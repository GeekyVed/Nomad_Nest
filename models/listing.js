// This model is for a single place (apartmentm, villa etc) that will be entered on website

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let DEFAULT_IMAGE = "https://media.istockphoto.com/id/472909442/photo/backwaters-of-kerala.jpg?s=2048x2048&w=is&k=20&c=ruTvmL4tcs9TlSvAmrWGQYJY-xYfnGuMOrCup0VRpwU=";
const listeningSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: DEFAULT_IMAGE,
        set: function (v) {
            return v === ""
                ? DEFAULT_IMAGE
                : v;
        },
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listeningSchema);

module.exports = Listing;