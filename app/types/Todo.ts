export interface Todo {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    completed: boolean;
}

export type FilterType = 'all' | 'pending' | 'completed';