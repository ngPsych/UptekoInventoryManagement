import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.css";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            selectRef.current &&
            !selectRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (option: Option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className={styles.customSelect} ref={selectRef}>
        <div className={styles.selectedOption} onClick={handleToggleOpen}>
            {selectedOption ? selectedOption.label : "Select an option"}
        </div>
        {isOpen && (
            <div className={styles.optionsContainer}>
            <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <ul className={styles.optionsList}>
                {filteredOptions.map(option => (
                <li
                    key={option.value}
                    className={styles.option}
                    onClick={() => handleSelectOption(option)}
                >
                    {option.label}
                </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default CustomSelect;
