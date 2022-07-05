import React, { useState } from 'react';
import locations from '../locations-data'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapContainer = ({ selected, onSelectedChange }) => {


  const onSelect = item => {
    onSelectedChange(item);
  }
  
  const mapStyles = {        
    height: "100vh",
    width: "60vw"
  };
  
  
  return (
     <LoadScript
       googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          clickableIcons={false}
          center={selected.position}
        >
        {
            locations.map(item => {
                return (
                    <Marker 
                        key={item.id} 
                        position={item.position}
                        onClick={() => onSelect(item)}
                        icon={{
                          path:
                            "M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z",
                          fillColor: "yellow",
                          fillOpacity: 0.9,
                          scale: 1,
                          strokeColor: "red",
                          strokeWeight: 2,
                        }}
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