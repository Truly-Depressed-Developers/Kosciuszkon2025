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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  className?: string;
};

export default function AddDeviceForm({ className = '' }: Props) {
  const [deviceUUID, setDeviceUUID] = useState('');
  const addDevice = trpc.device.addDevice.useMutation();
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setServerMessage(null);

    if (deviceUUID == '') {
      alert('Please enter a device UUID.');
      setLoading(false);
      return;
    }

    addDevice.mutate(
      { uuid: deviceUUID },
      {
        onSuccess: (data) => {
          setDeviceUUID('');
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
          <CardTitle>
            <Button variant="link">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft />
              </Link>
            </Button>
            Add Device
          </CardTitle>
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

            <Label htmlFor="deviceName">Device serial number</Label>
            <Input
              id="deviceName"
              value={deviceUUID}
              onChange={(val) => setDeviceUUID(val.currentTarget.value)}
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
