import './App.css';
import MapContainer from './components/MapContainer';
import Infobar from './components/Infobar';
import VideoDisplay from './components/ArtistContainer';
import { useEffect, useState } from 'react';


//format date to YYYY-MM-DD
const formatDate = (date) => {
  const [dateStr] = new Date(date).toISOString().split('T');
  return dateStr;
}

function App() {

  // Selected Venue
  const [ selected, setSelected ] = useState({position: {lat: 43.653908, lng: -79.384293}});
  // Selected Artist for video search
  const [ selectedArtist, setSelectedArtist ] = useState("");
  //Selected Date
  const [ selectedDate, setSelectedDate ] = useState(formatDate(new Date()));
  //Event info for selected date
  const [ dateEvents, setDateEvents ] = useState([]);

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate])

  //Get events from database whenever date is changed
  function fetchEvents(date) {
    fetch(`events?date=${date}`)
      .then((res)=>res.json())
      .then((json)=> {
          setDateEvents(json);
        })
      .catch(error => {
      console.log("Fetch API Error: " + error);
    })
  }

  return (
    <div className="App">
      <div className="infobar">
        <Infobar selected={selected} onSelectedChange={setSelected} onSelectedArtistChange={setSelectedArtist} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} dateEvents={dateEvents}/>
      </div>
      <div className="map-container">
        <MapContainer selected={selected} onSelectedChange={setSelected} dateEvents={dateEvents}/>
      </div>
      <div className="video-modal" id="video-modal">
        <VideoDisplay term={selectedArtist} onSelectedArtistChange={setSelectedArtist} />
      </div>
    </div>
  );
}

export default App;
