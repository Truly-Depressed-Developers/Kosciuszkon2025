'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { TbExternalLink } from 'react-icons/tb';
import { trpc } from '@/trpc/client'; // Note the switch to client-side trpc
import { useParams } from 'next/navigation';
import { PageLayout, PageTitle } from '@/components/layout/PageLayout';

export default function Page() {
  const { id } = useParams() as { id: string };

  console.log('ID:', id);
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
    <PageLayout>
      <PageTitle>Panel Statuses</PageTitle>
      <Card className="m-auto mb-4 flex w-1/2 items-center justify-between p-2 py-4 shadow-lg">
        <CardTitle className="text-sm font-semibold">Solar panel issues</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Choose replace to contact the manufacturer for a replacement panel.
        </CardDescription>
      </Card>
      <div className="m-auto h-full w-1/2">
        <div className="flex flex-col gap-4">
          <div className="mb-2 w-full text-gray-500">
            {data.filter((panel) => panel.statusLabel !== 'good').length === 0 && (
              <span className="flex w-full justify-center">All panels are in good condition.</span>
            )}

            {data
              .filter((panel) => panel.statusLabel !== 'good')
              .map((panel) => (
                <Card key={panel.moduleId} className="mb-2 flex w-full items-center shadow-lg">
                  <div className="m-2 flex w-full items-center justify-between p-1">
                    <span>Panel {panel.moduleId}</span>
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        className={
                          panel.statusLabel === 'warning'
                            ? 'bg-warningAlert text-warningAlert-foreground'
                            : 'bg-errorAlert text-errorAlert-foreground'
                        }
                      >
                        {panel.statusLabel}
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
    </PageLayout>
  );
}
