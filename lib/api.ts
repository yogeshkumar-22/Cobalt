// Mock API functions - replace with actual API calls
export const slackApi = {
  async connectWorkspace(): Promise<{ success: boolean; workspace?: SlackWorkspace; error?: string }> {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful connection
    return {
      success: true,
      workspace: {
        id: 'T1234567890',
        name: 'My Workspace',
        domain: 'myworkspace'
      }
    };
  },

  async getChannels(): Promise<{ success: boolean; channels?: SlackChannel[]; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      channels: [
        { id: 'C1234567890', name: 'general', isPrivate: false },
        { id: 'C1234567891', name: 'random', isPrivate: false },
        { id: 'C1234567892', name: 'development', isPrivate: false },
        { id: 'C1234567893', name: 'marketing', isPrivate: true },
      ]
    };
  },

  async sendMessage(channelId: string, content: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true };
  },

  async scheduleMessage(channelId: string, content: string, scheduledTime: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`
    };
  },

  async getScheduledMessages(): Promise<{ success: boolean; messages?: ScheduledMessage[]; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      messages: [
        {
          id: 'msg_1',
          channelId: 'C1234567890',
          channelName: 'general',
          content: 'Don\'t forget about the team meeting tomorrow!',
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'msg_2',
          channelId: 'C1234567892',
          channelName: 'development',
          content: 'Code review reminder for PR #123',
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]
    };
  },

  async cancelScheduledMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  }
};
