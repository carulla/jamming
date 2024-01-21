// Define your client ID and secret
const clientId = "a71c846fa803496c8303cb6901843523";
const redirectUri = 'http://localhost:3000/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken = "";
let userId = "";



async function getCurrentUserId() {
  if (userId) {
    return Promise.resolve(userId);
  } else {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    userId = data.id;
    return userId;
  }
}
const Spotify = {
    getAccessToken() {
      if (accessToken) {
        return accessToken;
      }
  
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 36000);
        window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    },
  
    search(term) {
      const accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      });
    },

    async getUserPlaylists() {
      const userId = await getCurrentUserId();
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const playlists = data.items ? data.items.map((item) => {
        return {
          playlistId: item.id,
          name: item.name,
        };
      }) : [];
      return playlists;
    },
  
    savePlaylist(name, trackUris, id) {
      if (!name || !trackUris.length || id) {
        return fetch `https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}`, {
          headers: {Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
        };
    }
  
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      let userId;
  
      return fetch('https://api.spotify.com/v1/me', {headers: headers}
      ).then(response => response.json()
      ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackUris})
          });
        });
      });
    },
    
    async getPlaylist(id) {
      const userId = await getCurrentUserId();
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const tracks = data.items.map((item) => {
        return {
          trackId: item.track.id,
          name: item.track.name,
        };
      });
      return tracks;
    }

  };
  
  export default Spotify;

