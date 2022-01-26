const express = require('express');
const router = express.Router();
const SuiteModel = require('../models/suite');
const _ = require('lodash');
const {query, body, validationResult} = require('express-validator');
const BuildingModel = require('../models/building');

// REST API Endpoints
router.route('/')
    .get([query('sort').isString().isIn(_.keysIn(BuildingModel.schema.paths))],
        async function(req, res) {
            // Filtering in Query Parameter
            const filters = _.pick(req.query, _.keysIn(SuiteModel.schema.paths));
            let suites = await SuiteModel.find(filters);
            // Sorting in Query Parameter
            if(req.query.hasOwnProperty('sort')) {
                if(req.query.sort.charAt(0) == '-'){
                    req.query.sort = req.query.sort.substring(1);
                    suites.sort((a, b) => a[req.query.sort] < b[req.query.sort]? 1: -1);
                } else {
                    suites.sort((a, b) => a[req.query.sort] < b[req.query.sort]? -1: 1);
                }
            }
            res.status(200).send(suites);
        })
    .post([
        body('building').custom(
            async(value) => {
                const building = await BuildingModel.findById(value);
                if(!building) {
                    throw new Error('Invalid Property ID: Does not exist');
                }
            }
        ),
        body('suite_no').custom(
            async(value, {req}) => {
                const suite = await SuiteModel.findOne({building: req.body.building, suite_no: value});
                if(suite) {
                    throw new Error('Suite already exists');
                }
            }
        ),
        ],
        async function(req, res) {
            const validationErrors = validationResult(req);
            if(validationErrors) {
                res.status(400).send(validationErrors.mapped());
            } else {
                try {
                    const suite = new SuiteModel(req.body);
                    await suite.save();
                    res.status(201).send(suite);
                } catch(error) {
                    res.status(400).send(error);
                }
            }
        })

router.param('id', async function(req, res, next, id) {
    try {
        const suite = await SuiteModel.findById(id);
        if(suite) {
            req.suite = suite;
        } else {
            next(new Error('Suite could not be found'));
        }
    } catch(error) {
        next(error);
    }
    next();
})

router.route('/:id')
    .get(async function(req, res) {
        const suite = await req.suite.populate('photos');
        res.status(200).send(suite);
    })
    .put(async function(req, res) {
        await SuiteModel.findByIdAndUpdate(req.suite._id, req.body);
        res.status(200).send(req.suite);
    })
    .delete(async function(req, res) {
        await req.suite.deleteOne();
        res.sendStatus(200);
    })

module.exports = router;