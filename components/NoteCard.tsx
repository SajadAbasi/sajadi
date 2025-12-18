
import React from 'react';
import { Note } from '../types';
import { CATEGORIES } from '../constants';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onSummarize: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin, onSummarize }) => {
  const categoryTheme = CATEGORIES.find(c => c.name === note.category) || CATEGORIES[4];
  const formattedDate = new Intl.DateTimeFormat('fa-IR', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(note.updatedAt);

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700/50 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryTheme.bg}`}>
          {note.category}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
            className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-300 hover:text-indigo-400'}`}
          >
            <svg className="w-5 h-5" fill={note.isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      <div onClick={onEdit} className="cursor-pointer flex-grow">
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white line-clamp-1">{note.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {note.content}
        </p>

        {note.aiSummary && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">خلاصه هوشمند</span>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 italic">
              {note.aiSummary}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-700 pt-4">
        <span className="text-[10px] text-slate-400 font-medium">{formattedDate}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onSummarize}
            title="خلاصه با هوش مصنوعی"
            className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
