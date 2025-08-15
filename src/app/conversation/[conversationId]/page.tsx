'use client';

import React from 'react';
import { ConversationLayout } from '@/layouts';
import { useParams } from 'next/navigation';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params?.conversationId;

  return <ConversationLayout conversationId={conversationId as string} />;
}
