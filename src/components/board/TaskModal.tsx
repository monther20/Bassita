"use client";

import { useState, useEffect } from "react";
import { FiX, FiUser, FiTag } from "react-icons/fi";
import * as Icons from "react-icons/fi";
import IconPicker from "./IconPicker";
import LabelPicker from "./LabelPicker";

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  assignee: { name: string; color: string };
  labels?: Label[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  task?: Task | null; // For editing
  availableLabels: Label[];
  members: Array<{ name: string; color: string }>;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  availableLabels,
  members
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FiCode");
  const [selectedAssignee, setSelectedAssignee] = useState(members[0] || null);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        setTitle(task.title);
        setDescription(task.description);
        setSelectedIcon(task.icon || "FiCode");
        setSelectedAssignee(task.assignee);
        setSelectedLabels(task.labels || []);
      } else {
        // Creating new task
        setTitle("");
        setDescription("");
        setSelectedIcon("FiCode");
        setSelectedAssignee(members[0] || null);
        setSelectedLabels([]);
      }
    }
  }, [isOpen, task, members]);

  const handleSave = () => {
    if (!title.trim()) return;

    const taskData = {
      ...(task && { id: task.id }), // Include ID only if editing
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
      assignee: selectedAssignee,
      labels: selectedLabels
    };

    onSave(taskData);
    onClose();
  };

  const renderSelectedIcon = () => {
    const IconComponent = (Icons as any)[selectedIcon];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-background-primary rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-text-primary font-display font-semibold text-xl">
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
                className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple resize-none"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Icon
              </label>
              <button
                onClick={() => setShowIconPicker(true)}
                className="flex items-center gap-3 px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary hover:border-spotlight-purple transition-colors"
              >
                <div className="text-text-secondary">
                  {renderSelectedIcon()}
                </div>
                <span>Select Icon</span>
              </button>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Labels
              </label>
              <button
                onClick={() => setShowLabelPicker(true)}
                className="flex items-center gap-3 px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary hover:border-spotlight-purple transition-colors w-full"
              >
                <FiTag className="text-text-secondary" size={16} />
                <span className="flex-1 text-left">
                  {selectedLabels.length > 0
                    ? `${selectedLabels.length} label${selectedLabels.length !== 1 ? 's' : ''} selected`
                    : "Select Labels"
                  }
                </span>
              </button>
              
              {/* Display selected labels */}
              {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLabels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center gap-2 px-2 py-1 bg-background-tertiary rounded-lg"
                    >
                      <div className={`w-3 h-2 rounded-full ${label.color}`} />
                      <span className="text-text-secondary text-xs">{label.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Assignee
              </label>
              <div className="space-y-2">
                {members.map((member) => (
                  <button
                    key={member.name}
                    onClick={() => setSelectedAssignee(member)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                      selectedAssignee?.name === member.name
                        ? "bg-spotlight-purple/20 border-spotlight-purple text-text-primary"
                        : "bg-background-secondary border-background-tertiary text-text-primary hover:border-spotlight-purple/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-${member.color} flex items-center justify-center text-text-primary text-sm font-medium`}>
                      {member.name}
                    </div>
                    <span>{member.name}</span>
                  </button>
                ))}
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
              {task ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showIconPicker && (
        <IconPicker
          selectedIcon={selectedIcon}
          onIconSelect={(iconName) => {
            setSelectedIcon(iconName);
            setShowIconPicker(false);
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}

      {showLabelPicker && (
        <LabelPicker
          availableLabels={availableLabels}
          selectedLabels={selectedLabels}
          onLabelsChange={setSelectedLabels}
          onClose={() => setShowLabelPicker(false)}
        />
      )}
    </>
  );
}