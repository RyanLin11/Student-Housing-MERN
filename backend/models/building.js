const mongoose = require('mongoose');
//const axios = require('axios');
const SuiteModel = require('./suite');

const BuildingSchema = new mongoose.Schema({
    place_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    formatted_address: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    rating: {
        type: Number,
    },
    rating_count: {
        type: Number
    }
});

BuildingSchema.pre('deleteOne', {document:true, query:false}, async function(next) {
    // Delete Suites
    let suites = await SuiteModel.find({building: this._id});
    for(suite of suites) {
        suite.deleteOne();
    }
    next();
});

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;