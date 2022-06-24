import React from "react";
import locations from '../locations-data'
import VideoSearch from "./ArtistContainer";

const VenueInfo = ({item, onSelectedArtistChange}) => {
  return (
    <div className="venue-details">
      <h3>Artists:</h3>
      <ul>
        {
          item.artists.map(artist => {
            return (
              <li onClick={() => onSelectedArtistChange(artist)}>
                {artist}
              </li>
            );
          })
        }
      </ul>
      <p>Cost: {item.cost}</p>
      <p>Doors: {item.doors}</p>
      <p><a href={item.purchaseURL} target="_blank">Buy tickets</a></p>
    </div>
  );
}


const Infobar = ({ selected, onSelectedChange, onSelectedArtistChange }) => {

    const onSelect = item => {
        onSelectedChange(item);
      }
    
    return (
        <div className="infobar-content">
            {
                locations.map(item => {
                    return (
                        <div className="venue-info" key={item.id}>
                            <h2 onClick={() => onSelect(item)} >{item.markerName}</h2>
                            {(selected.id === item.id) ? <VenueInfo item={item} onSelectedArtistChange={onSelectedArtistChange}/> : null}
                        </div>
                    );
                })
            }
        </div>
    );



}

export default Infobar;