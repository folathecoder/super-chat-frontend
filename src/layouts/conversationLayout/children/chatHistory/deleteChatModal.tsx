import React, { useCallback } from 'react';
import { Modal } from 'antd';
import { deleteConversation } from '@/services/conversation.service';
import styled from 'styled-components';

interface DeleteChatModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  conversationId: string;
  conversationTitle: string;
}

const DeleteChatModal = ({
  openModal,
  setOpenModal,
  conversationId,
  conversationTitle,
}: DeleteChatModalProps) => {
  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;

      try {
        await deleteConversation(conversationId);
        setOpenModal(false);
      } catch (err) {
        console.error(
          `Failed to delete conversation with conversationId: ${conversationId}. Please try again; ${String(
            err
          )}`
        );
      }
    },
    [conversationId]
  );

  return (
    <StyledModal
      open={openModal}
      title="Delete chat?"
      onOk={() => handleDeleteConversation(conversationId)}
      onCancel={() => setOpenModal(false)}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <p>
        Do you want to delete this conversation? -{' '}
        <span>{conversationTitle}</span>
      </p>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  &.ant-modal .ant-modal-content,
  .ant-modal-header {
    background-color: var(--bg-quaternary);
  }

  & .ant-modal-title {
    color: var(--text-primary) !important;
  }

  & .ant-modal-body {
    color: var(--text-secondary) !important;
  }

  p > span {
    border-bottom: 2px solid var(--accent-tertiary);
  }

  svg {
    color: var(--text-primary);
  }
`;

export default DeleteChatModal;
