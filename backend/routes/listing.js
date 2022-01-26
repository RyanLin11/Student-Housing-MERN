const express = require('express');
const router = express.Router();
const ListingModel = require('../models/listing');
const SuiteModel = require('../models/suite');
const UserModel = require('../models/user');
const _ = require('lodash');
const {query, body, validationResult} = require('express-validator');
const mongoose = require('mongoose');

// REST APIs
router.route('/')
    // Returning a list of Listings
    .get([query('sort').isString().isIn(_.keysIn(ListingModel.schema.paths))],
        async function(req, res) {
            // Filtering in Query Parameter
            const filters = _.pick(req.query, _.keysIn(ListingModel.schema.paths));
            let listings = await ListingModel.find(filters).populate('suite').populate({path:'suite', populate: {path: 'building'}});
            // Sorting in Query Parameter
            if(req.query.hasOwnProperty('sort')) {
                if(req.query.sort.charAt(0) == '-'){
                    req.query.sort = req.query.sort.substring(1);
                    listings.sort((a, b) => a[req.query.sort] < b[req.query.sort]? 1: -1);
                } else {
                    listings.sort((a, b) => a[req.query.sort] < b[req.query.sort]? -1: 1);
                }
            }
            res.status(200).send(listings);
        })
    // Creating a Listing
    .post([
        body('moveInDate').isDate(),
        body('moveOutDate').isDate(),
        body('leaser').custom(value => {
            return UserModel.findById(value).then(user => {
                if(!user) {
                    return Promise.reject('No user found.');
                }
            })
        }),
        body('suite').custom(value => {
            return SuiteModel.findById(value).then(suite => {
                if(!suite) {
                    return Promise.reject('No suite found.');
                }
            })
        })],
        async function(req, res) {
            const validationErrors = validationResult(req);
            if(validationErrors.isEmpty()) {
                try {
                    const listing = new ListingModel(req.body);
                    await listing.save();
                    res.status(201).send(listing);
                } catch(error) {
                    res.status(400).send(error);
                }
            } else {
                res.status(400).send(validationErrors.mapped());
            } 
        })

router.param('id', async function(req, res, next, id) {
    try {
        const listing = await ListingModel.findById(id).populate({path: 'suite', populate: {path: 'building'}});
        if(listing) {
            req.listing = listing;
        } else {
            next(new Error('Listing not found'));
        }
    } catch(error) {
        next(error);
    }
    next();
})

router.route('/:id')
    .get(function(req, res) {
        res.status(200).send(req.listing);
    })
    .put(async function(req, res) {
        await ListingModel.findByIdAndUpdate(req.listing._id, req.body);
        res.status(201).send(req.listing);
    })
    .delete(function(req, res) {
        req.listing.deleteOne();
        res.sendStatus(200);
    })

module.exports = router;