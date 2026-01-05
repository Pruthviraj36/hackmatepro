'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import skillsData from '@/skills.json';

interface Skill {
    name: string;
    category: string;
}

interface SkillPickerProps {
    selectedSkills: { name: string; proficiency: 'Basic' | 'Intermediate' | 'Expert' }[];
    onAddSkill: (skillName: string) => void;
    onRemoveSkill: (skillName: string) => void;
}

export function SkillPicker({ selectedSkills, onAddSkill, onRemoveSkill }: SkillPickerProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredSkills = skillsData.filter((skill: Skill) =>
        skill.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedSkills.find((s) => s.name === skill.name)
    ).slice(0, 8);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="w-4 h-4" />
                </span>
                <input
                    type="text"
                    className="input-base pl-10"
                    placeholder="Search for skills (e.g. React, Rust...)"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            <AnimatePresence>
                {isOpen && query.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
                    >
                        {filteredSkills.length > 0 ? (
                            <div className="p-1">
                                {filteredSkills.map((skill) => (
                                    <button
                                        key={skill.name}
                                        onClick={() => {
                                            onAddSkill(skill.name);
                                            setQuery('');
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left"
                                    >
                                        <span>{skill.name}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {skill.category}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                                No matching skills found
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
