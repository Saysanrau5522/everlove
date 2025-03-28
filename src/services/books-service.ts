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
  saved?: boolean;
}

export async function getRelationshipBooks(count: number = 3, startIndex: number = 0, category?: string): Promise<BookInfo[]> {
  try {
    // Customize query based on category if provided
    const query = category && category !== 'relationships' 
      ? `subject:${category}`
      : 'subject:love+relationships';
      
    // Google Books API doesn't require authentication for basic searches
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${count}&startIndex=${startIndex}&orderBy=relevance`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google Books API');
    }
    
    const data = await response.json();
    
    // Check if we have valid items
    if (!data.items || !data.items.length) {
      return [];
    }
    
    return data.items.map((book: any) => ({
      id: book.id,
      title: book.volumeInfo.title || 'Unknown Title',
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
      description: book.volumeInfo.description ? 
        book.volumeInfo.description.substring(0, 150) + (book.volumeInfo.description.length > 150 ? '...' : '') : 
        'No description available',
      coverUrl: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
      category: book.volumeInfo.categories?.[0] || category || 'Relationships',
      rating: book.volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1),
      // Add Amazon affiliate link based on book title and author
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(book.volumeInfo.title + ' ' + (book.volumeInfo.authors?.[0] || ''))}`,
      // Add Wattpad search link
      wattpadUrl: `https://www.wattpad.com/search/${encodeURIComponent(book.volumeInfo.title)}`,
      saved: false
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return getSampleBooks(category, startIndex, count);
  }
}

// Sample fallback data with pagination support
function getSampleBooks(category?: string, startIndex: number = 0, count: number = 3): BookInfo[] {
  let allSampleBooks = [
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
    },
    {
      id: '4',
      title: "Mating in Captivity",
      author: "Esther Perel",
      description: "Unlocking erotic intelligence in long-term relationships.",
      coverUrl: "https://m.media-amazon.com/images/I/71Vz+PvgfbL._AC_UF1000,1000_QL80_.jpg",
      category: "Relationships",
      rating: 4.5,
      amazonUrl: "https://www.amazon.com/Mating-Captivity-Unlocking-Erotic-Intelligence/dp/0060753641",
      wattpadUrl: "https://www.wattpad.com/search/Mating%20in%20Captivity"
    },
    {
      id: '5',
      title: "Hold Me Tight",
      author: "Dr. Sue Johnson",
      description: "Seven conversations for a lifetime of love.",
      coverUrl: "https://m.media-amazon.com/images/I/61+3EGU94bL._AC_UF1000,1000_QL80_.jpg",
      category: "Psychology",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Hold-Me-Tight-Conversations-Lifetime/dp/031611300X",
      wattpadUrl: "https://www.wattpad.com/search/Hold%20Me%20Tight"
    },
    {
      id: '6',
      title: "The Mastery of Love",
      author: "Don Miguel Ruiz",
      description: "A practical guide to the art of relationship.",
      coverUrl: "https://m.media-amazon.com/images/I/81mpSoJzv4L._AC_UF1000,1000_QL80_.jpg",
      category: "Spirituality",
      rating: 4.8,
      amazonUrl: "https://www.amazon.com/Mastery-Love-Practical-Relationship-Toltec/dp/1878424424",
      wattpadUrl: "https://www.wattpad.com/search/Mastery%20of%20Love"
    },
    {
      id: '7',
      title: "Come as You Are",
      author: "Emily Nagoski",
      description: "The surprising new science that will transform your sex life.",
      coverUrl: "https://m.media-amazon.com/images/I/71iFJxvCGnL._AC_UF1000,1000_QL80_.jpg",
      category: "Sexuality",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Come-You-Are-Surprising-Transform/dp/1476762090",
      wattpadUrl: "https://www.wattpad.com/search/Come%20as%20You%20Are"
    },
    {
      id: '8',
      title: "Men Are from Mars, Women Are from Venus",
      author: "John Gray",
      description: "The classic guide to understanding the opposite sex.",
      coverUrl: "https://m.media-amazon.com/images/I/61K1+y1S5wL._AC_UF1000,1000_QL80_.jpg",
      category: "Relationships",
      rating: 4.5,
      amazonUrl: "https://www.amazon.com/Men-Mars-Women-Venus-Understanding/dp/0060574216",
      wattpadUrl: "https://www.wattpad.com/search/Men%20Are%20from%20Mars"
    },
    {
      id: '9',
      title: "Wired for Love",
      author: "Stan Tatkin",
      description: "How understanding your partner's brain can help you defuse conflicts and spark intimacy.",
      coverUrl: "https://m.media-amazon.com/images/I/71GbfYZYzwL._AC_UF1000,1000_QL80_.jpg",
      category: "Neuroscience",
      rating: 4.6,
      amazonUrl: "https://www.amazon.com/Wired-Love-Understanding-Partners-Attachment/dp/1608820580",
      wattpadUrl: "https://www.wattpad.com/search/Wired%20for%20Love"
    },
    {
      id: '10',
      title: "The Seven Principles for Making Marriage Work",
      author: "John Gottman",
      description: "A practical guide from the country's foremost relationship expert.",
      coverUrl: "https://m.media-amazon.com/images/I/71upz5-CbCL._AC_UF1000,1000_QL80_.jpg",
      category: "Marriage",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Seven-Principles-Making-Marriage-Work/dp/0553447718",
      wattpadUrl: "https://www.wattpad.com/search/Seven%20Principles%20for%20Making%20Marriage%20Work"
    },
    {
      id: '11',
      title: "Loving Bravely",
      author: "Alexandra H. Solomon",
      description: "Twenty lessons of self-discovery to help you find and keep the love you want.",
      coverUrl: "https://m.media-amazon.com/images/I/71EvdEMr9VL._AC_UF1000,1000_QL80_.jpg",
      category: "Self-Help",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Loving-Bravely-Lessons-Self-Discovery-Find/dp/1626255814",
      wattpadUrl: "https://www.wattpad.com/search/Loving%20Bravely"
    },
    {
      id: '12',
      title: "Emotional Intelligence",
      author: "Daniel Goleman",
      description: "Why it can matter more than IQ for relationships and personal growth.",
      coverUrl: "https://m.media-amazon.com/images/I/61yzHdv0iIL._AC_UF1000,1000_QL80_.jpg",
      category: "Psychology",
      rating: 4.6,
      amazonUrl: "https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X",
      wattpadUrl: "https://www.wattpad.com/search/Emotional%20Intelligence"
    }
  ];
  
  // Add more sample books with different genres
  allSampleBooks = [
    ...allSampleBooks,
    {
      id: '13',
      title: "The Art of Logical Thinking",
      author: "William Walker Atkinson",
      description: "A guide to thinking clearly and rationally in any situation.",
      coverUrl: "https://m.media-amazon.com/images/I/81wPu8WKIeL._AC_UF1000,1000_QL80_.jpg",
      category: "Philosophy",
      rating: 4.3,
      amazonUrl: "https://www.amazon.com/Art-Logical-Thinking-William-Atkinson/dp/1535188758",
      wattpadUrl: "https://www.wattpad.com/search/The%20Art%20of%20Logical%20Thinking"
    },
    {
      id: '14',
      title: "The Road Less Traveled",
      author: "M. Scott Peck",
      description: "A new psychology of love, traditional values and spiritual growth.",
      coverUrl: "https://m.media-amazon.com/images/I/614IdjJR4wL._AC_UF1000,1000_QL80_.jpg",
      category: "Psychology",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Road-Less-Traveled-Psychology-Traditional/dp/0743243153",
      wattpadUrl: "https://www.wattpad.com/search/The%20Road%20Less%20Traveled"
    },
    {
      id: '15',
      title: "How to Talk to Anyone",
      author: "Leil Lowndes",
      description: "92 little tricks for big success in relationships.",
      coverUrl: "https://m.media-amazon.com/images/I/51vWRz0hcCL._AC_UF1000,1000_QL80_.jpg",
      category: "Communication",
      rating: 4.5,
      amazonUrl: "https://www.amazon.com/How-Talk-Anyone-Success-Relationships/dp/007141858X",
      wattpadUrl: "https://www.wattpad.com/search/How%20to%20Talk%20to%20Anyone"
    },
    {
      id: '16',
      title: "The Power of Now",
      author: "Eckhart Tolle",
      description: "A guide to spiritual enlightenment and living in the present moment.",
      coverUrl: "https://m.media-amazon.com/images/I/714FbKtXS+L._AC_UF1000,1000_QL80_.jpg",
      category: "Spirituality",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808",
      wattpadUrl: "https://www.wattpad.com/search/The%20Power%20of%20Now"
    },
    {
      id: '17',
      title: "The Dating Playbook",
      author: "Farrah Rochon",
      description: "A modern guide to finding love in the digital age.",
      coverUrl: "https://m.media-amazon.com/images/I/81ZLpZ2lTbL._AC_UF1000,1000_QL80_.jpg",
      category: "Dating",
      rating: 4.6,
      amazonUrl: "https://www.amazon.com/Dating-Playbook-Farrah-Rochon/dp/1538716666",
      wattpadUrl: "https://www.wattpad.com/search/Dating%20Playbook"
    },
    {
      id: '18',
      title: "Parenting with Love and Logic",
      author: "Foster Cline & Jim Fay",
      description: "Teaching children responsibility with a loving approach.",
      coverUrl: "https://m.media-amazon.com/images/I/61xVVGrDQfL._AC_UF1000,1000_QL80_.jpg",
      category: "Parenting",
      rating: 4.7,
      amazonUrl: "https://www.amazon.com/Parenting-Love-Logic-Foster-Cline/dp/1576839540",
      wattpadUrl: "https://www.wattpad.com/search/Parenting%20with%20Love%20and%20Logic"
    },
    {
      id: '19',
      title: "Self-Compassion",
      author: "Kristin Neff",
      description: "The proven power of being kind to yourself.",
      coverUrl: "https://m.media-amazon.com/images/I/71EUdNRY3GL._AC_UF1000,1000_QL80_.jpg",
      category: "Self-Help",
      rating: 4.6,
      amazonUrl: "https://www.amazon.com/Self-Compassion-Proven-Power-Being-Yourself/dp/0061733520",
      wattpadUrl: "https://www.wattpad.com/search/Self-Compassion"
    },
    {
      id: '20',
      title: "For Better: The Science of a Good Marriage",
      author: "Tara Parker-Pope",
      description: "Using science to improve your relationship.",
      coverUrl: "https://m.media-amazon.com/images/I/71e3uig3SQL._AC_UF1000,1000_QL80_.jpg",
      category: "Marriage",
      rating: 4.4,
      amazonUrl: "https://www.amazon.com/Better-Science-Marriage-Tara-Parker-Pope/dp/0452297109",
      wattpadUrl: "https://www.wattpad.com/search/For%20Better%20Science%20Marriage"
    }
  ];

  // Filter by category if provided
  if (category && category !== 'all') {
    allSampleBooks = allSampleBooks.filter(book => 
      book.category.toLowerCase() === category.toLowerCase());
  }

  return allSampleBooks.slice(startIndex, startIndex + count);
}
