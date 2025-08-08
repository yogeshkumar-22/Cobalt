export interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
}

export interface ScheduledMessage {
  id: string;
  channelId: string;
  channelName: string;
  content: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
