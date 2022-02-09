import {Container, Row, Col} from 'react-bootstrap';
import Filterer from './Filterer';
import FilterList from './FilterList';
import React from 'react';
import axios from 'axios';

class ListingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listings: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async componentDidMount(){
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/listings`);
        this.setState({listings: response.data});
    }
    async handleSubmit(options) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/listings?${new URLSearchParams(options).toString()}`);
        this.setState({listings: response.data});
    }
    render() {
        return (
            <Container style={{'marginTop': '2em'}}>
                <Row>
                    <Col xs="3" style={{'borderRight': '1px solid black'}}>
                        <Filterer handleSubmit={this.handleSubmit} />
                    </Col>
                    <Col>
                        <FilterList listings={this.state.listings}/>
                    </Col>
                </Row>
        </Container>
        )
    }
}

export default ListingPage;