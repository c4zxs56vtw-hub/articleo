import React from 'react';
import { Database } from 'lucide-react';

export const EmptyState = ({
  title = "Aucune donnée trouvée",
  description = "Nous n'avons trouvé aucun élément correspondant à vos critères.",
  icon: Icon = Database,
  actionButton = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
