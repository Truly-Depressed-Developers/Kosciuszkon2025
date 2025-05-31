import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { trpc } from '@/trpc/server';
import Link from 'next/link';
// import Link from 'next/link';
import React from 'react';
import { FaArrowRightToBracket } from 'react-icons/fa6';

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
      <div className="m-auto h-full w-1/2">
        <Card className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full">
            {data.devices.map((device) => (
              // <Link href={`/dashboard/device/${device.uuid}`} key={device.uuid}>
              <AccordionItem key={device.uuid} value={device.uuid}>
                <AccordionTrigger className="flex w-full justify-between border-gray-600 p-4 shadow-lg hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="flex w-2 items-center justify-center">
                      {device.panels.filter((s) => s.status === 'offline').length > 0 ? (
                        <span className="text-3xl text-red-600">!</span>
                      ) : (
                        <span className="text-xl text-green-600">✓</span>
                      )}
                    </div>
                    <div>
                      <CardTitle>Device {device.uuid}</CardTitle>
                      <CardDescription>description</CardDescription>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge className="mr-2 bg-successAlert text-successAlert-foreground">
                      {device.panels.filter((s) => s.status === 'online').length} online
                    </Badge>
                    {device.panels.filter((s) => s.status === 'offline').length > 0 ? (
                      <Badge
                        variant={'destructive'}
                        className="mr-2 bg-errorAlert text-errorAlert-foreground"
                      >
                        {device.panels.filter((s) => s.status === 'offline').length} offline
                      </Badge>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mx-1 mb-4 border-t-2 p-4 shadow-lg">
                  <CardDescription>
                    <div className="flex w-full justify-between">
                      {device.panels.filter((panel) => panel.status === 'offline').length == 0 ? (
                        <div className="m-2 flex justify-between">
                          <span>Everything seems fine</span>
                        </div>
                      ) : (
                        <div className="m-2 flex justify-between">
                          <span>Some panels are offline</span>
                        </div>
                      )}
                      <Link href={`/dashboard/device/${device.uuid}`}>
                        <Button className="mb-2" size="sm">
                          View Details <FaArrowRightToBracket />
                        </Button>
                      </Link>
                    </div>
                    {device.panels
                      .filter((panel) => panel.status === 'offline')
                      .map((panel) => (
                        <div key={panel.id} className="m-2 flex justify-between">
                          <span>Panel {panel.id}</span>
                          <Badge
                            className={
                              panel.status === 'online'
                                ? 'bg-successAlert text-successAlert-foreground'
                                : 'bg-errorAlert text-errorAlert-foreground'
                            }
                          >
                            {panel.status}
                          </Badge>
                        </div>
                      ))}
                  </CardDescription>
                </AccordionContent>
              </AccordionItem>
              // </Link>
            ))}
          </Accordion>
        </Card>
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
