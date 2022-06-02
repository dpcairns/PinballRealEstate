import React, { useState, useEffect } from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
import './Detail.css';
import { useParams } from 'react-router-dom';
import { getSingleHome } from '../services/fetch-utils';
import { singleProperty } from '../single-property-data';
import Mapbox from './Mapbox';


export default function Detail() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  const [images, setImages] = useState([]);

  useEffect(() => {
    async function load() {
      const { property_detail } = singleProperty;//await getSingleHome(id);
      setDetails(property_detail);
      const imageArray = property_detail.photos.map((photo) => { return { 'url': photo.href };});
      setImages(imageArray);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  return (
    <div className="detail-page">
      { details &&
      <div>
        <div className="address-area">
          <h1 className="street-address">{details.address.line}</h1>
          <h2 className="sub-heading">{details.prop_common.sqft} SF | ${details.prop_common.price.toLocaleString('en-US')}  (${Math.floor(details.prop_common.price / details.prop_common.sqft)}/SF) | {details.address.city}, {details.address.state}</h2>
        </div>
        { images.length > 1 && <SimpleImageSlider
          width={896}
          height={504}
          images={images}
          showBullets={true}
          showNavs={true}
        />}
        <p className="deets">{details.prop_common.description}</p>
        <div className="property-deets">
          <div>
            <p>Bedrooms: <b>{details.prop_common.bed}</b></p>
            <p>Bathrooms: <b>{details.prop_common.bath}</b></p>
            <p>Buiding Height: <b>{details.prop_common.stories} Story</b></p>
            <p>Price Per SF: <b>${Math.floor(details.prop_common.price / details.prop_common.sqft)}</b></p>
            <p>Property Type: <b>{details.prop_common.type.charAt(0).toUpperCase() + details.prop_common.type.slice(1).toLowerCase()}</b></p>
            <p>Year Built: <b>{details.prop_common.year_built}</b></p>
            <p>Garage: <b>{details.flags.is_garage_present ? 'Yes' : 'No' }</b></p>
            <p>Year Built: <b>{details.prop_common.year_built}</b></p>
            <p>Nearest Pinball: <b>2.38 miles</b></p>
          </div>
          <div>
            <p>Nearby Schools:</p>
            {details.schools.map(school => <p key={school.name}><b>{school.name}</b></p>)}
          </div>
          <div>
            { details.property_history.map(history => <p key={history.source}>Listed at $<b>{history.price.toLocaleString('en-US')}</b> on {history.date}</p>)}
          </div>
        </div> 
        <Mapbox homes={details} initial_lat={details.address.location.lat} initial_lon={details.address.location.lon}/>
      </div>}
    </div>
  );
}
