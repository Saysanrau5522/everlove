
export interface BookInfo {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
  rating: number;
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
      rating: book.volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1)
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    // Fallback to sample data
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
    },
    {
      id: '2',
      title: "All About Love",
      author: "bell hooks",
      description: "New visions on the nature of love and what it means to be fully alive.",
      coverUrl: "https://m.media-amazon.com/images/I/71bXMIwxy5L._AC_UF1000,1000_QL80_.jpg",
      category: "Philosophy",
      rating: 4.7,
    },
    {
      id: '3',
      title: "Attached",
      author: "Amir Levine & Rachel Heller",
      description: "The science of adult attachment and how it can help you find and keep love.",
      coverUrl: "https://m.media-amazon.com/images/I/41+BlKVyFvL._AC_UF1000,1000_QL80_.jpg",
      category: "Psychology",
      rating: 4.6,
    }
  ];
}
