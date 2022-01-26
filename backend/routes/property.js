const express = require('express');
const router = express.Router();
const BuildingModel = require('../models/building');
const {query, body, ValidationResult} = require('express-validator');
const _ = require('lodash');
const axios = require('axios');

// Rest APIs
router.route('/')
    .get([query('sort').isString().isIn(_.keysIn(BuildingModel.schema.paths))],
        async function(req, res) {
            // Filtering in Query Parameter
            const filters = _.pick(req.query, _.keysIn(BuildingModel.schema.paths));
            let properties = await BuildingModel.find(filters);
            // Sorting in Query Parameter
            if(req.query.hasOwnProperty('sort')) {
                if(req.query.sort.charAt(0) == '-'){
                    req.query.sort = req.query.sort.substring(1);
                    properties.sort((a, b) => a[req.query.sort] < b[req.query.sort]? 1: -1);
                } else {
                    properties.sort((a, b) => a[req.query.sort] < b[req.query.sort]? -1: 1);
                }
            }
            res.send(properties);
    })
    .post([
        body('place_id').custom(async function(value) {
            const property = await BuildingModel.findOne({place_id: value});
            if(property) {
                throw new Error('Building already in the database.');
            }
        })],
        async function(req, res) {
            const validationErrors = ValidationResult(req);
            if(validationErrors) {
                res.status(400).send(validationErrors.mapped());
            } else {
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.place_id}&fields=formatted_address,name,geometry,url,photo,formatted_phone_number,website,rating,user_ratings_total&key=${process.env.MAPS_API_KEY}`);
                    let data = response.data.result;
                    let property_info = {
                        place_id: req.body.place_id,
                        name: data.name,
                        latitude: data.geometry.location.lat,
                        longitude: data.geometry.location.lng,
                        formatted_address: data.formatted_address,
                        map_url: data.url,
                        photos: (data.photos? data.photos.map(photoElement => photoElement.photo_reference) : []),
                        phone: data.formatted_phone_number,
                        website: data.website,
                        rating: data.rating,
                        rating_count: data.user_ratings_total,
                    };
                    const property = new BuildingModel(property_info);
                    await property.save();
                    res.status(201).send(property);
                } catch(errors) {
                    res.status(500).send(errors);
                }
            }
        })

router.param('id', async function(req, res, next, id) {
    try {
        const property = await BuildingModel.findById(id);
        if(property) {
            req.property = property;
        } else {
            next(new Error('Property not found'));
        }
    } catch(error) {
        next(error);
    }
    next();
})

router.route('/:id')
    .get(async function(req, res) {
        res.status(200).send(req.property);
    })
    .put(async function(req, res) {
        try {
            await BuildingModel.findByIdAndUpdate(req.property._id, req.body);
            res.status(200).send(req.property);
        } catch(error) {
            res.status(400).send(error);
        }
    })
    .delete(async function(req, res) {
        await req.property.deleteOne();
        res.status(200).send({message: 'Deleted'});
    })

module.exports = router;