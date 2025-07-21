"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (column: { title: string; badgeColor: string }) => void;
}

const COLUMN_COLORS = [
  { name: "Purple", value: "bg-spotlight-purple", preview: "bg-purple-500" },
  { name: "Pink", value: "bg-spotlight-pink", preview: "bg-pink-500" },
  { name: "Blue", value: "bg-spotlight-blue", preview: "bg-blue-500" },
  { name: "Green", value: "bg-spotlight-green", preview: "bg-green-500" },
  { name: "Yellow", value: "bg-spotlight-yellow", preview: "bg-yellow-500" },
  { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
  { name: "Gray", value: "bg-gray-500", preview: "bg-gray-500" }
];

export default function ColumnModal({ isOpen, onClose, onSave }: ColumnModalProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-spotlight-purple");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setSelectedColor("bg-spotlight-purple");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      badgeColor: selectedColor
    });

    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title.trim()) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-background-primary rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary font-display font-semibold text-xl">
            Add New Column
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Column Title */}
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Column Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter column title..."
              className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple"
              autoFocus
            />
          </div>

          {/* Column Color */}
          <div>
            <label className="block text-text-primary font-medium mb-3">
              Column Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLUMN_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? "border-spotlight-purple bg-background-secondary"
                      : "border-background-tertiary hover:border-text-tertiary"
                  }`}
                >
                  <div className={`w-8 h-4 rounded-full ${color.preview}`} />
                  <span className="text-xs text-text-secondary">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Preview
            </label>
            <div className="flex items-center justify-center p-4 bg-background-secondary rounded-lg">
              <div className="bg-background-primary rounded-lg p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedColor}`} />
                  <span className="text-text-primary font-medium text-sm">
                    {title || "Column Title"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-text-secondary hover:text-text-primary border border-background-tertiary hover:border-text-tertiary rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 px-4 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}