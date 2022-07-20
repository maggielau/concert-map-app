import React from "react";
import logo from '../images/logo1.png';
import githubLogo from '../images/github-logo.png';

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
          <img src={logo} alt="Logo" />
          <h1>TO.Music-Mapper</h1>
          <p>Welcome! This tool helps you discover new live music in Toronto. 
            Select the date you'll be in town, check out where the shows are, 
            and preview music from the artists and bands performing!</p>
          <div className="event-date">
            <label htmlFor="eventDate">Select a date: </label>
            <input type="date" id="eventDate" className="date-select" value={selectedDate} onChange={() => onSelectDate()}></input>
          </div>

            {(dateEvents.length === 0) ? <h3>Sorry, no events available for this date.</h3> :
              
              dateEvents.map(item => {
                  return (
                      <div className="venue-info" key={item._id}>
                          <h2 onClick={() => onSelect(item)} >{item.venueName}</h2>
                          {(selected._id === item._id) ? <VenueInfo item={item} onSelectedArtistChange={onSelectedArtistChange}/> : null}
                      </div>
                  );
              })
              
            }
            <div className="github-link">
              <a href="https://github.com/maggielau" target="_blank"><img src={githubLogo} alt="Github" /></a>
            </div>
        </div>
    );



}

export default Infobar;