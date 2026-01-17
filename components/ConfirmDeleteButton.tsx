'use client';

import { Trash2 } from 'lucide-react';

interface ConfirmDeleteButtonProps {
    action: (formData: FormData) => void | Promise<void>;
    id: number | string;
    itemName?: string;
    buttonClass?: string;
    buttonStyle?: React.CSSProperties;
    iconSize?: number;
}

export default function ConfirmDeleteButton({
    action,
    id,
    itemName,
    buttonClass = "btn btn-outline",
    buttonStyle = {},
    iconSize = 14
}: ConfirmDeleteButtonProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const message = itemName
            ? `Are you sure you want to delete "${itemName}"?`
            : "Are you sure you want to delete this item?";

        if (!window.confirm(message)) {
            e.preventDefault();
        }
    };

    return (
        <form action={action} onSubmit={handleSubmit} style={{ display: 'inline' }}>
            <input type="hidden" name="id" value={id} />
            <button
                type="submit"
                className={buttonClass}
                style={{
                    padding: '0.4rem',
                    fontSize: '0.75rem',
                    ...buttonStyle
                }}
                title="Delete"
            >
                <Trash2 size={iconSize} />
            </button>
        </form>
    );
}
