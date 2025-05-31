
import StatusTable from '@/components/dashboard/StatusTable';
import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { trpc } from '@/trpc/server';
import Link from 'next/link';
import React from 'react';

// const panelStatuses = Array.from({ length: 50 }, (_, i) => ({
//   id: i + 1,
//   status: Math.random() > 0.2 ? "online" : "offline", // ~80% online
// }));




export default async function Page() {
  // const [currentPanel, setCurrentPanel] = React.useState<number | null>(null);
  const data = await trpc.device.getDevices();
  // const handleSetCurrentPanel = (id: number) => setCurrentPanel(id);

  return (
    <PageLayout>
      <PageTitle>Dashboard</PageTitle>
      <div className='w-1/2 h-full m-auto'>
        <div className='flex flex-col gap-4'>
          {data.devices.map((device) => (
            <Link href={`/dashboard/device/${device.uuid}`} key={device.uuid}>
              <Card key={device.uuid} className="w-full h-15 bg-transparent shadow-lg p-4 flex justify-between hover:cursor-pointer">
                <div className='flex items-center gap-4'>
                  <div className='w-2 flex justify-center items-center'>
                    {
                      device.panels.filter(s => s.status === "offline").length > 0 ? (
                        <span className='text-red-600 text-3xl'>!</span>
                      ) :
                        <span className='text-green-600 text-xl'>✓</span>
                    }
                  </div>
                  <div>
                    <CardTitle>Device {device.uuid}</CardTitle>
                    <CardDescription>
                      description
                    </CardDescription>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge className=' bg-successAlert text-successAlert-foreground'>
                    {device.panels.filter(s => s.status === "online").length} online
                  </Badge>
                  {
                    device.panels.filter(s => s.status === "offline").length > 0 ? (
                      <Badge variant={"destructive"} className=' bg-errorAlert text-errorAlert-foreground'>
                        {device.panels.filter(s => s.status === "offline").length} offline
                      </Badge>
                    )
                      :
                      null
                  }

                </div>

              </Card>
            </Link>
          ))}

        </div>
      </div>
      {/* <div className='absolute'>
        <div className="relative group w-full h-full">
          <div className='m-2'>All statuses</div>
          <Card className="absolute w-96 h-64 overflow-auto rounded-lg bg-transparent shadow-lg scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <CardDescription>
              <StatusTable data={{
                panelStatuses: panelStatuses,
                handleSetCurrentPanel: handleSetCurrentPanel
              }} />
            </CardDescription>
          </Card>
        </div>
      </div> */}
      {/* <div className='absolute right-0 bottom-0 p-4'>
        {
          currentPanel ? (
            <Card className="w-96 h-64 bg-transparent shadow-lg">
              {currentPanel}
            </Card>
          ) :
            null
        }

      </div> */}

    </PageLayout>
  );
}
