/**
 * Suite Schemas and Values for Forms
 */

 import * as yup from 'yup';

// Suite Schema for Validation
const SCHEMA = yup.object({
    building: yup.string().uuid(),
    suite_no: yup.number().required(),
    floor: yup.number().required(),
    stove: yup.boolean(),
    microwave: yup.boolean(),
    dishwasher: yup.boolean(),
    television: yup.boolean(),
    laundry: yup.boolean(),
    dining_area: yup.boolean(),
    couches: yup.boolean(),
    photos: yup.array().of(yup.string().uuid()),
});

// Default Form Values for Suite
const DEFAULT_VALUES = {
    suite_no: 0,
    floor: 0,
    stove: false,
    microwave: false,
    dishwasher: false,
    television: false,
    laundry: false,
    dining_area: false,
    couches: false,
};

// Amenity Fields
const AMENITIES = [
    {
        label: 'Stove',
        name: 'stove',
    },
    {
        label: 'Microwave',
        name: 'microwave',
    },
    {
        label: 'Dishwasher',
        name: 'dishwasher',
    },
    {
        label: 'Television',
        name: 'television',
    },
    {
        label: 'Laundry',
        name: 'laundry',
    },
    {
        label: 'Dining Area',
        name: 'dining_area',
    },
    {
        label: 'Couches',
        name: 'couches',
    }
];

export {SCHEMA, DEFAULT_VALUES, AMENITIES};