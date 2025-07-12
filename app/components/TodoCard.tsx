'use client';

import React from 'react';
import { Edit2, Trash2, Calendar, CheckCircle, Circle } from 'lucide-react';
import { Todo } from '../types/Todo';

interface TodoCardProps {
    todo: Todo;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onToggleComplete: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
    todo,
    onEdit,
    onDelete,
    onToggleComplete
}) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
        <div className={`
      bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-200
      ${todo.completed ? 'opacity-75 bg-gray-50' : ''}
      ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}
    `}>
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onToggleComplete(todo.id)}
                    className={`
            mt-1 transition-colors duration-200
            ${todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}
          `}
                >
                    {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`
            font-medium text-gray-900 mb-1
            ${todo.completed ? 'line-through text-gray-500' : ''}
          `}>
                        {todo.title}
                    </h3>

                    {todo.description && (
                        <p className={`
              text-sm text-gray-600 mb-2
              ${todo.completed ? 'line-through text-gray-400' : ''}
            `}>
                            {todo.description}
                        </p>
                    )}

                    {todo.dueDate && (
                        <div className={`
              flex items-center gap-1 text-xs
              ${isOverdue ? 'text-red-600' : todo.completed ? 'text-gray-400' : 'text-gray-500'}
            `}>
                            <Calendar size={12} />
                            <span>{formatDate(todo.dueDate)}</span>
                            {isOverdue && <span className="font-medium">(Atrasada)</span>}
                        </div>
                    )}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(todo)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar tarefa"
                    >
                        <Edit2 size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir tarefa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};