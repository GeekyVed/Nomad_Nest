const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const { destroyListing } = require("../controllers/listings.js");

/// Post Route : Not MAKING INDEX OR ANY OTHER ROUTE CUZ REVIEWS CANT EXIST WITHOUT A LISTING :)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

/// Delete Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;