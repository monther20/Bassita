"use client";

import React from 'react';
import { useModal } from '@/contexts/ModalContext';

// Import all modal components
import TemplatePreviewModal from './TemplatePreviewModal';
import TaskModal from './board/TaskModal';
import ColumnModal from './board/ColumnModal';
import CreateBoardModal from './CreateBoardModal';
import CreateWorkspaceModal from './CreateWorkspaceModal';

export default function ModalRenderer() {
  const {
    templatePreviewModal,
    closeTemplatePreviewModal,
    taskModal,
    closeTaskModal,
    columnModal,
    closeColumnModal,
    createBoardModal,
    closeCreateBoardModal,
    createWorkspaceModal,
    closeCreateWorkspaceModal,
  } = useModal();

  return (
    <>
      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={templatePreviewModal.isOpen}
        onClose={closeTemplatePreviewModal}
        template={templatePreviewModal.template}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModal.isOpen}
        onClose={closeTaskModal}
        onSave={taskModal.onSave}
        onDelete={taskModal.onDelete}
        task={taskModal.task}
        availableLabels={taskModal.availableLabels}
        members={taskModal.members}
      />

      {/* Column Modal */}
      <ColumnModal
        isOpen={columnModal.isOpen}
        onClose={closeColumnModal}
        onSave={columnModal.onSave}
        column={columnModal.column}
      />

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={createBoardModal.isOpen}
        onClose={closeCreateBoardModal}
        workspaceId={createBoardModal.workspaceId}
      />

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={createWorkspaceModal.isOpen}
        onClose={closeCreateWorkspaceModal}
      />
    </>
  );
}