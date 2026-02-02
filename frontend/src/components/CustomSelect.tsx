import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export interface CustomSelectProps<T> {
    options: T[]
    value: string
    onChange: (value: string) => void
    labelKey: keyof T
    valueKey: keyof T
    placeholder: string
    icon?: React.ReactNode
    disabled?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function CustomSelect<T>({
    options,
    value,
    onChange,
    labelKey,
    valueKey,
    placeholder,
    icon,
    disabled,
    className = '',
    size = 'md'
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = options.find(opt => String(opt[valueKey]) === value)

    const sizeClasses = {
        sm: 'py-1.5 px-3 rounded-lg text-xs pl-8 pr-7',
        md: 'py-3.5 px-4 rounded-2xl text-sm pl-12 pr-10',
        lg: 'py-4 px-5 rounded-[1.5rem] text-base pl-14 pr-12'
    }

    const iconClasses = {
        sm: 'left-2.5 w-4 h-4',
        md: 'left-4 w-5 h-5',
        lg: 'left-5 w-6 h-6'
    }

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border border-slate-200 flex items-center justify-between transition-all outline-none text-left
          ${sizeClasses[size]}
          ${isOpen ? 'ring-4 ring-[#2b8cee]/10 border-[#2b8cee] bg-white' : 'hover:border-slate-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                {icon && (
                    <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${iconClasses[size]}`}>
                        {icon}
                    </div>
                )}
                <span className={`block truncate ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    {selectedOption ? String(selectedOption[labelKey]) : placeholder}
                </span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronRight className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.ul
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-2xl py-2 max-h-60 overflow-auto outline-none"
                        >
                            {options.length === 0 ? (
                                <li className="px-4 py-8 text-center text-slate-400 text-sm italic">Không có dữ liệu</li>
                            ) : (
                                options.map((opt, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            onChange(String(opt[valueKey]))
                                            setIsOpen(false)
                                        }}
                                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                      ${String(opt[valueKey]) === value ? 'bg-[#2b8cee]/5 text-[#2b8cee] font-bold' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                                    >
                                        {String(opt[labelKey])}
                                        {String(opt[valueKey]) === value && <div className="w-1.5 h-1.5 rounded-full bg-[#2b8cee]" />}
                                    </li>
                                ))
                            )}
                        </motion.ul>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
