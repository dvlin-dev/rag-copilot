import { MessageRole } from '@/types';
import http from '@/utils/http';

interface ChatBody {
  messages: Partial<Message>[];
  projectId?: string;
}

export const chat = (data: ChatBody) =>
  http({
    url: `/conversation/chat`,
    method: 'post',
    data,
  });

interface ConversationParams {
  projectId: string;
  namespace: string;
}

export const searchByNameSpace = ({
  projectId,
  namespace,
}: ConversationParams) =>
  http({
    url: `/conversation/${projectId}/search`,
    method: 'get',
    params: {
      namespace,
    },
  });

export const getConversation = (id: string) =>
  http({
    url: `/conversation/${id}/detail`,
    method: 'get',
  });

// 获取会话列表
export const getConversationList = (projectId: string) =>
  http({
    url: `/conversation/${projectId}/list`,
    method: 'get',
  });

// 创建会话
export const createConversation = ({
  projectId,
  namespace,
}: ConversationParams) =>
  http({
    url: `/conversation`,
    method: 'post',
    data: {
      projectId,
      namespace,
    },
  });

// 删除会话
export const deleteConversation = (id: string) =>
  http({
    url: `/conversation/${id}`,
    method: 'delete',
  });

// 获取消息详情
export const getMessage = (id: string) =>
  http({
    url: `/message/${id}/detail`,
    method: 'get',
  });

// 获取消息列表
export const getMessageList = (conversationId: string) =>
  http({
    url: `/message/${conversationId}/list`,
    method: 'get',
  });

interface BaseMessage {
  conversationId: string;
  content: string;
}
interface CreateMessageBody extends BaseMessage {
  role: MessageRole;
}

export const createMessage = ({
  conversationId,
  content,
  role,
}: CreateMessageBody) =>
  http({
    url: `/message`,
    method: 'post',
    data: {
      conversationId,
      content,
      role,
    },
  });

export const updateMessage = ({ conversationId, content }: BaseMessage) =>
  http({
    url: `/message/${conversationId}`,
    method: 'patch',
    data: {
      content,
    },
  });

// 删除消息
export const deleteMessage = (id: string) =>
  http({
    url: `/message/${id}`,
    method: 'delete',
  });
