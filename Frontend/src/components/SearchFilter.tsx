import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedTech: string[];
  onTechChange: (tech: string[]) => void;
  technologies: string[];
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedTech,
  onTechChange,
  technologies
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleTechnology = (tech: string) => {
    if (selectedTech.includes(tech)) {
      onTechChange(selectedTech.filter(t => t !== tech));
    } else {
      onTechChange([...selectedTech, tech]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onTechChange([]);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || selectedTech.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => onSearchChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Categories */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Category: {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onCategoryChange(category)}
                className={selectedCategory === category ? 'bg-accent' : ''}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Technology Filter */}
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Technologies
              {selectedTech.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTech.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-4" align="start">
            <div className="space-y-2">
              <div className="font-medium text-sm mb-3">Select Technologies</div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {technologies.map((tech) => (
                  <label
                    key={tech}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTech.includes(tech)}
                      onChange={() => toggleTechnology(tech)}
                      className="rounded border-input"
                    />
                    <span className="text-sm">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedTech.length > 0 || searchTerm) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {searchTerm && (
            <Badge variant="secondary" className="gap-2">
              Search: "{searchTerm}"
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onSearchChange('')}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedTech.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-2">
              {tech}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleTechnology(tech)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}