import './ListingForm.css';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from 'react-google-autocomplete';
import * as yup from 'yup';

// Yup Validation Schemas

const ListingSchema = yup.object({
    price: yup.number().required(),
    moveInDate: yup.date().required(),
    moveOutDate: yup.date().required(),
    leaser: yup.string().uuid().required(),
    suite: yup.string().uuid().required(),
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

const defaultListing =  {
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

const SuiteSchema = yup.object({
    building: yup.string().uuid().required(),
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

const defaultSuite = {
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

function ListingForm(props) {
    const [Properties, setProperties] = useState(null);
    const [Property, setProperty] = useState("");
    const [Suites, setSuites] = useState(null);
    const [SuiteID, setSuiteID] = useState("");
    const [PlaceID, setPlaceID] = useState("");

    // Suite Form State
    const [SubmitSuite, setSubmitSuite] = useState(false);
    // Listing Form State
    const [SubmitListing, setSubmitListing] = useState(false);

    // Listing State
    const [Listing, setListing] = useState(defaultListing);
    function handleListingChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        const name = target.name;
        setListing(prevState => ({...prevState, [name]: value}));
    }

    // Suite State
    const [Suite, setSuite] = useState(defaultSuite);
    function handleSuiteChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        const name = target.name;
        setSuite(prevState => ({...prevState, [name]: value}));
    }

    useEffect(() => {
        async function fetchProperties() {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
            const properties_data = response.data;
            setProperties(properties_data);
        }
        fetchProperties();
    }, []);

    useEffect(() => {
        async function fetchSuites() {
            if(Property) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/suites?building=${Property}`);
                const suites_data = response.data;
                setSuites(suites_data);
            }
        }
        fetchSuites();
    }, [Property]);

    useEffect(() => {
        async function handlePropertySubmit() {
            try {
                if(PlaceID) {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/properties`, {place_id: PlaceID});
                    const property_data = response.data;
                    setProperty(property_data._id);
                    const properties_refreshed = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
                    const properties_data = properties_refreshed.data;
                    setProperties(properties_data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        handlePropertySubmit();
    }, [PlaceID]);
    
    useEffect(() => {
        async function handleSuiteSubmit() {
            if(Property) {
                const requestBody = {
                    ...Suite,
                    building: Property,
                };
                try {
                    // Creating the New Suite
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/suites`, requestBody);
                    const suite_data = response.data;
                    setSuiteID(suite_data._id);
                    // Refresh the Dropdown Menu
                    const suites_refreshed = await axios.get(`${process.env.REACT_APP_API_URL}/suites?building=${Property}`);
                    const suites_data = suites_refreshed.data;
                    setSuites(suites_data);
                    // Reset the Fields
                    setSuite(defaultSuite);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        handleSuiteSubmit();
    }, [SubmitSuite]);

    return (
            <Form>
                {Properties &&
                    <Form.Group className='mb-3'>
                        <Form.Label>Property</Form.Label>
                        <Form.Select aria-label='Building Selection' value={Property} onChange={e => {setProperty(e.target.value)}} >
                            <option value="">Choose a Property</option>
                            {Properties.map(property => {
                                if (property._id == Property) {
                                    return <option value={property._id} selected>{property.name}</option>
                                } else {
                                    return <option value={property._id}>{property.name}</option>
                                }
                            })}
                        </Form.Select>
                    </Form.Group>
                }
                
                {!Property &&
                    <Autocomplete
                        apiKey={process.env.REACT_APP_API_KEY}
                        style={{ width: "90%" }}
                        onPlaceSelected={(place) => {setPlaceID(place.place_id)}}
                        options={{
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
                        }}
                    />
                }
                
                {Property && Suites && 
                    <Form.Group className='mb-3'>
                        <Form.Label>Suite No.</Form.Label>
                        <Form.Select aria-label='Suite Selection' value={SuiteID} onChange={e => {setSuiteID(e.target.value)}}>
                            <option value="">Choose a Suite</option>
                            {Suites.map(suite => {
                                if(suite._id == SuiteID) {
                                    return <option value={suite._id} selected>{suite.suite_no}</option>
                                } else {
                                    return <option value={suite._id}>{suite.suite_no}</option>
                                }
                            })}
                        </Form.Select>
                    </Form.Group>
                }

                {Property && !SuiteID &&
                    <Container>
                        <InputGroup className="mb-3">
                            <InputGroup.Text><i className="bi bi-door-closed"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Suite No.' aria-label='Suite No.' name='suite_no' value={Listing['suite_no']} onChange={handleSuiteChange}/>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <InputGroup.Text><i class="bi bi-stack"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Floor No.' aria-label='Floor No.' name='floor' value={Listing['floor']} onChange={handleSuiteChange}/>
                        </InputGroup>

                        <h2>Suite Amenities</h2>
                        <Form.Check type='checkbox' id='Stove' label='Stove' name='stove' checked={Listing["stove"]} onChange={handleSuiteChange}/>
                        <Form.Check type='checkbox' id='Microwave' label='Microwave' name='microwave' checked={Listing['microwave']} onChange={handleSuiteChange}/>
                        <Form.Check type='checkbox' id='Dishwasher' label='Dishwasher' name='dishwasher' checked={Listing['dishwasher']} onChange={handleSuiteChange}/>
                        <Form.Check type='checkbox' id='Television' label='Television' name='television' checked={Listing['television']} onChange={handleSuiteChange}/>
                        <Form.Check type='checkbox' id='Laundry' label='Laundry' name='laundry' checked={Listing['laundry']} onChange={handleSuiteChange}/>
                        <Form.Check type='checkbox' id='DiningArea' label='Dining Area' name='dining_area' checked={Listing['dining_area']} onChange={handleSuiteChange} />
                        <Form.Check type='checkbox' id='Couches' label='Couches' name='couches' checked={Listing['couches']} onChange={handleSuiteChange}/>
                        <Button variant="primary" onClick={()=>setSubmitSuite(!SubmitSuite)}>Submit Suite</Button>
                    </Container>
                }

                {Property && SuiteID &&
                    <Container>
                        <InputGroup className="mb-3">
                            <InputGroup.Text><i className="bi bi-door-closed"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Room No.' aria-label='Room No.' name='room_no' value={Listing['room_no']} onChange={handleListingChange}/>
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control type='number' aria-label="Amount (to the nearest dollar)" name='price' value={Listing['price']} onChange={handleListingChange}/>
                            <InputGroup.Text>.00</InputGroup.Text>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <InputGroup.Text><i class="bi bi-calendar-event"></i></InputGroup.Text>
                            <Form.Control type='date' placeholder='Move In Date' aria-label='Move In Date' name='moveInDate' value={Listing['moveInDate']} onChange={handleListingChange}/>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <InputGroup.Text><i class="bi bi-calendar-event-fill"></i></InputGroup.Text>
                            <Form.Control type='date' placeholder='Move Out Date' aria-label='Move Out Date' name='moveOutDate' value={Listing['moveOutDate']} onChange={handleListingChange}/>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <InputGroup.Text><i class="bi bi-border"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Room Size' aria-label='Room Size' name='room_size' value={Listing['room_size']} onChange={handleListingChange}/>
                        </InputGroup>

                        <h2>Room Amenities</h2>
                        <Form.Check type='checkbox' id='Window' label='Window' name='window'  checked={Listing['window']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='Bathroom' label='Bathroom' name='bathroom' checked={Listing['bathroom']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='AirConditioning' label='Air Conditioning' name='air_conditioning' checked={Listing['air_conditioning']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='Heating' label='Heating' name='heating' checked={Listing['heating']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='Wifi' label='Wifi' name='wifi' checked={Listing['wifi']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='PetsAllowed' label='Pets Allowed' name='pets_allowed' checked={Listing['pets_allowed']} onChange={handleListingChange} />
                        <Form.Check type='checkbox' id='Smoking' label='Smoking' name='smoking' checked={Listing['smoking']} onChange={handleListingChange} />
                        <Button variant="primary" onClick={()=>setSubmitListing(!SubmitListing)}>Post Listing</Button>
                    </Container>
                }
            </Form>
    )
}

export default ListingForm;