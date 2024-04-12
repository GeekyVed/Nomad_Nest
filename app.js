const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/nomadnest";
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

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

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

// New route
app.get("/listings/new", async (req, res) => {
    res.render("./listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

// Create route
app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
});

// Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs" , {listing});
});

// Update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

// Delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedLsiting = await Listing.findByIdAndDelete(id);
    console.log(deletedLsiting);
    res.redirect("/listings");
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is up and listening at ${port}`);
});