import { useEffect, useState } from 'react';
import axios from 'axios';


let videoList=[];
let videoListIndex = 1;


const VideoDisplay = ({term}) => {



    const [track, setTrack] = useState(null);
    const [search, setSearch] = useState(term);

    function videoSearch(term) {

        axios({
            url: `https://api.deezer.com/search?q=artist:"${term}"`,
        })
            .then(res => {
                console.log("Axios Call completed: ")
                videoList = res.data.data;
                console.log(videoList);
                console.log(videoList[0].artist.name);
                if (videoList[0].artist.name != term) {
                    videoList.shift();
                }
                setTrack(`https://widget.deezer.com/widget/dark/track/${videoList[0].id}`);
            })
    }

    function showNextTrack() {
        videoListIndex++;
        while ((videoList[videoListIndex].artist.name.toUpperCase() !== search.toUpperCase()) && (videoListIndex < videoList.length-1)) {
            console.log("artist name didn't match");
            console.log(videoList[0].artist.name);
            console.log(search);
            videoListIndex++;
        }
        if (videoListIndex > videoList.length-1) {
            videoListIndex = 0;
        }
        setTrack(`https://widget.deezer.com/widget/dark/track/${videoList[videoListIndex].id}`)
        console.log(videoListIndex);

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
                <iframe title="deezer-widget" src={track} width="100%" height="300" frameBorder="0" allowtransparency="true" allow="encrypted-media; clipboard-write"></iframe>
            </p>
            <p>
                <button onClick={() => showNextTrack()}>Next Track</button>
            </p>
        </div>
    );
}



export default VideoDisplay;