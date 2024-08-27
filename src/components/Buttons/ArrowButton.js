import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const ArrowButton = ({
    children = "",
    onClick = () => { },
    className = "",
    variant = "default",
    showArrow = false
}) => {
    const getButtonStyles = () => {
        switch (variant) {
            case "bordered":
                return "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white";
            case "white":
                return "bg-white text-primary hover:bg-gray-100";
            case "link":
                return "bg-transparent text-primary hover:text-blue-700 underline";
            default:
                return "bg-primary text-white hover:bg-blue-700";
        }
    };

    return (
        <button
            className={`
                p-2 px-4 hover:px-6 font-secondary rounded-lg text-lg lg:text-xl font-medium w-fit transition-all duration-200 flex items-center justify-center group 
                ${getButtonStyles()} 
                ${className}
            `}
            onClick={onClick}
        >
            <span className={`${showArrow ? "mr-2" : ""}`}>{children}</span>
            {showArrow && (
                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-2.5" />
            )}
        </button>
    );
};

export default ArrowButton;
