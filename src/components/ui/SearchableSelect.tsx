import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Option {
    label: string;
    value: string;
}

export interface SearchableSelectProps {
    options: (Option | string)[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

export const SearchableSelect = forwardRef<HTMLDivElement, SearchableSelectProps>(
    ({ options, value, onChange, placeholder = "Select...", className, disabled, id }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");
        const containerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);

        // Normalize options to Option objects
        const normalizedOptions: Option[] = options.map(opt =>
            typeof opt === 'string' ? { label: opt, value: opt } : opt
        );

        const filteredOptions = normalizedOptions.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const selectedOption = normalizedOptions.find(opt => opt.value === value);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        useEffect(() => {
            if (isOpen && inputRef.current) {
                // Use a small timeout to ensure focus after animation/render
                const timer = setTimeout(() => {
                    inputRef.current?.focus();
                }, 50);
                return () => clearTimeout(timer);
            }
        }, [isOpen]);

        const handleSelect = (val: string) => {
            onChange(val);
            setIsOpen(false);
            setSearchTerm("");
        };

        return (
            <div className="relative w-full" ref={containerRef}>
                {/* Clickable input area */}
                <div
                    ref={ref}
                    id={id}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        "relative flex min-h-[48px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-base ring-offset-background transition-all cursor-pointer shadow-none",
                        className,
                        disabled && "cursor-not-allowed bg-gray-50 text-gray-500 shadow-none",
                        isOpen && "ring-2 ring-purple-500 border-transparent shadow-md"
                    )}
                >
                    <div className="flex items-center flex-1 min-w-0 overflow-hidden">
                        <span className={cn("truncate block", !selectedOption && "text-gray-400")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0", isOpen && "rotate-180")} />

                    {/* Dropdown list - Moved inside trigger for better alignment with custom widths/heights */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-xl outline-none overflow-hidden cursor-default min-w-[200px]"
                            >
                                <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="w-full bg-white pl-9 pr-8 py-2 text-sm border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500 outline-none border"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') setIsOpen(false);
                                                if (e.key === 'Enter' && filteredOptions.length > 0) {
                                                    handleSelect(filteredOptions[0].value);
                                                }
                                            }}
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                                            >
                                                <X className="h-3 w-3 text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="max-h-[250px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleSelect(option.value)}
                                                className={cn(
                                                    "px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between",
                                                    value === option.value
                                                        ? "bg-purple-50 text-purple-700 font-medium"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                )}
                                            >
                                                <span className="truncate">{option.label}</span>
                                                {value === option.value && (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                            No results found
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
);

SearchableSelect.displayName = "SearchableSelect";

export default SearchableSelect;
