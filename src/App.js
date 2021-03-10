import React, { useState, useRef } from "react";
//import styles
import "./styles/App.scss";
//Adding Componets
import Player from "./Components/Player";
import Songs from "./Components/Songs";
import Library from "./Components/Library";
import Nav from './Components/Nav';
//import util
import data from "./Data";

function App() {
  //ref
  const audioRef = useRef(null);
  //state
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });
  const [ libraryStatus, setLibraryStatus ] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({ ...songInfo, currentTime: current, duration: duration });
  };
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[ (currentIndex + 1) % songs.length ]);
    if (isPlaying) audioRef.current.play();
  };
  return (
    <div className={`App ${libraryStatus ? 'library-active' : ""}`}>
      <Nav libraryStatus={ libraryStatus } setLibraryStatus={setLibraryStatus}/>
      <Songs currentSong={ currentSong } />
      <Player
        audioRef={audioRef}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        currentSong={currentSong}
        setSongInfo={setSongInfo}
        songInfo={ songInfo }
        songs={ songs }
        setCurrentSong={ setCurrentSong }
        setSongs={setSongs}
      />
      <Library
        isPlaying={isPlaying}
        audioRef={audioRef}
        setCurrentSong={setCurrentSong}
        songs={ songs }
        setSongs={ setSongs }
        libraryStatus={libraryStatus}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef}
        src={ currentSong.audio }
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
