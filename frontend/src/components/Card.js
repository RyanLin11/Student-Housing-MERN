import React from 'react';
import {Row, Col, Button, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Card.css';

class Card extends React.Component {
    render() {
        return (
            <Row className='card-container'>
                <Col xs="3" className='card-image' style={{background:`url(${this.props.image}) no-repeat`, position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <i className="bi bi-heart like-button"></i>
                </Col>
                <Col auto className='card-main'>
                    <Row class='card-header'>
                        <Col>
                            <a style={{ textDecoration: 'none' }} href={this.props.titleLink} target="_blank">
                                <h1 className='card-title'>{this.props.title}</h1>
                            </a>
                        </Col>
                    </Row>
                    <Row className='card-subheading'>
                        <Col xs="12" sm="4">
                            <span className='card-properties'><i className='bi bi-geo-alt'></i> {this.props.address} </span>
                        </Col>
                        <Col xs="12" sm="4">
                            <span className='card-properties'><i className="bi bi-people-fill"></i> 5 person suite </span>
                        </Col>
                        <Col xs="12" sm="4">
                            <span className='card-properties'><i class="bi bi-calendar-event"></i> 8/27/2021 - 4/30/2022 </span>
                        </Col>
                    </Row>
                    <Row className='card-content'>
                        <Col>
                            <p className='card-description'>A great rental opportunity awaits for you!</p>
                        </Col>
                        <Col xs="3" className='activate-container'>
                            <div className='activate'>
                                <p>1 suite left at</p>
                                <Link to={this.props.link}><Button>${this.props.price} / mo</Button></Link>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default Card;