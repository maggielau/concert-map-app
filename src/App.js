import './App.css';
import MapContainer from './MapContainer';
import Infobar from './Infobar';
import { useState } from 'react';

function App() {

  const [ selected, setSelected ] = useState({});

  return (
    <div className="App">
      <div className="infobar">
        <Infobar selected={selected} onSelectedChange={setSelected} />
      </div>
      <div className="map-container">
        <MapContainer selected={selected} onSelectedChange={setSelected} />
      </div>
    </div>
  );
}

export default App;
