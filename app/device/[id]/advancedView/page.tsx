'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TbExternalLink } from 'react-icons/tb';
import { trpc } from '@/trpc/client'; // Note the switch to client-side trpc

export default function Page({ id }: { id: string }) {
  const { data, isLoading } = trpc.gatewayReading.getReadingById.useQuery(
    { uuid: id },
    { refetchInterval: 5000 }
  );

  if (isLoading) {
    return <div>Loading devices</div>;
  }

  if (data == undefined) {
    return <div>No devices</div>;
  }

  return (
    <>
      <Card className="m-auto mb-4 flex w-1/2 items-center justify-between p-2 py-4 shadow-lg">
        <CardTitle className="text-sm font-semibold">Solar panel issues</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Choose replace to contact the manufacturer for a replacement panel.
        </CardDescription>
      </Card>
      <div className="m-auto h-full w-1/2">
        <div className="flex flex-col gap-4">
          <div className="mb-2 w-full text-gray-500">
            {data.length === 0 && (
              <span className="flex w-full justify-center">All panels are in good condition.</span>
            )}
            {data.map((panel) => (
              <Card key={panel.module_id} className="mb-2 flex w-full items-center shadow-lg">
                <div className="m-2 flex w-full items-center justify-between p-1">
                  <span>Panel {panel.module_id}</span>
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      className={
                        panel.status_label === 'good'
                          ? 'bg-successAlert text-successAlert-foreground'
                          : panel.status_label === 'warning'
                            ? 'bg-warningAlert text-warningAlert-foreground'
                            : 'bg-errorAlert text-errorAlert-foreground'
                      }
                    >
                      {panel.status_label}
                    </Badge>
                    <Link href="https://www.canadiansolar.com/">
                      <Button className="ml-2 py-1" size="sm">
                        Replace
                        <TbExternalLink />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
