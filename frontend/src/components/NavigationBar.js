import React from 'react'; 
import {Container, Navbar, Nav} from 'react-bootstrap';
import './NavigationBar.css';

class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Student Housing</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/listings">Listings</Nav.Link>
                        <Nav.Link href="/listings/add">Add Listing</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

export default NavigationBar;