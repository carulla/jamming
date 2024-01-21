import React, { useCallback } from 'react';

import './Playlist.css';

import TrackList from '../TrackList/TrackList';

const Playlist = (props) => {
  const handleNameChange = useCallback(
    (event) => {
      props.onNameChange(event.target.value);
    },
    [props]
  );

  return (
    <div className="Playlist">
      <input
        value={props.playlistName}
        onChange={handleNameChange}
      />
      <TrackList
        tracks={props.playlistTracks}
        isRemoval={true}
        onRemove={props.onRemove}
      />
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;
