import { useEffect, useState } from 'react';
import axios from 'axios';


let videoList=[];
let videoListIndex = 1;


const VideoDisplay = ({term}) => {



    const [track, setTrack] = useState(null);
    const [search, setSearch] = useState(term);

    function videoSearch(term) {

        axios({
            url: `artist?term=${term}`
        })
            .then(res => {
                //If Deezer API cannot find the artist
                if (res.data.total === 0) {
                    setTrack(0);
                }
                else {
                    videoList = res.data.data;
                    while (videoList[0].artist.name.toUpperCase() !== term.toUpperCase()) {
                        videoList.shift();
                        if (videoList.length === 0) break;
                    }
                    //If Deezer API results do not match the artist
                    if (videoList.length === 0) {
                        setTrack(0);
                    }
                    else {
                        setTrack(`https://widget.deezer.com/widget/dark/track/${videoList[0].id}`);
                    }
                }
            })
    }

    function showNextTrack() {
        videoListIndex++;
        if (videoListIndex > videoList.length-1) {
            videoListIndex = 0;
        }
        while ((videoList[videoListIndex].artist.name.toUpperCase() !== search.toUpperCase()) && (videoListIndex < videoList.length-1)) {
            videoListIndex++;
        }
        setTrack(`https://widget.deezer.com/widget/dark/track/${videoList[videoListIndex].id}`)
    }

    function showPrevTrack() {
        videoListIndex--;
        if (videoListIndex === -1) {
            videoListIndex = (videoList.length) -1;
        }
        while ((videoList[videoListIndex].artist.name.toUpperCase() !== search.toUpperCase()) && (videoListIndex < videoList.length-1)) {
            videoListIndex--;
        }
        setTrack(`https://widget.deezer.com/widget/dark/track/${videoList[videoListIndex].id}`)
    }


    useEffect(() => {
        videoListIndex = 0;
        videoSearch(search);
    }, [search]);

    if (search !== term) {
    setSearch(term);
    }

    function closeModal() {
        var modal = document.getElementById("video-modal");
        modal.style.display = "none";
    }

    return(
        <div className="modal-content">
            <span className="modal-close" onClick={() => closeModal()}>&times;</span>
            <p>Selected Artist: {term}</p>
            <p>
            {(track === 0) ? <h2>Sorry, could not find artist</h2> :
                <div>
                    <iframe title="deezer-widget" src={track} width="100%" height="300" frameBorder="0" allowtransparency="true" allow="encrypted-media; clipboard-write"></iframe>
                    <p>
                        <button onClick={() => showPrevTrack()}>Previous Track</button>
                        <button onClick={() => showNextTrack()}>Next Track</button>
                    </p>
                </div>
            }
            </p>
        </div>
    );
}



export default VideoDisplay;