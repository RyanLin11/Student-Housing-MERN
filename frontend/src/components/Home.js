import React from 'react';
import './Home.css';
import {Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <div>
                <div className='banner'>
                    <div className='banner-text'>
                        <h1 class='banner-title'>A Rental Marketplace, By Students, for Students</h1>
                        <Link to='/listings'><Button style={{width: '10em', height: '4em'}} id='find-housing-button' variant="primary">Find Housing</Button></Link>
                        <Link to='/listings/add'><Button style={{width: '10em', height: '4em'}} variant="primary">List Your Housing</Button></Link>
                    </div>
                </div>
                <Container className="mt-3">
                    <h1> Your One Stop Shop. </h1>
                    <p>We offer a unique platform for students from all across Waterloo region to find accommodations with ease! There is no catch, no fees.</p>
                </Container>
            </div>
        )
    }
}

export default Home;