'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="p-3 bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ops! Algo deu errado</h3>
            <p className="text-gray-600 text-center mb-4 max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw size={16} />
                    Tentar novamente
                </button>
            )}
        </div>
    );
};