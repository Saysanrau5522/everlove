
import { useEffect, useState } from 'react';
import { BookOpen, Search, Tag } from 'lucide-react';
import { bookCategories } from '@/services/books-categories';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BookSidebarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const BookSidebar = ({ onSelectCategory, selectedCategory }: BookSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(bookCategories);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCategories(
        bookCategories.filter(cat => 
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(bookCategories);
    }
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit sticky top-4">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-love-medium" />
        <span>Book Categories</span>
      </h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search categories..."
          className="pl-8 py-1 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
        <button
          key="all"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
            selectedCategory === 'all' ? 'bg-love-light/20 text-love-deep' : 'hover:bg-gray-50'
          } text-left transition-colors`}
          onClick={() => onSelectCategory('all')}
        >
          <span className="flex items-center gap-2">
            <Tag className="h-3 w-3" />
            <span>All Categories</span>
          </span>
        </button>
        
        {filteredCategories.map(category => (
          <button
            key={category.id}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
              selectedCategory === category.slug ? 'bg-love-light/20 text-love-deep' : 'hover:bg-gray-50'
            } text-left transition-colors`}
            onClick={() => onSelectCategory(category.slug)}
          >
            <span className="flex items-center gap-2">
              <Tag className="h-3 w-3" />
              <span>{category.name}</span>
            </span>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookSidebar;
