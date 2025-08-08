"use client"

import { useState } from 'react';
import { SlackConnection } from '@/components/slack-connection';
import { MessageComposer } from '@/components/message-composer';
import { ScheduledMessages } from '@/components/scheduled-messages';
import { SlackWorkspace } from '@/types/slack';

export default function SlackMessagingDashboard() {
  const [connectedWorkspace, setConnectedWorkspace] = useState<SlackWorkspace | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkspaceConnected = (workspace: SlackWorkspace) => {
    setConnectedWorkspace(workspace);
  };

  const handleMessageSent = () => {
    // Trigger refresh of scheduled messages
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Slack Messaging Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Connect to Slack, compose messages, and manage scheduled deliveries
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-6">
            <SlackConnection onWorkspaceConnected={handleWorkspaceConnected} />
            <MessageComposer 
              isConnected={!!connectedWorkspace} 
              onMessageSent={handleMessageSent}
            />
          </div>
          
          <div>
            <ScheduledMessages 
              isConnected={!!connectedWorkspace}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
