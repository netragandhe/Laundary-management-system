// src/components/StatsCard.jsx
import React from 'react';

const ACCENTS = ['blue', 'emerald', 'violet', 'purple', 'cyan', 'rose'];

const StatsCard = ({ icon, label, value, change, changePositive, accent }) => {
  const IconComponent = icon;
  const changeColor = changePositive ? 'stats-change-positive text-emerald-500' : 'stats-change-negative text-rose-500';
  const accentClass = accent && ACCENTS.includes(accent) ? `stats-card--${accent}` : '';

  return (
    <div
      className={`stats-card bg-white border border-border flex items-center gap-2.5 p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentClass}`}
    >
      <div className="stats-card-icon inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 shadow-inner">
        {IconComponent && <IconComponent size={20} />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
        <h3 className="mt-1.5 text-2xl font-semibold text-primary">{value}</h3>
        {change && (
          <p className={`mt-1.5 text-xs font-medium ${changeColor}`}>
            {changePositive ? '▲' : '▼'} {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
