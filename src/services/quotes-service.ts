
export interface Quote {
  id: number;
  text: string;
  author: string;
  category: string;
  likes: number;
  saved?: boolean;
}

export function getQuotes(category?: string, startIndex: number = 0, count: number = 4): Quote[] {
  const allQuotes: Quote[] = [
    // Original quotes
    {
      id: 1,
      text: "Love is composed of a single soul inhabiting two bodies.",
      author: "Aristotle",
      category: "Philosophy",
      likes: 342,
      saved: false
    },
    {
      id: 2,
      text: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn",
      category: "Wisdom",
      likes: 289,
      saved: false
    },
    {
      id: 3,
      text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
      author: "Lao Tzu",
      category: "Philosophy",
      likes: 412,
      saved: false
    },
    {
      id: 4,
      text: "Love isn't something you find. Love is something that finds you.",
      author: "Loretta Young",
      category: "Wisdom",
      likes: 256,
      saved: false
    },
    // Additional quotes
    {
      id: 5,
      text: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.",
      author: "Victor Hugo",
      category: "Wisdom",
      likes: 328,
      saved: false
    },
    {
      id: 6,
      text: "Love does not consist in gazing at each other, but in looking outward together in the same direction.",
      author: "Antoine de Saint-Exupéry",
      category: "Relationships",
      likes: 376,
      saved: false
    },
    {
      id: 7,
      text: "To love and be loved is to feel the sun from both sides.",
      author: "David Viscott",
      category: "Wisdom",
      likes: 295,
      saved: false
    },
    {
      id: 8,
      text: "The art of love is largely the art of persistence.",
      author: "Albert Ellis",
      category: "Psychology",
      likes: 267,
      saved: false
    },
    {
      id: 9,
      text: "We are most alive when we're in love.",
      author: "John Updike",
      category: "Inspiration",
      likes: 312,
      saved: false
    },
    {
      id: 10,
      text: "Love is an untamed force. When we try to control it, it destroys us. When we try to imprison it, it enslaves us. When we try to understand it, it leaves us feeling lost and confused.",
      author: "Paulo Coelho",
      category: "Philosophy",
      likes: 402,
      saved: false
    },
    {
      id: 11,
      text: "Love is a canvas furnished by nature and embroidered by imagination.",
      author: "Voltaire",
      category: "Philosophy",
      likes: 287,
      saved: false
    },
    {
      id: 12,
      text: "The giving of love is an education in itself.",
      author: "Eleanor Roosevelt",
      category: "Wisdom",
      likes: 334,
      saved: false
    },
    {
      id: 13,
      text: "When we love, we always strive to become better than we are. When we strive to become better than we are, everything around us becomes better too.",
      author: "Paulo Coelho",
      category: "Inspiration",
      likes: 429,
      saved: false
    },
    {
      id: 14,
      text: "Love is the only force capable of transforming an enemy into a friend.",
      author: "Martin Luther King Jr.",
      category: "Wisdom",
      likes: 385,
      saved: false
    },
    {
      id: 15,
      text: "The most important thing in life is to learn how to give out love, and to let it come in.",
      author: "Morrie Schwartz",
      category: "Wisdom",
      likes: 299,
      saved: false
    },
    {
      id: 16,
      text: "Love cures people—both the ones who give it and the ones who receive it.",
      author: "Karl A. Menninger",
      category: "Psychology",
      likes: 273,
      saved: false
    },
    {
      id: 17,
      text: "Love is the joy of the good, the wonder of the wise, the amazement of the Gods.",
      author: "Plato",
      category: "Philosophy",
      likes: 356,
      saved: false
    },
    {
      id: 18,
      text: "Love is like the wind, you can't see it but you can feel it.",
      author: "Nicholas Sparks",
      category: "Literature",
      likes: 327,
      saved: false
    },
    {
      id: 19,
      text: "The greatest degree of inner tranquility comes from the development of love and compassion.",
      author: "Dalai Lama",
      category: "Spirituality",
      likes: 392,
      saved: false
    },
    {
      id: 20,
      text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
      author: "Maya Angelou",
      category: "Inspiration",
      likes: 412,
      saved: false
    }
  ];

  // Filter by category if provided
  if (category && category !== 'all') {
    const filtered = allQuotes.filter(quote => 
      quote.category.toLowerCase() === category.toLowerCase());
    return filtered.slice(startIndex, startIndex + count);
  }

  return allQuotes.slice(startIndex, startIndex + count);
}

export function getQuoteCategories(): string[] {
  return ["All", "Philosophy", "Wisdom", "Relationships", "Psychology", "Inspiration", "Spirituality", "Literature"];
}
