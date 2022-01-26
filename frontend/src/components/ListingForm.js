import './ListingForm.css';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from 'react-google-autocomplete';

function ListingForm(props) {
    const [Properties, setProperties] = useState(null);
    const [Property, setProperty] = useState("");
    const [Suites, setSuites] = useState(null);
    const [Suite, setSuite] = useState("");
    const [PlaceID, setPlaceID] = useState("");

    // Suite Form State
    const [SuiteNo, setSuiteNo] = useState(-1);
    const [Floor, setFloor] = useState(0);
    const [Stove, setStove] = useState(false);
    const [Microwave, setMicrowave] = useState(false);
    const [Dishwasher, setDishwasher] = useState(false);
    const [Television, setTelevision] = useState(false);
    const [Laundry, setLaundry] = useState(false);
    const [DiningArea, setDiningArea] = useState(false);
    const [Couches, setCouches] = useState(false);
    const [SubmitSuite, setSubmitSuite] = useState(false);
    // Listing Form State
    const [Price, setPrice] = useState(0);
    const [MoveInDate, setMoveInDate] = useState(new Date().toISOString().slice(0, 10));
    const [MoveOutDate, setMoveOutDate] = useState(new Date().toISOString().slice(0, 10));
    const [RoomNo, setRoomNo] = useState(0);
    const [RoomSize, setRoomSize] = useState(0);
    const [Orientation, setOrientation] = useState("");
    const [Window, setWindow] = useState(false);
    const [Bathroom, setBathroom] = useState(false);
    const [AC, setAC] = useState(false);
    const [Heating, setHeating] = useState(false);
    const [Wifi, setWifi] = useState(false);
    const [PetsAllowed, setPetsAllowed] = useState(false);
    const [Smoking, setSmoking] = useState(false);


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
                    building: Property,
                    suite_no: SuiteNo,
                    floor: Floor,
                    stove: Stove,
                    microwave: Microwave,
                    television: Television,
                    laundry: Laundry,
                    dining_area: DiningArea,
                    couches: Couches,
                };
                console.log(requestBody);
                try {
                    // Creating the New Suite
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/suites`, requestBody);
                    const suite_data = response.data;
                    setSuite(suite_data._id);
                    // Refresh the Dropdown Menu
                    const suites_refreshed = await axios.get(`${process.env.REACT_APP_API_URL}/suites?building=${Property}`);
                    const suites_data = suites_refreshed.data;
                    setSuites(suites_data);
                    // Reset the Fields
                    setSuiteNo(0);
                    setFloor(0);
                    setStove(false);
                    setMicrowave(false);
                    setTelevision(false);
                    setLaundry(false);
                    setDiningArea(false);
                    setCouches(false);
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
                        <Form.Select aria-label='Suite Selection' value={Suite} onChange={e => {setSuite(e.target.value)}}>
                            <option value="">Choose a Suite</option>
                            {Suites.map(suite => {
                                if(suite._id == Suite) {
                                    return <option value={suite._id} selected>{suite.suite_no}</option>
                                } else {
                                    return <option value={suite._id}>{suite.suite_no}</option>
                                }
                            })}
                        </Form.Select>
                    </Form.Group>
                }

                {Property && !Suite &&
                    <Container>
                        <InputGroup className="mb-3">
                            <InputGroup.Text><i className="bi bi-door-closed"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Suite No.' aria-label='Suite No.' value={SuiteNo} onChange={(e)=>setSuiteNo(e.target.value)}/>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <InputGroup.Text><i class="bi bi-stack"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Floor No.' aria-label='Floor No.' value={Floor} onChange={(e)=>{setFloor(e.target.value)}}/>
                        </InputGroup>

                        <h2>Suite Amenities</h2>
                        <Form.Check type='checkbox' id='Stove' label='Stove' checked={Stove} onChange={()=>setStove(!Stove)}/>
                        <Form.Check type='checkbox' id='Microwave' label='Microwave' checked={Microwave} onChange={()=>setMicrowave(!Microwave)}/>
                        <Form.Check type='checkbox' id='Dishwasher' label='Dishwasher' checked={Dishwasher} onChange={()=>setDishwasher(!Dishwasher)}/>
                        <Form.Check type='checkbox' id='Television' label='Television' checked={Television} onChange={()=>setTelevision(!Television)}/>
                        <Form.Check type='checkbox' id='Laundry' label='Laundry' checked={Laundry} onChange={()=>setLaundry(!Laundry)}/>
                        <Form.Check type='checkbox' id='Dining Area' label='Dining Area' checked={DiningArea} onChange={()=>setDiningArea(!DiningArea)} />
                        <Form.Check type='checkbox' id='Couches' label='Couches' checked={Couches} onChange={()=>setCouches(!Couches)}/>
                        <Button variant="primary" onClick={()=>setSubmitSuite(!SubmitSuite)}>Submit Suite</Button>
                    </Container>
                }

                {Property && Suite &&
                    <Container>
                        <InputGroup className="mb-3">
                            <InputGroup.Text><i className="bi bi-door-closed"></i></InputGroup.Text>
                            <Form.Control type='number' placeholder='Room No.' aria-label='Room No.' value={RoomNo} onChange={(e)=>setRoomNo(e.target.value)}/>
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control type='number' aria-label="Amount (to the nearest dollar)" value={Price} onChange={(e)=>setPrice(e.target.value)}/>
                            <InputGroup.Text>.00</InputGroup.Text>
                        </InputGroup>

                        <h2>Room Amenities</h2>
                        <Form.Check type='checkbox' label='Window' checked={Window} onChange={()=>setWindow(!Window)} />
                        <Form.Check type='checkbox' label='Bathroom' checked={Bathroom} onChange={()=>setBathroom(!Bathroom)} />
                        <Form.Check type='checkbox' label='Air Conditioning' checked={AC} onChange={()=>setAC(!AC)} />
                        <Form.Check type='checkbox' label='Heating' checked={Heating} onChange={()=>setHeating(!Heating)} />
                        <Form.Check type='checkbox' label='Wifi' checked={Wifi} onChange={()=>setWifi(!Wifi)} />
                        <Form.Check type='checkbox' label='Pets Allowed' checked={PetsAllowed} onChange={()=>setPetsAllowed(!PetsAllowed)} />
                        <Form.Check type='checkbox' label='Smoking' checked={Smoking} onChange={()=>setSmoking(!Smoking)} />
                        <Button variant="primary">Post Listing</Button>
                    </Container>
                }
            </Form>
    )
}

export default ListingForm;