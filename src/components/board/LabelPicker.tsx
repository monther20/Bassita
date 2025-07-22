"use client";

import { useState } from "react";
import { FiX, FiCheck, FiPlus } from "react-icons/fi";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelPickerProps {
  availableLabels: Label[];
  selectedLabels: Label[];
  onLabelsChange: (labels: Label[]) => void;
  onClose: () => void;
}

const LABEL_COLORS = [
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Gray", value: "bg-gray-500" }
];

export default function LabelPicker({ 
  availableLabels, 
  selectedLabels, 
  onLabelsChange, 
  onClose 
}: LabelPickerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-blue-500");

  const isLabelSelected = (labelId: string) => {
    return selectedLabels.some(label => label.id === labelId);
  };

  const toggleLabel = (label: Label) => {
    if (isLabelSelected(label.id)) {
      onLabelsChange(selectedLabels.filter(l => l.id !== label.id));
    } else {
      onLabelsChange([...selectedLabels, label]);
    }
  };

  const createNewLabel = () => {
    if (newLabelName.trim()) {
      const newLabel: Label = {
        id: `label-${Date.now()}`,
        name: newLabelName.trim(),
        color: newLabelColor
      };
      
      // Add to selected labels automatically
      onLabelsChange([...selectedLabels, newLabel]);
      
      // Reset form
      setNewLabelName("");
      setNewLabelColor("bg-blue-500");
      setShowCreateForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-primary rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-display font-semibold text-lg">
            Select Labels
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Labels List */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {availableLabels.map((label) => (
            <button
              key={label.id}
              onClick={() => toggleLabel(label)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <div className={`w-6 h-3 rounded-full ${label.color}`} />
              <span className="flex-1 text-left text-text-primary text-sm">
                {label.name}
              </span>
              {isLabelSelected(label.id) && (
                <FiCheck className="text-spotlight-purple" size={16} />
              )}
            </button>
          ))}
        </div>

        {/* Create New Label */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-text-tertiary rounded-lg hover:border-spotlight-purple text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiPlus size={16} />
            Create new label
          </button>
        ) : (
          <div className="space-y-3 p-3 bg-background-secondary rounded-lg">
            <input
              type="text"
              placeholder="Label name"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="w-full px-3 py-2 bg-background-tertiary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple"
              autoFocus
            />
            
            {/* Color Selection */}
            <div className="flex gap-2 flex-wrap">
              {LABEL_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setNewLabelColor(color.value)}
                  className={`w-8 h-4 rounded-full ${color.value} ${
                    newLabelColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-background-secondary" : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={createNewLabel}
                disabled={!newLabelName.trim()}
                className="px-3 py-1 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewLabelName("");
                  setNewLabelColor("bg-blue-500");
                }}
                className="px-3 py-1 text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-background-tertiary">
          <span className="text-text-secondary text-sm">
            {selectedLabels.length} label{selectedLabels.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/80 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}