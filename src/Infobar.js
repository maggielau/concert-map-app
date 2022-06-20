import React from "react";

const Infobar = ({ selected, onSelectedChange }) => {

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
        <div className="infobar-content">
            {
                locations.map(item => {
                    return (
                        <div>
                            <h2>{item.markerName}</h2>
                            {(selected.id === item.id) ? <p>Selected</p> : null}
                        </div>
                    );
                })
            }
        </div>
    );



}

export default Infobar;