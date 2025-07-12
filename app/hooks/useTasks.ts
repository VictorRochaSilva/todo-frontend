import { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '../types/Todo';
import { tasksApi, TasksFilters, CreateTaskData, UpdateTaskData } from '../services/api';

export const useTasks = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchTasks = useCallback(async (filters: TasksFilters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await tasksApi.getTasks({
                page: 1,
                limit: 100, // Buscar todas as tarefas para simplicidade
                ...filters
            });

            // Converter strings de data para objetos Date
            const tasksWithDates = response.tasks.map(task => ({
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined
            }));

            setTodos(tasksWithDates);
            setPagination({
                page: response.page,
                totalPages: response.totalPages,
                total: response.total
            });
        } catch (err) {
            setError('Erro ao carregar tarefas. Verifique se a API está rodando.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = async (data: CreateTaskData): Promise<boolean> => {
        try {
            setError(null);
            const newTask = await tasksApi.createTask(data);

            // Converter data se existir
            const taskWithDate = {
                ...newTask,
                dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
            };

            setTodos(prev => [taskWithDate, ...prev]);
            return true;
        } catch (err) {
            setError('Erro ao criar tarefa');
            console.error('Error creating task:', err);
            return false;
        }
    };

    const updateTask = async (id: string, data: UpdateTaskData): Promise<boolean> => {
        try {
            setError(null);
            const updatedTask = await tasksApi.updateTask(id, data);

            // Converter data se existir
            const taskWithDate = {
                ...updatedTask,
                dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined
            };

            setTodos(prev => prev.map(task =>
                task.id === id ? taskWithDate : task
            ));
            return true;
        } catch (err) {
            setError('Erro ao atualizar tarefa');
            console.error('Error updating task:', err);
            return false;
        }
    };

    const deleteTask = async (id: string): Promise<boolean> => {
        try {
            setError(null);
            await tasksApi.deleteTask(id);
            setTodos(prev => prev.filter(task => task.id !== id));
            return true;
        } catch (err) {
            setError('Erro ao excluir tarefa');
            console.error('Error deleting task:', err);
            return false;
        }
    };

    const toggleTaskComplete = async (id: string): Promise<boolean> => {
        const task = todos.find(t => t.id === id);
        if (!task) return false;

        return updateTask(id, { completed: !task.completed });
    };

    const filterTasks = (filter: FilterType): Todo[] => {
        switch (filter) {
            case 'pending':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };

    const getCounts = () => ({
        all: todos.length,
        pending: todos.filter(todo => !todo.completed).length,
        completed: todos.filter(todo => todo.completed).length
    });

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        todos,
        loading,
        error,
        pagination,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        filterTasks,
        getCounts,
        refetch: fetchTasks
    };
};