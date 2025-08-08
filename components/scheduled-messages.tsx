"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { ScheduledMessage } from '@/types/slack';
import { slackApi } from '@/lib/api';

interface ScheduledMessagesProps {
  isConnected: boolean;
  refreshTrigger: number;
}

export function ScheduledMessages({ isConnected, refreshTrigger }: ScheduledMessagesProps) {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isConnected) {
      loadScheduledMessages();
    }
  }, [isConnected, refreshTrigger]);

  const loadScheduledMessages = async () => {
    setIsLoading(true);
    try {
      const result = await slackApi.getScheduledMessages();
      if (result.success && result.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error('Failed to load scheduled messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelMessage = async (messageId: string) => {
    setCancellingIds(prev => new Set(prev).add(messageId));

    try {
      const result = await slackApi.cancelScheduledMessage(messageId);
      
      if (result.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'cancelled' } : msg
        ));
      }
    } catch (error) {
      console.error('Failed to cancel message:', error);
    } finally {
      setCancellingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: ScheduledMessage['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Scheduled Messages</CardTitle>
          <CardDescription>Connect to Slack to view scheduled messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Please connect your Slack workspace to view scheduled messages
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduled Messages
        </CardTitle>
        <CardDescription>
          Manage your scheduled messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading scheduled messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No scheduled messages found</p>
            <p className="text-sm">Schedule a message to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{message.channelName}</span>
                      <Badge className={getStatusColor(message.status)}>
                        {message.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for: {formatDateTime(message.scheduledTime)}
                    </p>
                  </div>
                  
                  {message.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelMessage(message.id)}
                      disabled={cancellingIds.has(message.id)}
                    >
                      {cancellingIds.has(message.id) ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="mr-2 h-3 w-3" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="bg-muted rounded p-3">
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
