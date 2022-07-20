import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useGoogleMap } from '@react-google-maps/api';

const MapContainer = ({ selected, onSelectedChange, dateEvents }) => {

  const onSelect = item => {
    onSelectedChange(item);
  }
  
  //Toronto city center
  const defaultCenter = {lat: 43.653908, lng: -79.384293};

  const [mapStyles, setMapStyles] = useState({        
    height: "100vh",
    width: "60vw"
  });

  function handleResize() {
    if (window.innerWidth > 775){
      setMapStyles({
        height: "100vh",
        width: "60vw"
      });
    }
    else {
      setMapStyles({
        height: "50vh",
        width: "100vw"
      });
    }
}

  useEffect(() => {
    handleResize();
  }, []);

  window.addEventListener('resize', handleResize, { passive: true });
    
  return (
     <LoadScript
       googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          clickableIcons={false}
          center={defaultCenter}
        >
        {
            dateEvents.map(item => {
                return (
                    <Marker 
                        key={item._id} 
                        position={item.position}
                        onClick={() => onSelect(item)}
                        icon={{
                          path:
                            "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z",
                          fillColor: "#f859de",
                          fillOpacity: 0.9,
                          scale: 2,
                          strokeColor: "#12232E",
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
                    <h3>{selected.venueName}</h3>
                </InfoWindow>
            )
        }
        </GoogleMap>
     </LoadScript>
  )
}

export default MapContainer;