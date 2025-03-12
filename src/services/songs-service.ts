
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
  lyrics?: string;
  isPlaying?: boolean;
}

const colors = [
  "from-love-light to-love-deep",
  "from-wisdom-light to-love-medium",
  "from-blue-100 to-blue-400",
  "from-pink-100 to-pink-400",
  "from-amber-100 to-amber-400"
];

// For development/demo purposes only
// In production, use environment variables and a server-side solution
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';

let tokenData: SpotifyToken | null = null;

async function getSpotifyToken(): Promise<string> {
  // Check if we have a valid token cached
  if (tokenData && tokenData.expiry > Date.now()) {
    return tokenData.access_token;
  }

  // Otherwise, get a new token
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Store the token with its expiry time
    tokenData = {
      ...data,
      expiry: Date.now() + (data.expires_in * 1000) - 60000 // Subtract a minute to be safe
    };

    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw new Error('Failed to get Spotify token');
  }
}

const placeholderLyrics = [
  "Hold me close and hold me fast\nThe magic spell you cast\nThis is la vie en rose\nWhen you kiss me, heaven sighs\nAnd though I close my eyes\nI see la vie en rose",
  "Close your eyes, give me your hand, darling\nDo you feel my heart beating?\nDo you understand?\nDo you feel the same?\nAm I only dreaming?\nIs this burning an eternal flame?",
  "It's a little bit funny, this feeling inside\nI'm not one of those who can easily hide\nI don't have much money, but boy if I did\nI'd buy a big house where we both could live",
  "At last my love has come along\nMy lonely days are over\nAnd life is like a song\nOh yeah yeah, at last",
  "Wise men say, only fools rush in\nBut I can't help falling in love with you\nShall I stay? Would it be a sin?\nIf I can't help falling in love with you"
];

// Use Spotify's search API to get love songs with pagination
export async function getLoveSongs(count: number = 5, offset: number = 0): Promise<SpotifySong[]> {
  try {
    const token = await getSpotifyToken();
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=love&type=track&limit=${count}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch songs from Spotify');
    }

    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items || !data.tracks.items.length) {
      return [];
    }
    
    return data.tracks.items.map((track: any, index: number) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      imageUrl: track.album.images[0]?.url || '/placeholder.svg',
      previewUrl: track.preview_url,
      color: colors[index % colors.length],
      lyrics: placeholderLyrics[index % placeholderLyrics.length],
      isPlaying: false
    }));
  } catch (error) {
    console.error('Error fetching songs:', error);
    // Fallback to sample data
    return getSampleSongs(offset, count);
  }
}

// Sample fallback data with guaranteed preview URLs for playback
function getSampleSongs(offset: number = 0, count: number = 5): SpotifySong[] {
  const allSampleSongs = [
    {
      id: '1',
      title: "Can't Help Falling in Love",
      artist: "Elvis Presley",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f47d202ccfa97b492e86cc9b",
      previewUrl: "https://p.scdn.co/mp3-preview/26c1e756b2b25f147c9a2fa61e8713726499cde9",
      color: "from-love-light to-love-deep",
      lyrics: placeholderLyrics[0],
      isPlaying: false
    },
    {
      id: '2',
      title: "At Last",
      artist: "Etta James",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273508644536a820a133f9a16a5",
      previewUrl: "https://p.scdn.co/mp3-preview/5d5ee4f5fda74da8a6148f2274def3245be0db23",
      color: "from-wisdom-light to-love-medium",
      lyrics: placeholderLyrics[1],
      isPlaying: false
    },
    {
      id: '3',
      title: "Your Song",
      artist: "Elton John",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273f72f1e38e9bd48f18a17ed9b",
      previewUrl: "https://p.scdn.co/mp3-preview/8eec2e1e3413ff71fdf53eeb5f94ca0b8938ac7c",
      color: "from-blue-100 to-blue-400",
      lyrics: placeholderLyrics[2],
      isPlaying: false
    },
    {
      id: '4',
      title: "La Vie En Rose",
      artist: "Édith Piaf",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273e8854e9386aecb6c9a95a27f",
      previewUrl: "https://p.scdn.co/mp3-preview/a3f84f6c1bb1adce0e18a8d1cf0d57b8c1c53ca5",
      color: "from-pink-100 to-pink-400",
      lyrics: placeholderLyrics[3],
      isPlaying: false
    },
    {
      id: '5',
      title: "Eternal Flame",
      artist: "The Bangles",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273d175b6beaebd0ff657fb473e",
      previewUrl: "https://p.scdn.co/mp3-preview/c8680cb7b182e95ab269b42df5fc8c5347a5e55f",
      color: "from-amber-100 to-amber-400",
      lyrics: placeholderLyrics[4],
      isPlaying: false
    },
    {
      id: '6',
      title: "Always On My Mind",
      artist: "Willie Nelson",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273be15d8523d0577d75ca01e62",
      previewUrl: "https://p.scdn.co/mp3-preview/8f5fe3c5c484f2e5ed3a3ca617c185b75312d0b7",
      color: "from-love-light to-love-deep",
      lyrics: placeholderLyrics[0],
      isPlaying: false
    },
    {
      id: '7',
      title: "I Will Always Love You",
      artist: "Whitney Houston",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2736c9249b02a8775a5c3c75224",
      previewUrl: "https://p.scdn.co/mp3-preview/d41b0be900f13db75a59ede5b619579d1cf6e358",
      color: "from-wisdom-light to-love-medium",
      lyrics: placeholderLyrics[1],
      isPlaying: false
    },
    {
      id: '8',
      title: "My Heart Will Go On",
      artist: "Céline Dion",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273583afc96e272b7b7ce148f5c",
      previewUrl: "https://p.scdn.co/mp3-preview/55e57fd5d75c5ed53aa2e98d5e760d8e56cce3b4",
      color: "from-blue-100 to-blue-400",
      lyrics: placeholderLyrics[2],
      isPlaying: false
    },
    {
      id: '9',
      title: "Love Me Tender",
      artist: "Elvis Presley",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273a464417b7adda32b5e2edc10",
      previewUrl: "https://p.scdn.co/mp3-preview/c4ee335a83621b24a837882c8199c5eb9af351ff",
      color: "from-pink-100 to-pink-400",
      lyrics: placeholderLyrics[3],
      isPlaying: false
    },
    {
      id: '10',
      title: "When A Man Loves A Woman",
      artist: "Percy Sledge",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2739fe3dfce491d34e8f557456f",
      previewUrl: "https://p.scdn.co/mp3-preview/4f9fda6a619a7caedc42a8c56c132ff96e4eef05",
      color: "from-amber-100 to-amber-400",
      lyrics: placeholderLyrics[4],
      isPlaying: false
    },
    {
      id: '11',
      title: "You Are So Beautiful",
      artist: "Joe Cocker",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273de027afe1e25b77e0b1c8c34",
      previewUrl: "https://p.scdn.co/mp3-preview/9aac0d29c9e0bc90c0022d85756d4e0c9b59da8e",
      color: "from-love-light to-love-deep",
      lyrics: placeholderLyrics[0],
      isPlaying: false
    },
    {
      id: '12',
      title: "Unchained Melody",
      artist: "The Righteous Brothers",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273254c3c17cffca7981f8e0c65",
      previewUrl: "https://p.scdn.co/mp3-preview/4e964c1187e3353b8ea1a64ece2a7f9ed0f81491",
      color: "from-wisdom-light to-love-medium",
      lyrics: placeholderLyrics[1],
      isPlaying: false
    },
    {
      id: '13',
      title: "What A Wonderful World",
      artist: "Louis Armstrong",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273c11d87006a28c4ab9cb14003",
      previewUrl: "https://p.scdn.co/mp3-preview/9ba59b19d6c77a0dbfcc04ec91d0f872a1b74d64",
      color: "from-blue-100 to-blue-400",
      lyrics: placeholderLyrics[2],
      isPlaying: false
    },
    {
      id: '14',
      title: "God Only Knows",
      artist: "The Beach Boys",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273a4b85a648d4a6a6c7becab9b",
      previewUrl: "https://p.scdn.co/mp3-preview/2fd389a2b4e8870736ac9e8af357d34c7baf18c1",
      color: "from-pink-100 to-pink-400",
      lyrics: placeholderLyrics[3],
      isPlaying: false
    },
    {
      id: '15',
      title: "Stand By Me",
      artist: "Ben E. King",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273fd001a776afdbe4c71af248b",
      previewUrl: "https://p.scdn.co/mp3-preview/8d3df5937de8ba8362decb3201063b0c17496b83",
      color: "from-amber-100 to-amber-400",
      lyrics: placeholderLyrics[4],
      isPlaying: false
    }
  ];

  return allSampleSongs.slice(offset, offset + count);
}

// Audio player for song previews
let currentAudio: HTMLAudioElement | null = null;

export function playPreview(song: SpotifySong): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  if (song.previewUrl) {
    currentAudio = new Audio(song.previewUrl);
    currentAudio.play();
    
    // Add event listener for when audio ends
    currentAudio.addEventListener('ended', () => {
      song.isPlaying = false;
      currentAudio = null;
    });
    
    song.isPlaying = true;
  }
}

export function pausePreview(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
