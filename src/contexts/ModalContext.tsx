"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FirestoreTemplate, FirestoreTask } from '@/types/firestore';

// Column type for board columns
type BoardColumn = {
  id: string;
  title: string;
  badgeColor: string;
};

// Label type for task labels
type TaskLabel = {
  id: string;
  name: string;
  color: string;
};

// Modal state interfaces
interface TemplatePreviewModalState {
  isOpen: boolean;
  template: FirestoreTemplate | null;
}

interface TaskModalState {
  isOpen: boolean;
  task?: FirestoreTask | null;
  availableLabels: TaskLabel[];
  members: Array<{ name: string; color: string }>;
  onSave: (task: Partial<FirestoreTask>) => void;
  onDelete?: (taskId: string) => void;
}

interface ColumnModalState {
  isOpen: boolean;
  column?: BoardColumn | null;
  onSave: (column: Partial<BoardColumn>) => void;
}

interface CreateBoardModalState {
  isOpen: boolean;
  workspaceId?: string;
}

interface CreateWorkspaceModalState {
  isOpen: boolean;
  organizationId?: string;
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
    task?: FirestoreTask | null;
    availableLabels: TaskLabel[];
    members: Array<{ name: string; color: string }>;
    onSave: (task: Partial<FirestoreTask>) => void;
    onDelete?: (taskId: string) => void;
  }) => void;
  closeTaskModal: () => void;

  // Column Modal
  columnModal: ColumnModalState;
  openColumnModal: (params: {
    column?: BoardColumn | null;
    onSave: (column: Partial<BoardColumn>) => void;
  }) => void;
  closeColumnModal: () => void;

  // Create Board Modal
  createBoardModal: CreateBoardModalState;
  openCreateBoardModal: (workspaceId?: string) => void;
  closeCreateBoardModal: () => void;

  // Create Workspace Modal
  createWorkspaceModal: CreateWorkspaceModalState;
  openCreateWorkspaceModal: (organizationId?: string) => void;
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
    task?: FirestoreTask | null;
    availableLabels: TaskLabel[];
    members: Array<{ name: string; color: string }>;
    onSave: (task: Partial<FirestoreTask>) => void;
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
      onSave: () => {},
      onDelete: undefined,
    });
  };

  // Column Modal handlers
  const openColumnModal = (params: {
    column?: BoardColumn | null;
    onSave: (column: Partial<BoardColumn>) => void;
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
      onSave: () => {},
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
  const openCreateWorkspaceModal = (organizationId?: string) => {
    setCreateWorkspaceModal({ isOpen: true, organizationId });
  };

  const closeCreateWorkspaceModal = () => {
    setCreateWorkspaceModal({ isOpen: false, organizationId: undefined });
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