import React, { useEffect, useState } from 'react';
import { getUser, getProfileByID, getFilters, updateFilter, updateProfile, getFavoriteHomes, uploadAvatar } from '../services/supabase-utils';
import CustomMenu from './CustomMenu';
import PropertyCard from './PropertyCard';
import { Avatar } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    username:'',
    id:0, 
    avatar:''
  });
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [visibleNameForm, setVisibleNameForm] = useState(false);
  const [filters, setFilters] = useState({
    zip_code: 0,
    low_price: 0,
    high_price: 0,
  });
  const [savedHomes, setSavedHomes] = useState([]);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 10,
      slidesToSlide: 10,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1250 },
      items: 6,
      slidesToSlide: 6,
    },
    tablet: {
      breakpoint: { max: 1250, min: 950 },
      items: 5,
      slidesToSlide: 5,
    },
    smallTablet: {
      breakpoint: { max: 950, min: 650 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 650, min: 0 },
      items: 1,
      slidesToSlide: 1,
    }
  };
  
  async function getSavedHomes(){
    const savedHomesArray = await getFavoriteHomes();
    setSavedHomes(savedHomesArray);
  }
  async function getProfileOnLoad(){
    const { id } = await getUser();
    const profileData = await getProfileByID(id);
    const filterData = await getFilters();
    setProfile(profileData);
    setFilters({
      zip_code: filterData.zip_code,
      low_price: filterData.low_price,
      high_price: filterData.high_price,
      id: filterData.id
    }); 
  }
  async function getDataOnLoad(){
    await getSavedHomes();
    await getProfileOnLoad();
  }
  useEffect(() => {
    getDataOnLoad();
  }, []);

  async function handleFilterChange(e){
    e.preventDefault();
    await updateFilter(filters);
    setVisibleFilter(false);
  }
  
  function handleFilterVisible(){
    if (visibleFilter === false){
      setVisibleFilter(true);
    } else {
      setVisibleFilter(false);
    }
  }
  
  async function handleProfileChange(e) {
    e.preventDefault();
    await updateProfile(profile);
    handleUpload(profile.avatar);
    setVisibleNameForm(false);
  }
  
  function handleEditNameVisible(){
    if (visibleNameForm === false){
      setVisibleNameForm(true);
    } else {
      setVisibleNameForm(false);
    }
  }
  console.log(visibleNameForm);
  
  async function handleUpload(){
    await uploadAvatar(`https://rvwuetvxaktsvpmhimdk.supabase.co/storage/v1/object/sign/avatar/${profile.avatar}?token=${process.env.REACT_APP_SUPABASE_KEY}`);
    setVisibleNameForm(false);
  }

  return (
    <div className='profile-page'>
    
      <div className='profile'>
        <div className='avatar-username'>
          <Avatar src={profile.avatar}/>
          <h2>{profile.username}</h2>
        </div>
        <button className='profile-button' onClick={handleEditNameVisible}>Edit</button>
        <form className='name-form' onSubmit={handleProfileChange}>
          { visibleNameForm &&              
              <> 
                Upload Photo<br/>
                <input type='file' onChange={e => setProfile({ ... profile, avatar: e.target.value })}></input><br/>
                Edit Username <br/>
                <input value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })}></input><br/>
                <button onClick={handleProfileChange}>Submit</button><br/>
              </>
          }          
        </form>
        <div className='filters-div'>
          <div className='current-filters'>
            <label>Zip Code: {filters.zip_code}</label>
            <label>Low Price: ${filters.low_price.toLocaleString('en-US')}</label>
            <label>High Price: ${filters.high_price.toLocaleString('en-US')}</label>
            <button onClick={handleFilterVisible}>Filters</button><br/>
            <br/>
          </div>
          <br/>
          <div className='filter-form-container'>
            <form onSubmit={handleFilterChange}>       
              { visibleFilter && 
            <div className='filter-form'> 
              <label>
                Zip Code 
                <br/>
                <input className='zip-code-input' value={filters.zip_code} onChange={e => setFilters({ ...filters, zip_code: e.target.value })}></input>
              </label>
              <label>
                <br/>
                Minimum Price 
                <br/>
                <input className='min-price-input'value={filters.low_price} onChange={e => setFilters({ ...filters, low_price: e.target.value })}></input>
              </label>
              <label>
                <br/>
                High Price 
                <br/>
                <input className='max-price-input'value={filters.high_price} onChange={e => setFilters({ ...filters, high_price: e.target.value })}></input>
                <br/>
              </label>
              <button onClick={handleFilterChange}>Update</button>
            </div>            
              }
            </form>
          </div>
        </div>
      </div>
      <div>
        <Carousel
          responsive={responsive}>
        
          {savedHomes.map((savedHome) => <PropertyCard key={savedHome.id} 
            savedHomes={savedHomes}  
            getSavedHomes={getSavedHomes}
            address={savedHome.address}
            secondary_address={savedHome.secondary_address}
            bed={savedHome.bedrooms}
            bath={savedHome.bathrooms}
            sqft={savedHome.square_feet}
            listprice={savedHome.list_price}
            image={savedHome.primary_photo}
            id={savedHome.property_id}/>
          )
          }
        </Carousel>
      </div>
    </div>
  );
}
