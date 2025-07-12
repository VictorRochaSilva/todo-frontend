import axios from 'axios';
import { Todo } from '../types/Todo';

const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export interface TasksResponse {
    tasks: Todo[];
    total: number;
    page: number;
    totalPages: number;
}

export interface TasksFilters {
    page?: number;
    limit?: number;
    completed?: boolean;
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    dueDate?: Date;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    dueDate?: Date;
    completed?: boolean;
}

export const tasksApi = {
    // Listar tarefas com filtros
    getTasks: async (filters: TasksFilters = {}): Promise<TasksResponse> => {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.completed !== undefined) params.append('completed', filters.completed.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
        if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);

        const response = await api.get(`/tasks?${params.toString()}`);
        return response.data;
    },

    // Criar nova tarefa
    createTask: async (data: CreateTaskData): Promise<Todo> => {
        const response = await api.post('/tasks', data);
        return response.data;
    },

    // Atualizar tarefa
    updateTask: async (id: string, data: UpdateTaskData): Promise<Todo> => {
        const response = await api.patch(`/tasks/${id}`, data);
        return response.data;
    },

    // Deletar tarefa
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};

export default api;