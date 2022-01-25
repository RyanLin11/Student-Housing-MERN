import React from 'react';

class Carousel extends React.Component {
    render() {
        return (
            <div className='glider-contain'>
                <div className='glider'>
                    {this.props.photos.map(photo => (
                        <div key={photo}>
                            <img style={{'height':'100%', 'width':'95%'}} src={photo} />
                        </div>
                    ))}
                </div>
                <button className='glider-prev' aria-label='Previous'> &lt;&lt; </button>
                <button className='glider-prev' aria-label='Previous'> &gt;&gt; </button>
                <div className='dots' role='tablist'></div>
            </div>
        )
    }
}

export default Carousel;