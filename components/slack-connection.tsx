"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Slack, CheckCircle, AlertCircle } from 'lucide-react';
import { SlackWorkspace } from '@/types/slack';
import { slackApi } from '@/lib/api';

interface SlackConnectionProps {
  onWorkspaceConnected: (workspace: SlackWorkspace) => void;
}

export function SlackConnection({ onWorkspaceConnected }: SlackConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [workspace, setWorkspace] = useState<SlackWorkspace | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await slackApi.connectWorkspace();
      
      if (result.success && result.workspace) {
        setWorkspace(result.workspace);
        onWorkspaceConnected(result.workspace);
      } else {
        setError(result.error || 'Failed to connect to Slack');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Slack className="h-5 w-5" />
          Slack Workspace Connection
        </CardTitle>
        <CardDescription>
          Connect your Slack workspace to send and schedule messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!workspace ? (
          <div className="space-y-4">
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting to Slack...
                </>
              ) : (
                <>
                  <Slack className="mr-2 h-4 w-4" />
                  Connect to Slack
                </>
              )}
            </Button>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">{workspace.name}</p>
                <p className="text-sm text-muted-foreground">{workspace.domain}.slack.com</p>
              </div>
            </div>
            <Badge variant="secondary">Connected</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
