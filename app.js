const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/nomadnest";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js")


main().then(() => {
    console.log("Connected to Server");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
    res.send("Root is Working");
});

// app.get("/testListing",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Shanti Priya Cottages",
//         description: "Maje Lo bc",
//         price: 1200,
//         country: "India",
//         location: "Goa me kahi",
//     });

//     await sampleListing.save();
//     console.log("Sved to db");
//     res.send("Success");
// });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) =>
            el.message
        ).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) =>
            el.message
        ).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// New route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}));

// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

// Create route
app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })

);

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));

// Update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedLsiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLsiting);
    res.redirect("/listings");
}));

// Reviews
/// Post Route : Not MAKING INDEX OR ANY OTHER ROUTE CUZ REVIEWS CANT EXIST WITHOUT A LISTING :)
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

/// Delete Review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


// Any other route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(status).send(message);
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is up and listening at ${port}`);
});