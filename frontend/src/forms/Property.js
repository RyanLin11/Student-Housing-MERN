/**
 * Suite Schemas and Values for Forms
 */

const AUTOCOMPLETE_OPTIONS = {
    bounds: {
        north: 43.4643 + 0.1,
        south: 43.4643 - 0.1,
        east: -80.5204 + 0.1,
        west: -80.5204 - 0.1,
    },
    componentRestrictions: {country: "ca" },
    types: ["establishment"],
    fields: ["place_id"],
    strictBounds: false,
};

export { AUTOCOMPLETE_OPTIONS };