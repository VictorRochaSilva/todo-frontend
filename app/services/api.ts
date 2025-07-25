// services/api.ts
import axios from 'axios';

export interface TasksFilters {
    page?: number;
    limit?: number;
    completed?: boolean;
    search?: string;
    dueDateFrom?: string; // yyyy-mm-dd
    dueDateTo?: string;   // yyyy-mm-dd
}

export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
}

export interface GetTasksResponse {
    tasks: Todo[];
    pagination: Pagination;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    dueDate?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    dueDate?: string;
    completed?: boolean;
}

function toLocalISOString(dateInput: string | Date): string {
    let date: Date;

    if (typeof dateInput === 'string') {
        const [year, month, day] = dateInput.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        throw new Error('Invalid date input');
    }

    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString();
}


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const tasksApi = {


    async getTasks(filters: TasksFilters): Promise<GetTasksResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.completed !== undefined) params.append('completed', String(filters.completed));
        if (filters.search) params.append('search', filters.search);
        if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
        if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);

        const response = await axios.get<GetTasksResponse>(`${API_BASE}/tasks?${params.toString()}`);
        return response.data;
    },

    // Outros métodos, por exemplo:
    async createTask(data: CreateTaskData) {
        const fixedData = {
            ...data,
            dueDate: data.dueDate ? toLocalISOString(data.dueDate) : undefined,
        };

        const response = await axios.post<Todo>(`${API_BASE}/tasks`, fixedData);
        return response.data;
    },

    async updateTask(id: string, data: UpdateTaskData) {
        const fixedData = {
            ...data,
            dueDate: data.dueDate ? toLocalISOString(data.dueDate) : undefined,
        };

        const response = await axios.patch<Todo>(`${API_BASE}/tasks/${id}`, fixedData);
        return response.data;
    },

    async deleteTask(id: string) {
        await axios.delete(`${API_BASE}/tasks/${id}`);
    }
};
