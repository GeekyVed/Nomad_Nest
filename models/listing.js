// This model is for a single place (apartmentm, villa etc) that will be entered on website

const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

let DEFAULT_IMAGE = "https://media.istockphoto.com/id/472909442/photo/backwaters-of-kerala.jpg?s=2048x2048&w=is&k=20&c=ruTvmL4tcs9TlSvAmrWGQYJY-xYfnGuMOrCup0VRpwU=";
const listingSchema = new Schema({
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;