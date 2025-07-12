'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Todo } from '../types/Todo';

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (todo: Omit<Todo, 'id'>) => void;
    todo?: Todo;
    title: string;
}

export const TodoModal: React.FC<TodoModalProps> = ({
    isOpen,
    onClose,
    onSave,
    todo,
    title
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        completed: false
    });

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title,
                description: todo.description || '',
                dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
                completed: todo.completed
            });
        } else {
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                completed: false
            });
        }
    }, [todo, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        onSave({
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            completed: formData.completed
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
                                Título *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Digite o título da tarefa"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                placeholder="Digite uma descrição (opcional)"
                            />
                        </div>

                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600 mb-1">
                                Data de Vencimento
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {todo && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="completed"
                                    checked={formData.completed}
                                    onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="completed" className="ml-2 block text-sm text-gray-600">
                                    Marcar como concluída
                                </label>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};