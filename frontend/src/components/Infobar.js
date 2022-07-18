import React from "react";

const VenueInfo = ({item, onSelectedArtistChange}) => {
  
  function openModal() {
    var modal = document.getElementById("video-modal");
    modal.style.display = "block";
}

  return (
    <div className="venue-details">
      <h3>Artists:</h3>
      <ul>
        {
          item.artists.map(artist => {
            return (
              <li key={artist} onClick={() => {onSelectedArtistChange(artist); openModal();}}>
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


const Infobar = ({ selected, onSelectedChange, onSelectedArtistChange, selectedDate, onSelectedDateChange, dateEvents }) => {

    const onSelect = item => {
        onSelectedChange(item);
      }
    
    const onSelectDate= function() {
      let eventDate = document.getElementById("eventDate");
      onSelectedDateChange(eventDate.value);
    }

    
    return (
        <div className="infobar-content">
          <label htmlFor="eventDate">Select your date:</label>
          <input type="date" id="eventDate" className="date-select" value={selectedDate} onChange={() => onSelectDate()}></input>
            {
                dateEvents.map(item => {
                    return (
                        <div className="venue-info" key={item._id}>
                            <h2 onClick={() => onSelect(item)} >{item.venueName}</h2>
                            {(selected._id === item._id) ? <VenueInfo item={item} onSelectedArtistChange={onSelectedArtistChange}/> : null}
                        </div>
                    );
                })
            }
        </div>
    );



}

export default Infobar;