export interface BookInfo {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
  rating: number;
  amazonUrl?: string;
  wattpadUrl?: string;
}

export async function getRelationshipBooks(count: number = 3): Promise<BookInfo[]> {
  try {
    // Google Books API doesn't require authentication for basic searches
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:love+relationships&maxResults=${count}&orderBy=relevance`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google Books API');
    }
    
    const data = await response.json();
    
    return data.items.map((book: any) => ({
      id: book.id,
      title: book.volumeInfo.title || 'Unknown Title',
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
      description: book.volumeInfo.description ? 
        book.volumeInfo.description.substring(0, 150) + (book.volumeInfo.description.length > 150 ? '...' : '') : 
        'No description available',
      coverUrl: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
      category: book.volumeInfo.categories?.[0] || 'Relationships',
      rating: book.volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1),
      // Add Amazon affiliate link based on book title and author
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(book.volumeInfo.title + ' ' + (book.volumeInfo.authors?.[0] || ''))}`,
      // Add Wattpad search link
      wattpadUrl: `https://www.wattpad.com/search/${encodeURIComponent(book.volumeInfo.title)}`
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return getSampleBooks();
  }
}

// Sample fallback data
function getSampleBooks(): BookInfo[] {
  return [
    {
      id: '1',
      title: "The 5 Love Languages",
      author: "Gary Chapman",
      description: "How to express heartfelt commitment to your mate.",
      coverUrl: "https://m.media-amazon.com/images/I/71JL+1vv0uL._AC_UF1000,1000_QL80_.jpg",
      category: "Relationships",
      rating: 4.8,
      amazonUrl: "https://www.amazon.com/5-Love-Languages-Secret-Lasts/dp/080241270X",
      wattpadUrl: "https://www.wattpad.com/search/5%20Love%20Languages"
    },
    {
      id: '2',
      title: "All About Love",
      author: "bell hooks",
      description: "New visions on the nature of love and what it means to be fully alive.",
      coverUrl: "https://m.media-amazon.com/images/I/71bXMIwxy5L._AC_UF1000,1000_QL80_.jpg",
      category: "Philosophy",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/All-About-Love-Visions-Revolutionary/dp/0060959479",
      wattpadUrl: "https://www.wattpad.com/search/All%20About%20Love"
    },
    {
      id: '3',
      title: "Attached",
      author: "Amir Levine & Rachel Heller",
      description: "The science of adult attachment and how it can help you find and keep love.",
      coverUrl: "https://m.media-amazon.com/images/I/41+BlKVyFvL._AC_UF1000,1000_QL80_.jpg",
      category: "Psychology",
      rating: 4.6,
      amazonUrl: "https://www.amazon.com/Attached-Science-Adult-Attachment-Find/dp/1585429145",
      wattpadUrl: "https://www.wattpad.com/search/Attached"
    }
  ];
}
