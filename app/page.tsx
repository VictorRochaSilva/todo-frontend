'use client';

import React, { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { FilterType } from './types/Todo';
import { TodoModal } from './components/TodoModal';
import { TodoCard } from './components/TodoCard';
import { FilterTabs } from './components/FilterTabs';
import { ConfirmModal } from './components/ConfirmModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useTasks } from './hooks/useTasks';

function App() {
  const {
    todos,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    filterTasks,
    getCounts,
    refetch
  } = useTasks();

  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    todoId: string;
    todoTitle: string;
  }>({
    isOpen: false,
    todoId: '',
    todoTitle: ''
  });

  const filteredTodos = filterTasks(filter);
  const counts = getCounts();

  const handleCreateTodo = async (todoData: any) => {
    const success = await createTask({
      title: todoData.title,
      description: todoData.description,
      dueDate: todoData.dueDate
    });

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleEditTodo = async (todoData: any) => {
    if (!editingTodo) return;

    const success = await updateTask(editingTodo.id, {
      title: todoData.title,
      description: todoData.description,
      dueDate: todoData.dueDate,
      completed: todoData.completed
    });

    if (success) {
      setEditingTodo(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setConfirmDelete({
      isOpen: true,
      todoId: id,
      todoTitle: todo.title
    });
  };

  const confirmDeleteTodo = async () => {
    const success = await deleteTask(confirmDelete.todoId);
    if (success) {
      setConfirmDelete({ isOpen: false, todoId: '', todoTitle: '' });
    }
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskComplete(id);
  };

  const openCreateModal = () => {
    setEditingTodo(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: any) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-500">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-500 rounded-lg">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">To-Do System</h1>
          </div>
          <p className="text-gray-500">Organize suas tarefas de forma simples e eficiente</p>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'pending' ? 'Nenhuma tarefa pendente' :
                  filter === 'completed' ? 'Nenhuma tarefa concluída' :
                    'Nenhuma tarefa encontrada'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' && 'Comece criando sua primeira tarefa!'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={openEditModal}
                onDelete={handleDeleteTodo}
                onToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingTodo ? handleEditTodo : handleCreateTodo}
        todo={editingTodo}
        title={editingTodo ? 'Editar Tarefa' : 'Nova Tarefa'}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, todoId: '', todoTitle: '' })}
        onConfirm={confirmDeleteTodo}
        title="Excluir Tarefa"
        message={`Tem certeza que deseja excluir a tarefa "${confirmDelete.todoTitle}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}

export default App;