
import React, { useState, useEffect, useMemo } from 'react';
import { Note, Category } from './types';
import { CATEGORIES, STORAGE_KEY } from './constants';
import { summarizeNote } from './services/geminiService';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'همه'>('همه');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'همه' || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, searchQuery, selectedCategory]);

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...noteData, updatedAt: Date.now() } as Note : n));
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: noteData.title || 'بدون عنوان',
        content: noteData.content || '',
        category: noteData.category || 'سایر',
        isPinned: noteData.isPinned || false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setIsModalOpen(false);
    setEditingNote(undefined);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('آیا از حذف این یادداشت مطمئن هستید؟')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleAISummary = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note || !note.content) return;
    
    // Set loading state conceptually by updating note
    setNotes(prev => prev.map(n => n.id === id ? { ...n, aiSummary: 'در حال پردازش...' } : n));
    
    const summary = await summarizeNote(note.content);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, aiSummary: summary } : n));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-24 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass dark:bg-slate-800/80 px-4 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">یادداشت هوشمند</h1>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

        {/* Search & Categories */}
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="جستجو در بین یادداشت‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-3 rounded-2xl bg-white dark:bg-slate-700 border-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
            <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('همه')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === 'همه' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-500'}`}
            >
              همه
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-500'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">هیچ یادداشتی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={() => { setEditingNote(note); setIsModalOpen(true); }}
                onDelete={() => handleDeleteNote(note.id)}
                onTogglePin={() => handleTogglePin(note.id)}
                onSummarize={() => handleAISummary(note.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button 
        onClick={() => { setEditingNote(undefined); setIsModalOpen(true); }}
        className="fixed bottom-8 left-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-bounce-slow"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {isModalOpen && (
        <NoteModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingNote(undefined); }}
          onSave={handleSaveNote}
          initialData={editingNote}
        />
      )}
    </div>
  );
};

export default App;
