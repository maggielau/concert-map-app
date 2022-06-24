import React, { useState } from 'react';
import locations from '../locations-data'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapContainer = ({ selected, onSelectedChange }) => {


  const onSelect = item => {
    onSelectedChange(item);
  }
  
  const mapStyles = {        
    height: "100vh",
    width: "60vw"};
  
  const defaultCenter = {
    lat: 43.653908, lng: -79.384293
  }
  
  return (
     <LoadScript
       googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
        {
            locations.map(item => {
                return (
                    <Marker key={item.id} 
                        position={item.position}
                        onClick={() => onSelect(item)}
                    />
                );
            })
        }
        {
            selected.position && 
            (
                <InfoWindow 
                    position={selected.position} 
                    clickable={true} 
                    onCloseClick={() => onSelectedChange({})}
                >
                    <p>{selected.markerName}</p>
                </InfoWindow>
            )
        }
        </GoogleMap>
     </LoadScript>
  )
}

export default MapContainer;