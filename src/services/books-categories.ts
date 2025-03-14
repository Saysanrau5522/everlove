
interface BookCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const bookCategories: BookCategory[] = [
  { id: '1', name: 'Relationships', slug: 'relationships', count: 42 },
  { id: '2', name: 'Self-Help', slug: 'self-help', count: 38 },
  { id: '3', name: 'Psychology', slug: 'psychology', count: 35 },
  { id: '4', name: 'Philosophy', slug: 'philosophy', count: 27 },
  { id: '5', name: 'Spirituality', slug: 'spirituality', count: 24 },
  { id: '6', name: 'Sexuality', slug: 'sexuality', count: 19 },
  { id: '7', name: 'Communication', slug: 'communication', count: 31 },
  { id: '8', name: 'Marriage', slug: 'marriage', count: 28 },
  { id: '9', name: 'Dating', slug: 'dating', count: 33 },
  { id: '10', name: 'Parenting', slug: 'parenting', count: 22 },
];

export function getBookCategories(): BookCategory[] {
  return bookCategories;
}

export function getCategoryBySlug(slug: string): BookCategory | undefined {
  return bookCategories.find(category => category.slug === slug);
}
