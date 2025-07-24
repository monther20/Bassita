"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FirestoreTemplate } from '@/types/firestore';

// Modal state interfaces
interface TemplatePreviewModalState {
  isOpen: boolean;
  template: FirestoreTemplate | null;
}

interface TaskModalState {
  isOpen: boolean;
  task?: any | null;
  availableLabels: any[];
  members: Array<{ name: string; color: string }>;
  onSave: (task: any) => void;
  onDelete?: (taskId: string) => void;
}

interface ColumnModalState {
  isOpen: boolean;
  column?: any | null;
  onSave: (column: any) => void;
}

interface CreateBoardModalState {
  isOpen: boolean;
  workspaceId?: string;
}

interface CreateWorkspaceModalState {
  isOpen: boolean;
}

interface CreateOrganizationModalState {
  isOpen: boolean;
}

// Context interface
interface ModalContextType {
  // Template Preview Modal
  templatePreviewModal: TemplatePreviewModalState;
  openTemplatePreviewModal: (template: FirestoreTemplate) => void;
  closeTemplatePreviewModal: () => void;

  // Task Modal
  taskModal: TaskModalState;
  openTaskModal: (params: {
    task?: any | null;
    availableLabels: any[];
    members: Array<{ name: string; color: string }>;
    onSave: (task: any) => void;
    onDelete?: (taskId: string) => void;
  }) => void;
  closeTaskModal: () => void;

  // Column Modal
  columnModal: ColumnModalState;
  openColumnModal: (params: {
    column?: any | null;
    onSave: (column: any) => void;
  }) => void;
  closeColumnModal: () => void;

  // Create Board Modal
  createBoardModal: CreateBoardModalState;
  openCreateBoardModal: (workspaceId?: string) => void;
  closeCreateBoardModal: () => void;

  // Create Workspace Modal
  createWorkspaceModal: CreateWorkspaceModalState;
  openCreateWorkspaceModal: () => void;
  closeCreateWorkspaceModal: () => void;

  // Create Organization Modal
  createOrganizationModal: CreateOrganizationModalState;
  openCreateOrganizationModal: () => void;
  closeCreateOrganizationModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [templatePreviewModal, setTemplatePreviewModal] = useState<TemplatePreviewModalState>({
    isOpen: false,
    template: null,
  });

  const [taskModal, setTaskModal] = useState<TaskModalState>({
    isOpen: false,
    task: null,
    availableLabels: [],
    members: [],
    onSave: () => { },
    onDelete: undefined,
  });

  const [columnModal, setColumnModal] = useState<ColumnModalState>({
    isOpen: false,
    column: null,
    onSave: () => { },
  });

  const [createBoardModal, setCreateBoardModal] = useState<CreateBoardModalState>({
    isOpen: false,
    workspaceId: undefined,
  });

  const [createWorkspaceModal, setCreateWorkspaceModal] = useState<CreateWorkspaceModalState>({
    isOpen: false,
  });

  const [createOrganizationModal, setCreateOrganizationModal] = useState<CreateOrganizationModalState>({
    isOpen: false,
  });

  // Template Preview Modal handlers
  const openTemplatePreviewModal = (template: FirestoreTemplate) => {
    setTemplatePreviewModal({ isOpen: true, template });
  };

  const closeTemplatePreviewModal = () => {
    setTemplatePreviewModal({ isOpen: false, template: null });
  };

  // Task Modal handlers
  const openTaskModal = (params: {
    task?: any | null;
    availableLabels: any[];
    members: Array<{ name: string; color: string }>;
    onSave: (task: any) => void;
    onDelete?: (taskId: string) => void;
  }) => {
    setTaskModal({
      isOpen: true,
      ...params,
    });
  };

  const closeTaskModal = () => {
    setTaskModal({
      isOpen: false,
      task: null,
      availableLabels: [],
      members: [],
      onSave: () => { },
      onDelete: undefined,
    });
  };

  // Column Modal handlers
  const openColumnModal = (params: {
    column?: any | null;
    onSave: (column: any) => void;
  }) => {
    setColumnModal({
      isOpen: true,
      ...params,
    });
  };

  const closeColumnModal = () => {
    setColumnModal({
      isOpen: false,
      column: null,
      onSave: () => { },
    });
  };

  // Create Board Modal handlers
  const openCreateBoardModal = (workspaceId?: string) => {
    setCreateBoardModal({ isOpen: true, workspaceId });
  };

  const closeCreateBoardModal = () => {
    setCreateBoardModal({ isOpen: false, workspaceId: undefined });
  };

  // Create Workspace Modal handlers
  const openCreateWorkspaceModal = () => {
    setCreateWorkspaceModal({ isOpen: true });
  };

  const closeCreateWorkspaceModal = () => {
    setCreateWorkspaceModal({ isOpen: false });
  };

  // Create Organization Modal handlers
  const openCreateOrganizationModal = () => {
    setCreateOrganizationModal({ isOpen: true });
  };

  const closeCreateOrganizationModal = () => {
    setCreateOrganizationModal({ isOpen: false });
  };

  const value: ModalContextType = {
    templatePreviewModal,
    openTemplatePreviewModal,
    closeTemplatePreviewModal,

    taskModal,
    openTaskModal,
    closeTaskModal,

    columnModal,
    openColumnModal,
    closeColumnModal,

    createBoardModal,
    openCreateBoardModal,
    closeCreateBoardModal,

    createWorkspaceModal,
    openCreateWorkspaceModal,
    closeCreateWorkspaceModal,

    createOrganizationModal,
    openCreateOrganizationModal,
    closeCreateOrganizationModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}