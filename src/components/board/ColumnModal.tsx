"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiColumns } from "react-icons/fi";
import { BsPalette } from "react-icons/bs";


interface Column {
  id: string;
  title: string;
  badgeColor: string;
}

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: { title: string; badgeColor: string } | Column) => void;
  column?: Column | null; // For editing existing columns
}

const COLUMN_COLORS = [
  { name: "Purple", value: "bg-spotlight-purple", preview: "bg-purple-500", ring: "ring-purple-500" },
  { name: "Pink", value: "bg-spotlight-pink", preview: "bg-pink-500", ring: "ring-pink-500" },
  { name: "Blue", value: "bg-spotlight-blue", preview: "bg-blue-500", ring: "ring-blue-500" },
  { name: "Green", value: "bg-spotlight-green", preview: "bg-green-500", ring: "ring-green-500" },
  { name: "Yellow", value: "bg-spotlight-yellow", preview: "bg-yellow-500", ring: "ring-yellow-500" },
  { name: "Red", value: "bg-red-500", preview: "bg-red-500", ring: "ring-red-500" },
  { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500", ring: "ring-orange-500" },
  { name: "Gray", value: "bg-gray-500", preview: "bg-gray-500", ring: "ring-gray-500" }
];

export default function ColumnModal({ isOpen, onClose, onSave, column }: ColumnModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-spotlight-purple");
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens or load existing column data
  useEffect(() => {
    if (isOpen) {
      if (column) {
        // Editing existing column
        setTitle(column.title);
        setSelectedColor(column.badgeColor);
      } else {
        // Creating new column
        setTitle("");
        setSelectedColor("bg-spotlight-purple");
      }
    }
  }, [isOpen, column]);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const columnData = {
      title: title.trim(),
      badgeColor: selectedColor,
      ...(column && { id: column.id }) // Include ID only if editing
    };

    onSave(columnData);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title.trim()) {
      handleSave();
    }
  };

  const getSelectedColorData = () => {
    return COLUMN_COLORS.find(color => color.value === selectedColor) || COLUMN_COLORS[0];
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 modal-backdrop-dark flex items-center justify-center z-40 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-background-primary rounded-2xl w-full max-w-2xl modal-enter shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-background-tertiary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spotlight-purple/20 rounded-lg flex items-center justify-center">
              <FiColumns className="text-spotlight-purple" size={20} />
            </div>
            <div>
              <h2 className="text-text-primary font-display font-semibold text-xl">
                {column ? "Edit Column" : "Create New Column"}
              </h2>
              <p className="text-text-secondary text-sm">
                {column ? "Update column title and color" : "Add a new column to organize your tasks"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="space-y-6">
              {/* Column Title */}
              <div>
                <label className="block text-text-primary font-medium mb-3 text-sm">
                  Column Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., To Do, In Progress, Review, Done..."
                  className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                  autoFocus
                />
              </div>

              {/* Column Color */}
              <div>
                <label className="block text-text-primary font-medium mb-4 text-sm flex items-center gap-2">
                  <BsPalette size={16} />
                  Column Color
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {COLUMN_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:bg-background-secondary ${selectedColor === color.value
                        ? "bg-background-secondary ring-2 ring-spotlight-purple"
                        : "hover:scale-105"
                        }`}
                      title={color.name}
                    >
                      <div className={`w-8 h-6 rounded-md ${color.preview} shadow-sm transition-all duration-200 ${selectedColor === color.value ? 'ring-2 ring-white/50' : ''
                        }`} />
                      <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                        {color.name}
                      </span>
                      {selectedColor === color.value && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-spotlight-purple rounded-full shadow-sm"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 py-6 border-t border-background-tertiary">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-text-secondary hover:text-text-primary border border-background-tertiary hover:border-text-tertiary rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 px-6 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {column ? "Save Changes" : "Create Column"}
          </button>
        </div>
      </div>
    </div>
  );
}