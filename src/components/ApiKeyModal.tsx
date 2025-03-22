
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  open, 
  onOpenChange,
  onApiKeySubmit
}) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    onApiKeySubmit(apiKey.trim());
    toast.success('API key saved');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-hand text-2xl">Enter your Gemini API Key</DialogTitle>
          <DialogDescription className="font-hand">
            This will be used to connect to Google's Gemini API for image editing.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="font-hand"
            />
            <p className="text-xs text-muted-foreground font-hand">
              Your API key will be securely stored for making requests to the Gemini API.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="font-hand"
              disabled={!apiKey.trim()}
            >
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
