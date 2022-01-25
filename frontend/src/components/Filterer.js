import React from 'react';
import { Form, Button } from 'react-bootstrap';

class Filterer extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            'sort': 'price',
            'min-price': 0,
            'max-price': 100,
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    handleSubmit() {
        // POST Data to Backend
        this.props.handleSubmit(this.state);
    }
    render() {
        return (
            <form>
                <Form.Label>Order</Form.Label>
                <Form.Select name='sort' value={this.state.sort} onChange={this.handleChange}>
                    <option value='-price'>Price (High to Low)</option>
                    <option value='price'>Price (Low to High)</option>
                </Form.Select>
                {/*<Form.Label>Min. Price</Form.Label>
                <Form.Range name='min-price' value={this.state.minprice} onChange={this.handleChange} min="0" max="100"/>
                <Form.Label>Max. Price</Form.Label>
                <Form.Range name='max-price' value={this.state.maxprice} onChange={this.handleChange} min="0" max="100" />
                <Button>Filter</Button>*/}
                <Button onClick={this.handleSubmit}>Filter</Button>
            </form>
        )
    };
}

export default Filterer;