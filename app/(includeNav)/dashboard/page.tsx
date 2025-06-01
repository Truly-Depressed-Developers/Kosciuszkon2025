'use client';

import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { IoAddCircleOutline, IoWarningOutline } from 'react-icons/io5';

type DeviceStatus = 'good' | 'warning' | 'bad';

interface Panel {
  status_label: DeviceStatus;
  // Add other panel properties as needed
}

export default function Page() {
  // Update the query to handle the { devices } response structure
  const {
    data,
    error: devicesError,
    isLoading,
  } = trpc.device.getDevices.useQuery(undefined, {
    refetchInterval: 5000,
  });

  if (devicesError) {
    return <div>Error loading devices: {devicesError.message}</div>;
  }

  if (isLoading) {
    return <div>Loading devices...</div>;
  }

  const getDeviceStatus = (panels: Panel[]): DeviceStatus => {
    if (!panels || panels.length === 0) return 'good'; // Default status if no panels
    if (panels.some((panel) => panel.status_label === 'bad')) return 'bad';
    if (panels.some((panel) => panel.status_label === 'warning')) return 'warning';
    return 'good';
  };

  return (
    <PageLayout>
      <PageTitle>Dashboard</PageTitle>
      <div className="m-auto h-full w-full max-w-2xl px-4">
        <Card className="mb-4 flex w-full items-center justify-between p-4 shadow-lg">
          <div>Add device</div>
          <Link href="/device/add">
            <Button className="mb-2" size="sm">
              Add Device
              <IoAddCircleOutline className="ml-1" />
            </Button>
          </Link>
        </Card>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            {}
            {Array.isArray(data) && data.length === 0 && (
              <span className="flex w-full justify-center text-gray-500">
                No devices found. Please add a device to get started.
              </span>
            )}
            {Array.isArray(data) &&
              data.map((device) => {
                if (!device || !device.uuid) {
                  return (
                    <div key="no-device" className="text-gray-500">
                      No devices found.
                    </div>
                  );
                }
                const status = getDeviceStatus(device.panels ?? []);
                const statusConfig = {
                  bad: { icon: <span className="text-3xl text-red-600">!</span>, color: 'red-600' },
                  warning: {
                    icon: <IoWarningOutline className="text-xl text-yellow-600" />,
                    color: 'yellow-600',
                  },
                  good: {
                    icon: <span className="text-xl text-green-600">✓</span>,
                    color: 'green-600',
                  },
                };

                return (
                  <Link href={`/device/${device.uuid}`} key={device.uuid}>
                    <Card className="mb-2 w-full cursor-pointer rounded-lg bg-transparent shadow-lg transition-all hover:bg-gray-800">
                      <div className="flex w-full justify-between border-gray-600 p-4 shadow-lg hover:no-underline">
                        <div className="flex items-center gap-4">
                          <div className="flex size-4 w-4 items-center justify-center">
                            {statusConfig[status].icon}
                          </div>
                          <div>
                            <CardTitle>{`Device ${device.uuid}`}</CardTitle>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <div
                            className={`mr-2 size-2 rounded-sm bg-${statusConfig[status].color}`}
                          ></div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
