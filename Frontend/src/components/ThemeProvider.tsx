import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'minimal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Changed default to dark

  const themes = [
    { value: 'light' as Theme, label: 'Light', description: 'Clean and bright' },
    { value: 'dark' as Theme, label: 'Dark', description: 'Easy on the eyes' },
    { value: 'minimal' as Theme, label: 'Minimal', description: 'Less is more' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      setTheme(savedTheme);
    } else {
      // If no saved theme, default to dark and save it
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
    
    // Also set the class immediately on the body for better initial rendering
    document.body.className = theme;
  }, [theme]);

  // Set initial theme class on mount to prevent flash
  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = theme;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}