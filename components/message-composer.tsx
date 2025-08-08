"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { SlackChannel } from '@/types/slack';
import { slackApi } from '@/lib/api';

interface MessageComposerProps {
  isConnected: boolean;
  onMessageSent: () => void;
}

export function MessageComposer({ isConnected, onMessageSent }: MessageComposerProps) {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isConnected) {
      loadChannels();
    }
  }, [isConnected]);

  const loadChannels = async () => {
    setIsLoadingChannels(true);
    try {
      const result = await slackApi.getChannels();
      if (result.success && result.channels) {
        setChannels(result.channels);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const handleSendNow = async () => {
    if (!selectedChannel || !message.trim()) return;

    setIsSending(true);
    setFeedback(null);

    try {
      const result = await slackApi.sendMessage(selectedChannel, message);
      
      if (result.success) {
        setFeedback({ type: 'success', message: 'Message sent successfully!' });
        setMessage('');
        onMessageSent();
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to send message' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleMessage = async () => {
    if (!selectedChannel || !message.trim() || !scheduledDateTime) return;

    setIsScheduling(true);
    setFeedback(null);

    try {
      const result = await slackApi.scheduleMessage(selectedChannel, message, scheduledDateTime);
      
      if (result.success) {
        setFeedback({ type: 'success', message: 'Message scheduled successfully!' });
        setMessage('');
        setScheduledDateTime('');
        onMessageSent();
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to schedule message' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setIsScheduling(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // Minimum 1 minute from now
    return now.toISOString().slice(0, 16);
  };

  if (!isConnected) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Message Composer</CardTitle>
          <CardDescription>Connect to Slack first to compose messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Please connect your Slack workspace to start composing messages
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Composer</CardTitle>
        <CardDescription>Send messages immediately or schedule them for later</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="channel">Select Channel</Label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel} disabled={isLoadingChannels}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingChannels ? "Loading channels..." : "Choose a channel"} />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  #{channel.name} {channel.isPrivate && '(Private)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSendNow}
            disabled={!selectedChannel || !message.trim() || isSending}
            className="flex-1"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </>
            )}
          </Button>

          <div className="flex-1 space-y-2">
            <Input
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              min={getMinDateTime()}
            />
            <Button
              onClick={handleScheduleMessage}
              disabled={!selectedChannel || !message.trim() || !scheduledDateTime || isScheduling}
              variant="outline"
              className="w-full"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Message
                </>
              )}
            </Button>
          </div>
        </div>

        {feedback && (
          <div className={`flex items-center gap-2 text-sm ${
            feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {feedback.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
