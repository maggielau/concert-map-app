import './App.css';
import MapContainer from './components/MapContainer';
import Infobar from './components/Infobar';
import VideoDisplay from './components/ArtistContainer';
import { useState } from 'react';

function App() {

  // Selected Venue
  const [ selected, setSelected ] = useState({position: {lat: 43.653908, lng: -79.384293}});
  // Selected Artist for video search
  const [ selectedArtist, setSelectedArtist ] = useState("mear");

  return (
    <div className="App">
      <div className="infobar">
        <Infobar selected={selected} onSelectedChange={setSelected} onSelectedArtistChange={setSelectedArtist} />
      </div>
      <div className="map-container">
        <MapContainer selected={selected} onSelectedChange={setSelected} />
      </div>
      <div className="video-modal" id="video-modal">
        <VideoDisplay term={selectedArtist}/>
      </div>
    </div>
  );
}

export default App;
