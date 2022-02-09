import {Container} from 'react-bootstrap';
import React from 'react';
import SuiteCard from './SuiteCard';
import './SuiteCard.css';

class FilterList extends React.Component {
    render() {
        return (
            <Container fluid style={{'overflow':'auto','height':'85vh'}}>
                {
                    this.props.listings && this.props.listings.length > 0? this.props.listings.map(listing => 
                        <SuiteCard key={listing._id} image={listing.suite.building.photos.length == 0? 'https://www.jeevesfloridarentals.com/images/default_house.jpg': `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${listing.suite.building.photos[0]}&key=${process.env.REACT_APP_API_KEY}`}
                            title={`${listing.suite.building.name}`} 
                            description={`Price: $${listing.price}`} 
                            address={`Suite ${listing.suite.suite_no}, Room ${listing.room_no}`} 
                            price={listing.price} 
                            link={listing._id}
                            titleLink={listing.suite.building.website}
                            />
                    ) : "Hello"
                }
            </Container>
        )
    }
}

export default FilterList;