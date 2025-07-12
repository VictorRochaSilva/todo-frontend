import { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '../types/Todo';
import { tasksApi, TasksFilters, CreateTaskData, UpdateTaskData } from '../services/api';

export const useTasks = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0,
    });
    const [counts, setCounts] = useState({
        all: 0,
        pending: 0,
        completed: 0,
    });

    const fetchCounts = useCallback(async () => {
        try {
            const [allTasks, pendingTasks, completedTasks] = await Promise.all([
                tasksApi.getTasks({ limit: 1 }),
                tasksApi.getTasks({ limit: 1, completed: false }),
                tasksApi.getTasks({ limit: 1, completed: true }),
            ]);
            setCounts({
                all: allTasks.pagination.totalTasks,
                pending: pendingTasks.pagination.totalTasks,
                completed: completedTasks.pagination.totalTasks,
            });
        } catch (err) {
            console.error('Error fetching counts:', err);
        }
    }, []);

    const getFiltersForCurrentFilter = useCallback((): TasksFilters => {
        const filters: TasksFilters = {};
        if (currentFilter === 'pending') filters.completed = false;
        else if (currentFilter === 'completed') filters.completed = true;

        if (searchText.trim()) filters.search = searchText.trim();

        return filters;
    }, [currentFilter, searchText]);

    const fetchTasks = useCallback(
        async (filters: TasksFilters = {}, resetPage = false) => {
            try {
                setLoading(true);
                setError(null);

                const page = resetPage ? 1 : currentPage;
                if (resetPage) setCurrentPage(1);

                const response = await tasksApi.getTasks({
                    page,
                    limit: itemsPerPage,
                    ...filters,
                });

                setTodos(response.tasks);

                setPagination({
                    currentPage: Number(response.pagination.currentPage),
                    totalPages: Number(response.pagination.totalPages),
                    totalTasks: Number(response.pagination.totalTasks),
                });

                await fetchCounts();
            } catch (err) {
                setError('Erro ao carregar tarefas. Verifique se a API está rodando.');
                console.error('Error fetching tasks:', err);
            } finally {
                setLoading(false);
            }
        },
        [currentPage, itemsPerPage, fetchCounts]
    );

    const applyFilter = useCallback(
        async (filter: FilterType) => {
            setCurrentFilter(filter);
            setSearchText(''); // resetando busca ao mudar filtro
            setCurrentPage(1);

            const filters: TasksFilters = {};
            if (filter === 'pending') filters.completed = false;
            else if (filter === 'completed') filters.completed = true;

            await fetchTasks(filters, true);
        },
        [fetchTasks]
    );

    const applySearch = useCallback(
        async (text: string) => {
            setSearchText(text);
            setCurrentPage(1);

            const filters = getFiltersForCurrentFilter();

            await fetchTasks(filters, true);
        },
        [fetchTasks, getFiltersForCurrentFilter]
    );

    const changePage = useCallback(
        async (page: number) => {
            setCurrentPage(page);
            const filters = getFiltersForCurrentFilter();
            await fetchTasks(filters);
        },
        [fetchTasks, getFiltersForCurrentFilter]
    );

    const changeItemsPerPage = useCallback(
        async (newItemsPerPage: number) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
            const filters = getFiltersForCurrentFilter();
            await fetchTasks(filters, true);
        },
        [fetchTasks, getFiltersForCurrentFilter]
    );

    useEffect(() => {
        fetchTasks(getFiltersForCurrentFilter(), false);
    }, [fetchTasks, getFiltersForCurrentFilter]);

    return {
        todos,
        loading,
        error,
        currentPage,
        itemsPerPage,
        pagination,
        counts,
        currentFilter,
        searchText,
        createTask: async (data: CreateTaskData) => {
            try {
                setError(null);
                await tasksApi.createTask(data);
                await fetchTasks(getFiltersForCurrentFilter(), true);
                return true;
            } catch (err) {
                setError('Erro ao criar tarefa');
                console.error('Error creating task:', err);
                return false;
            }
        },
        updateTask: async (id: string, data: UpdateTaskData) => {
            try {
                setError(null);
                await tasksApi.updateTask(id, data);
                await fetchTasks(getFiltersForCurrentFilter());
                return true;
            } catch (err) {
                setError('Erro ao atualizar tarefa');
                console.error('Error updating task:', err);
                return false;
            }
        },
        deleteTask: async (id: string) => {
            try {
                setError(null);
                await tasksApi.deleteTask(id);
                await fetchTasks(getFiltersForCurrentFilter());
                return true;
            } catch (err) {
                setError('Erro ao excluir tarefa');
                console.error('Error deleting task:', err);
                return false;
            }
        },
        toggleTaskComplete: async (id: string) => {
            const task = todos.find((t) => t.id === id);
            if (!task) return false;
            try {
                setError(null);
                await tasksApi.updateTask(id, { completed: !task.completed });
                await fetchTasks(getFiltersForCurrentFilter());
                return true;
            } catch {
                return false;
            }
        },
        applyFilter,
        applySearch,
        changePage,
        changeItemsPerPage,
        refetch: fetchTasks,
    };
};
