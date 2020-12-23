const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
   title: String,
   datePosted: Date,
   townneighborhood: String,
   url: String,
   jobDescription: String,
   compensation: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;