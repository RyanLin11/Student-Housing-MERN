import './PropertyForm.css';
import * as PropertyVars from './Property';
import { useState, useEffect, Fragment } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Autocomplete from 'react-google-autocomplete';

function PropertyForm(props) {
    const [Properties, setProperties] = useState(null);
    const [Property, setProperty] = useState("");

    async function fetchProperties() {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
        const properties_data = response.data;
        setProperties(properties_data);
    }

    async function handlePropertySubmit(PlaceID) {
        try {
            console.log(PlaceID);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/properties`, {place_id: PlaceID});
            const property_data = response.data;
            setProperty(property_data._id);
            fetchProperties();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        props.onPlaceChange(Property);
    }, [Property]);

    return (
        <Fragment>
            {Properties &&
                <Form.Group className='mb-3'>
                    <Form.Label>Property</Form.Label>
                    <Form.Select aria-label='Building Selection' value={Property} onChange={e => {setProperty(e.target.value)}} >
                        <option value="">Choose a Property</option>
                        {Properties.map(property =>
                            <option key={property._id} value={property._id}>{property.name}</option>
                        )}
                    </Form.Select>
                </Form.Group>
            }
            
            {!Property &&
                <Autocomplete
                    apiKey={process.env.REACT_APP_API_KEY}
                    style={{ width: "90%" }}
                    onPlaceSelected={(place) => {handlePropertySubmit(place.place_id)}}
                    options={PropertyVars.AUTOCOMPLETE_OPTIONS}
                />
            }
        </Fragment>
    )
}

export default PropertyForm;