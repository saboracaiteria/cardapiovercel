import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'gradient' | 'secondary' | 'danger' | 'success';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'gradient', fullWidth = false, className = '', ...props }) => {
    const baseStyles = "font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
    
    const variants = {
        gradient: "bg-gradient-to-r from-yellow-500 via-red-500 to-pink-600 text-white hover:opacity-90 shadow-lg",
        secondary: "bg-gray-700 text-white hover:bg-gray-600",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;