'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { FilterType } from './types/Todo';
import { TodoModal } from './components/TodoModal';
import { TodoCard } from './components/TodoCard';
import { FilterTabs } from './components/FilterTabs';
import { Pagination } from './components/Pagination';
import { ConfirmModal } from './components/ConfirmModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useTasks } from './hooks/useTasks';

function App() {
  const {
    todos,
    loading,
    error,
    currentPage,
    itemsPerPage,
    pagination,
    counts,
    currentFilter,
    searchText,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    applyFilter,
    applySearch,
    changePage,
    changeItemsPerPage,
    refetch,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    todoId: string;
    todoTitle: string;
  }>({
    isOpen: false,
    todoId: '',
    todoTitle: '',
  });

  const [searchInput, setSearchInput] = useState(searchText);

  // Quando o filtro mudar, resetar o input da busca local pra ficar sincronizado
  useEffect(() => {
    setSearchInput(searchText);
  }, [searchText]);

  // Debounce para busca
  useEffect(() => {
    const handler = setTimeout(() => {
      // Só aplica busca se o valor do input for diferente do hook
      if (searchInput !== searchText) {
        applySearch(searchInput);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, applySearch, searchText]);

  const handleFilterChange = async (newFilter: FilterType) => {
    setSearchInput(''); // limpa o campo local para ficar sincronizado com o hook
    await applyFilter(newFilter);
  };

  const handleCreateTodo = async (todoData: any) => {
    const success = await createTask({
      title: todoData.title,
      description: todoData.description,
      dueDate: todoData.dueDate,
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
      completed: todoData.completed,
    });

    if (success) {
      setEditingTodo(undefined);
      setIsModalOpen(false);
    }
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setConfirmDelete({
      isOpen: true,
      todoId: id,
      todoTitle: todo.title,
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
    <div className="min-h-screen bg-blue-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-500 rounded-lg">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">To-Do</h1>
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
          <FilterTabs activeFilter={currentFilter} onFilterChange={handleFilterChange} counts={counts} />
        </div>

        {/* Search input */}
        {pagination?.totalTasks > 0 && (
          <div className="mb-6 w-full max-w-full">
            <label htmlFor="search" className="block mb-1 text-gray-700 font-semibold">
              Buscar por título
            </label>
            <input
              id="search"
              type="text"
              placeholder="Digite para buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}



        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentFilter === 'pending'
                  ? 'Nenhuma tarefa pendente'
                  : currentFilter === 'completed'
                    ? 'Nenhuma tarefa concluída'
                    : 'Nenhuma tarefa encontrada'}
              </h3>
              <p className="text-gray-500">{currentFilter === 'all' && 'Comece criando sua primeira tarefa!'}</p>
            </div>
          ) : (
            todos.map((todo) => (
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

        {/* Pagination */}
        {pagination?.totalTasks > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages}
            totalItems={pagination?.totalTasks}
            itemsPerPage={itemsPerPage}
            onPageChange={changePage}
            onItemsPerPageChange={changeItemsPerPage}
          />
        )}
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
