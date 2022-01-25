import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';
import {Link} from 'react-router-dom';
import './Card.css';

class Card extends React.Component {
    render() {
        return (
            <Container className='card-container'>
                <Row>
                    <Col xs="3" style={{background:`url(${this.props.image}) no-repeat`, 'backgroundSize': 'cover', 'backgroundPosition':'center'}}>
                    </Col>
                    <Col auto>
                        <Link to={this.props.link}><h1 className='card-title'>{this.props.title}</h1></Link>
                        <p className='card-address'><i className='bi bi-geo-alt'></i> {this.props.address} </p>
                        <p className='card-description'>{this.props.description}</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Card;