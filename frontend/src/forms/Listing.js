/**
 * Listing Schemas and Values for Forms
 */

import * as yup from 'yup';

const SCHEMA = yup.object({
    price: yup.number().required(),
    moveInDate: yup.string().required(),
    moveOutDate: yup.string().required(),
    leaser: yup.string().uuid(),
    suite: yup.string().uuid(),
    room_no: yup.number().required(),
    room_size: yup.number(),
    window: yup.boolean(),
    orientation: yup.string(),
    bathroom: yup.boolean(),
    air_conditioning: yup.boolean(),
    heating: yup.boolean(),
    wifi: yup.boolean(),
    pets_allowed: yup.boolean(),
    smoking: yup.boolean(),
});

const DEFAULT_VALUES =  {
    room_no: 0,
    price: 0,
    room_size: 0,
    moveInDate: new Date().toISOString().slice(0, 10),
    moveOutDate: new Date().toISOString().slice(0, 10),
    window: false,
    orientation: false,
    bathroom: false,
    air_conditioning: false,
    heating: false,
    wifi: false,
    pets_allowed: false,
    smoking: false,
};

const AMENITIES = [
    {
        label: 'Bathroom',
        name: 'bathroom',
    },
    {
        label: 'Air Conditioning',
        name: 'air_conditioning',
    },
    {
        label: 'Heating',
        name: 'heating',
    },
    {
        label: 'Wifi',
        name: 'wifi',
    },
    {
        label: 'Pets Allowed',
        name: 'pets_allowed',
    },
    {
        label: 'Smoking',
        name: 'smoking',
    }
];

export {SCHEMA, DEFAULT_VALUES, AMENITIES};


