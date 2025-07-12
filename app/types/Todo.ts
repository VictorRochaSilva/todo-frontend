export interface Todo {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
}

export type FilterType = 'all' | 'pending' | 'completed';