import React from 'react';
import axios from 'axios';
import './SuitePage.css';
import {Container, Button} from 'react-bootstrap';
import Carousel from './Carousel';

class SuitePage extends React.Components {
    constructor() {
        this.state = {
            suite: {},
        }
    }
    async componentDidMount() {
        const response = await axios.get(`http://localhost:5000/suites/${this.props.id}`);
        this.setState({
            suite: response.data,
        });
    }
    render() {
        return (
            <Container>
                <h1>Suite {suite.suite_no}</h1>
                <p>Floor {suite.floor}</p>
                <br />
                <Carousel photos={suite.photos.map(photo => photo_url)}/>
                <h2>Amenities</h2>
                <Button>Edit Suite</Button>
            </Container>
        )
    }
}

export default SuitePage;