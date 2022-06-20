import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapContainer = ({ selected, onSelectedChange }) => {

//   const [ selected, setSelected ] = useState({});

  const onSelect = item => {
    // setSelected(item);
    onSelectedChange(item);
  }
  
  const mapStyles = {        
    height: "100vh",
    width: "60vw"};
  
  const defaultCenter = {
    lat: 43.653908, lng: -79.384293
  }

  const locations = [
    {
      id: 1,
      markerName: "The Garrison",
      position: { lat: 43.64942439787501, lng: -79.42234536525002 }
    },
    {
      id: 2,
      markerName: "Phoenix Concert Hall",
      position: { lat: 43.66534665395573, lng: -79.37393094808453 }
    },
    {
      id: 3,
      markerName: "Lee's Palace",
      position: { lat: 43.665490103149494, lng: -79.40956716744871 }
    },
    {
      id: 4,
      markerName: "Danforth Music Hall",
      position: { lat: 43.67641507024379, lng: -79.35697610743739 }
    }
  ];
  
  return (
     <LoadScript
       googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY}>
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