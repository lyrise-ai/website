import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const ArrowButton = ({ children = "", onClick = () => { }, className }) => {
    return (
        <button
            className={`bg-primary hover:bg-blue-700 p-2 px-4 hover:px-6 font-secondary rounded-lg text-white text-xl lg:text-2xl font-medium w-fit transition-all duration-200 flex items-center justify-center group ${className || ''}`}
            onClick={onClick}
        >
            <span className="mr-2">{children}</span>
            <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-2.5" />
        </button>
    );
};

export default ArrowButton;
