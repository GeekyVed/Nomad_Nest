const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const listingController = require("../controllers/listings.js")

router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(isLoggedIn, validateListing,
    //     wrapAsync(listingController.createListing)
    // );
    .post(upload.single('listing[image]'), function (req, res, next) {
        res.send(req.file); 
    });

// New route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;