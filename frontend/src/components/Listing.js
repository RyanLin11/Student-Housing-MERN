import './Listing.css';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Listing() {
    const [listing, setListing] = useState(null);
    const params = useParams();

    useEffect(() => {
        async function fetch_invoice_data() {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/listings/${params.listingId}`);
            setListing(response.data);
        }
        fetch_invoice_data();
    }, [params.listingId]);

    return (
        <Container>
            {!listing?
                <Row style={{height: "100vh"}} className="align-items-center">
                    <Col>
                        <h1>Loading...</h1>
                        <Spinner animation="border" variant="primary" />
                    </Col>
                </Row>
                : 
                <Container>
                    <h1> Room {listing.room_no} </h1>
                    <p> Suite {listing.suite.suite_no}, {listing.suite.building.name} </p>
                    <p>Price: ${listing.price}</p>
                    <p>Move In Date: {listing.moveInDate}</p>
                    <p>Move Out Date: {listing.moveOutDate}</p>
                    <h2>Amenities</h2>
                    <ul style={{'list-style-type':'none'}}>
                        <li>Bathroom: {listing.stove? "Yes":"No"}</li>
                        <li>Air Conditioning: {listing.air_conditioning? "Yes":"No"}</li>
                        <li>Heating: {listing.heating? "Yes":"No"}</li>
                        <li>Wifi: {listing.wifi? "Yes":"No"}</li>
                        <li>Pets Allowed: {listing.pets_allowed? "Yes":"No"}</li>
                        <li>Smoking: {listing.smoking? "Yes":"No"}</li>
                </ul>
                </Container>
            }
        </Container>
    )
}

export default Listing;