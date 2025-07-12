'use client';

import React from 'react';
import { FilterType } from '../types/Todo';

interface FilterTabsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    counts: {
        all: number;
        pending: number;
        completed: number;
    };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    activeFilter,
    onFilterChange,
    counts
}) => {
    const tabs = [
        { key: 'all' as FilterType, label: 'Todas', count: counts.all },
        { key: 'pending' as FilterType, label: 'Pendentes', count: counts.pending },
        { key: 'completed' as FilterType, label: 'Concluídas', count: counts.completed }
    ];

    return (
        <div className="flex bg-blue-200 rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onFilterChange(tab.key)}
                    className={`
    flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
    ${activeFilter === tab.key
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                        }
  `}
                >
                    {tab.label}
                    <span className={`
    ml-1 px-1.5 py-0.5 rounded-full text-xs
    ${activeFilter === tab.key
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-200 text-gray-600'
                        }
  `}>
                        {tab.count}
                    </span>
                </button>

            ))}
        </div>
    );
};