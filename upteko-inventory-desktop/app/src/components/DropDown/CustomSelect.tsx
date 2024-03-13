import React, { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.css";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    onSelect: (material: { sku: string; name: string }) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean; // Add disabled prop with optional boolean type
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect, disabled = false }) => {
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
        const { value, label } = option;
        const matches = label.match(/\[(.*?)\](.*)/); // Regex to capture text inside brackets
        if (matches && matches.length >= 3) {
            const sku = matches[1].trim();
            const name = matches[2].trim();
            onSelect({ sku, name });
            setSelectedOption(option);
            setIsOpen(false);
        } else {
            // If the label format doesn't match, fallback to using the whole label
            onSelect({ sku: value, name: label });
            setSelectedOption(option);
            setIsOpen(false);
        }
    };
    

    return (
        <div className={`${styles.customSelect} ${disabled ? styles.disabled : ''}`} ref={selectRef}>
            <div className={styles.selectedOption} onClick={!disabled ? handleToggleOpen : undefined}>
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
                                onClick={!disabled ? () => handleSelectOption(option) : undefined}
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
