interface SpotifyToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  expiry: number;
}

export interface SpotifySong {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  previewUrl?: string;
  color: string;
  lyrics?: string; // We'll use placeholder lyrics since Spotify doesn't provide lyrics
}

const colors = [
  "from-love-light to-love-deep",
  "from-wisdom-light to-love-medium",
  "from-blue-100 to-blue-400",
  "from-pink-100 to-pink-400",
  "from-amber-100 to-amber-400"
];

// This is a client-side only service, so we can use environment variables
// In production, you would use a Supabase Edge Function to secure these credentials
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID'; // Use env variables in production
const SPOTIFY_CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Use env variables in production

let tokenData: SpotifyToken | null = null;

async function getSpotifyToken(): Promise<string> {
  // Check if we have a valid token cached
  if (tokenData && tokenData.expiry > Date.now()) {
    return tokenData.access_token;
  }

  // Otherwise, get a new token
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    console.error('Failed to get Spotify token');
    // Fallback to our sample data
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  
  // Store the token with its expiry time
  tokenData = {
    ...data,
    expiry: Date.now() + (data.expires_in * 1000) - 60000 // Subtract a minute to be safe
  };

  return tokenData.access_token;
}

const placeholderLyrics = [
  "Hold me close and hold me fast\nThe magic spell you cast\nThis is la vie en rose\nWhen you kiss me, heaven sighs\nAnd though I close my eyes\nI see la vie en rose",
  "Close your eyes, give me your hand, darling\nDo you feel my heart beating?\nDo you understand?\nDo you feel the same?\nAm I only dreaming?\nIs this burning an eternal flame?",
  "It's a little bit funny, this feeling inside\nI'm not one of those who can easily hide\nI don't have much money, but boy if I did\nI'd buy a big house where we both could live",
  "At last my love has come along\nMy lonely days are over\nAnd life is like a song\nOh yeah yeah, at last",
  "Wise men say, only fools rush in\nBut I can't help falling in love with you\nShall I stay? Would it be a sin?\nIf I can't help falling in love with you"
];

// Use Spotify's search API to get love songs
export async function getLoveSongs(count: number = 5): Promise<SpotifySong[]> {
  try {
    const token = await getSpotifyToken();
    
    const response = await fetch('https://api.spotify.com/v1/search?q=love&type=track&limit=' + count, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch songs from Spotify');
    }

    const data = await response.json();
    
    return data.tracks.items.map((track: any, index: number) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      imageUrl: track.album.images[0]?.url || '/placeholder.svg',
      previewUrl: track.preview_url,
      color: colors[index % colors.length],
      lyrics: placeholderLyrics[index % placeholderLyrics.length]
    }));
  } catch (error) {
    console.error('Error fetching songs:', error);
    // Fallback to sample data
    return getSampleSongs();
  }
}

// Sample fallback data
function getSampleSongs(): SpotifySong[] {
  return [
    {
      id: '1',
      title: "Can't Help Falling in Love",
      artist: "Elvis Presley",
      imageUrl: "/placeholder.svg",
      color: "from-love-light to-love-deep",
      lyrics: placeholderLyrics[0]
    },
    {
      id: '2',
      title: "At Last",
      artist: "Etta James",
      imageUrl: "/placeholder.svg",
      color: "from-wisdom-light to-love-medium",
      lyrics: placeholderLyrics[1]
    },
    {
      id: '3',
      title: "Your Song",
      artist: "Elton John",
      imageUrl: "/placeholder.svg",
      color: "from-blue-100 to-blue-400",
      lyrics: placeholderLyrics[2]
    },
    {
      id: '4',
      title: "La Vie En Rose",
      artist: "Édith Piaf",
      imageUrl: "/placeholder.svg",
      color: "from-pink-100 to-pink-400",
      lyrics: placeholderLyrics[3]
    },
    {
      id: '5',
      title: "Eternal Flame",
      artist: "The Bangles",
      imageUrl: "/placeholder.svg",
      color: "from-amber-100 to-amber-400",
      lyrics: placeholderLyrics[4]
    }
  ];
}
