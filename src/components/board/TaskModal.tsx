"use client";

import { useState, useEffect, useRef } from "react";
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
  assignees?: Array<{ name: string; color: string }>;
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
  const [selectedAssignees, setSelectedAssignees] = useState<Array<{ name: string; color: string }>>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        setTitle(task.title);
        setDescription(task.description);
        setSelectedIcon(task.icon || "FiCode");
        // Handle both old single assignee and new multiple assignees format
        if (task.assignees && task.assignees.length > 0) {
          setSelectedAssignees(task.assignees);
        } else if (task.assignee) {
          setSelectedAssignees([task.assignee]);
        } else {
          setSelectedAssignees([]);
        }
        setSelectedLabels(task.labels || []);
      } else {
        // Creating new task
        setTitle("");
        setDescription("");
        setSelectedIcon("FiCode");
        setSelectedAssignees([]);
        setSelectedLabels([]);
      }
    }
  }, [isOpen, task, members]);

  // Handle escape key
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

  const handleAssigneeToggle = (member: { name: string; color: string }) => {
    setSelectedAssignees(prev => {
      const isSelected = prev.some(assignee => assignee.name === member.name);
      if (isSelected) {
        return prev.filter(assignee => assignee.name !== member.name);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const taskData = {
      ...(task && { id: task.id }), // Include ID only if editing
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
      // Keep backward compatibility with single assignee
      assignee: selectedAssignees[0] || members[0],
      assignees: selectedAssignees,
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
      <div 
        className="fixed inset-0 modal-backdrop-dark flex items-center justify-center z-40 p-4"
        onClick={handleBackdropClick}
      >
        <div 
          ref={modalRef}
          className="bg-background-primary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden modal-enter shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-background-tertiary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-spotlight-purple/20 rounded-lg flex items-center justify-center">
                <div className="text-spotlight-purple">
                  {renderSelectedIcon()}
                </div>
              </div>
              <div>
                <h2 className="text-text-primary font-display font-semibold text-xl">
                  {task ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="text-text-secondary text-sm">
                  {task ? "Update task details and settings" : "Add a new task to your board"}
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
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
            {/* Left Column - Main Form */}
            <div className="flex-1 px-8 py-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-text-primary font-medium mb-3 text-sm">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a clear, descriptive title..."
                    className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-text-primary font-medium mb-3 text-sm">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the task, requirements, or additional context..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 resize-none transition-all duration-200"
                  />
                </div>

                {/* Icon and Labels Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Icon Selection */}
                  <div>
                    <label className="block text-text-primary font-medium mb-3 text-sm">
                      Task Icon
                    </label>
                    <button
                      onClick={() => setShowIconPicker(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary hover:border-spotlight-purple transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-spotlight-purple/10 rounded-md flex items-center justify-center text-spotlight-purple">
                        {renderSelectedIcon()}
                      </div>
                      <span className="flex-1 text-left">Select Icon</span>
                    </button>
                  </div>

                  {/* Labels */}
                  <div>
                    <label className="block text-text-primary font-medium mb-3 text-sm">
                      Labels
                    </label>
                    <button
                      onClick={() => setShowLabelPicker(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary hover:border-spotlight-purple transition-all duration-200"
                    >
                      <FiTag className="text-text-secondary" size={16} />
                      <span className="flex-1 text-left">
                        {selectedLabels.length > 0
                          ? `${selectedLabels.length} label${selectedLabels.length !== 1 ? 's' : ''} selected`
                          : "Add labels"
                        }
                      </span>
                    </button>
                  </div>
                </div>

                {/* Display selected labels */}
                {selectedLabels.length > 0 && (
                  <div>
                    <label className="block text-text-primary font-medium mb-3 text-sm">
                      Selected Labels
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedLabels.map((label) => (
                        <div
                          key={label.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-background-tertiary rounded-lg border border-background-tertiary"
                        >
                          <div className={`w-3 h-2 rounded-full ${label.color}`} />
                          <span className="text-text-secondary text-sm">{label.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Assignees and Actions */}
            <div className="w-full lg:w-80 bg-background-secondary/30 px-6 py-6 border-t lg:border-t-0 lg:border-l border-background-tertiary">
              <div className="space-y-6">
                {/* Assignees */}
                <div>
                  <label className="block text-text-primary font-medium mb-3 text-sm flex items-center gap-2">
                    <FiUser size={16} />
                    Assignees
                    {selectedAssignees.length > 0 && (
                      <span className="text-xs text-text-secondary">
                        ({selectedAssignees.length} selected)
                      </span>
                    )}
                  </label>
                  <div className="space-y-2">
                    {members.map((member) => {
                      const isSelected = selectedAssignees.some(assignee => assignee.name === member.name);
                      return (
                        <button
                          key={member.name}
                          onClick={() => handleAssigneeToggle(member)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? "bg-spotlight-purple/20 border-spotlight-purple text-text-primary shadow-sm"
                              : "bg-background-primary border-background-tertiary text-text-primary hover:border-spotlight-purple/50 hover:bg-background-secondary"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full bg-${member.color} flex items-center justify-center text-text-primary text-sm font-medium shadow-sm`}>
                            {member.name}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-text-secondary">Team Member</div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 bg-spotlight-purple rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Display selected assignees */}
                  {selectedAssignees.length > 0 && (
                    <div className="mt-4 p-3 bg-background-primary rounded-lg border border-background-tertiary">
                      <div className="text-xs text-text-secondary mb-2">Selected Assignees:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAssignees.map((assignee) => (
                          <div
                            key={assignee.name}
                            className="flex items-center gap-2 px-2 py-1 bg-background-secondary rounded-md"
                          >
                            <div className={`w-6 h-6 rounded-full bg-${assignee.color} flex items-center justify-center text-text-primary text-xs font-medium`}>
                              {assignee.name}
                            </div>
                            <span className="text-xs text-text-primary">{assignee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-background-tertiary">
                  <button
                    onClick={handleSave}
                    disabled={!title.trim()}
                    className="w-full px-4 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {task ? "Save Changes" : "Create Task"}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-3 text-text-secondary hover:text-text-primary border border-background-tertiary hover:border-text-tertiary rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
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