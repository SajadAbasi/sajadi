
import React, { useState, useEffect } from 'react';
import { Note, Category } from '../types';
import { CATEGORIES } from '../constants';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Note>) => void;
  initialData?: Note;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'سایر');
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
      setIsPinned(initialData.isPinned);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content, category, isPinned });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="px-8 pt-8 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'ویرایش یادداشت' : 'یادداشت جدید'}
            </h2>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-8 py-4 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mr-1">عنوان</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="چیزی بنویسید..."
                className="w-full text-xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 dark:text-white"
                autoFocus
              />
            </div>

            <div className="flex gap-2 items-center">
              <button 
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isPinned ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
              >
                <svg className="w-4 h-4" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isPinned ? 'سنجاق شده' : 'سنجاق کردن'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3 mr-1">دسته‌بندی</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${category === cat.name ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-800 scale-105' : 'opacity-60'} ${cat.bg}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mr-1">متن یادداشت</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="جزئیات یادداشت را اینجا بنویسید..."
                rows={8}
                className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 dark:text-slate-300 leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="p-8">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all active:scale-95"
            >
              {initialData ? 'بروزرسانی تغییرات' : 'ذخیره یادداشت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
