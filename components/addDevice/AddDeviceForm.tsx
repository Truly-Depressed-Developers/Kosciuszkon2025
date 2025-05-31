'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { trpc } from '@/trpc/client';
import { ServerMessage } from '@/types/Auth';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Props = {
  className?: string;
};

export default function AddDeviceForm({ className = '' }: Props) {
  const [deviceName, setDeviceName] = useState('');
  const addDevice = trpc.device.addDevice.useMutation();
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setServerMessage(null);

    if (deviceName == '') {
      alert('Please enter a device name.');
      setLoading(false);
      return;
    }

    addDevice.mutate(
      { name: deviceName },
      {
        onSuccess: (data) => {
          setDeviceName('');
          setServerMessage({ type: data.success ? 'success' : 'error', message: data.message });
          setLoading(false);
        },
        onError: (error) => {
          setServerMessage({
            type: 'error',
            message: error.message,
          });
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className={className}>
      <Card className="max-auto max-w-sm">
        <CardHeader>
          <CardTitle>Add Device</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {serverMessage && (
              <div
                className={cn(
                  `mb-4 rounded border px-4 py-2`,
                  serverMessage.type == 'success'
                    ? `bg-successAlert text-successAlert-foreground`
                    : `bg-errorAlert text-errorAlert-foreground`
                )}
                role="alert"
              >
                <span className="block text-sm font-semibold sm:inline">
                  {serverMessage.message}
                </span>
              </div>
            )}
            <Label htmlFor="deviceName">Device Name</Label>
            <Input
              id="deviceName"
              value={deviceName}
              onChange={(val) => setDeviceName(val.currentTarget.value)}
            />
            <Button type="submit" className="mt-4 w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Add Device
            </Button>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
