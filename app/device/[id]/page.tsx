'use client';

import KPIBadge from '@/components/KPIIndexes/KPIBadge';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { DeviceSolarGrid, SolarStatus } from '@/components/visualization/DeviceSolarGrid';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// const Page = async({ params }: Promise<{ id: string }>)=>{

// const { id } = await params;

// }

// { params }: { params: Promise<{ id: string }> }

export default function Page() {
  const { id } = useParams() as { id: string };
  const { data } = trpc.gatewayReading.getReadingById.useQuery(
    { uuid: id },
    { refetchInterval: 5000 }
  );

  if (!data) {
    return <div>No data available for this device.</div>;
  }

  console.log(data);

  return (
    <PageLayout full={true} className="relative size-full">
      <div className="absolute left-0 top-0 z-30 flex w-full items-center justify-between gap-6 p-2">
        <div className="flex justify-center gap-5">
          <KPIBadge text={'Total DC input power'} UUID={id} summaryKey="total_dc_input_power" />
          <KPIBadge text={'Energy produced today'} UUID={id} summaryKey="energy_produced_today" />
          <KPIBadge
            text={'Energy produced total lifetime'}
            UUID={id}
            summaryKey="energy_produced_total_lifetime"
          />
        </div>
        <div>
          <Button asChild className="text-primary-background bg-primary-foreground">
            <Link href={`/device/${id}/advancedView`}>Action Center</Link>
          </Button>
        </div>
      </div>
      <DeviceSolarGrid
        modelPath="/static/models/car/car.gltf"
        rotationSpeed={15}
        solarStatus={data.map((item) => {
          // Extract x and y from moduleId (format: "x_y_PANEL_suffix")
          const [x, y] = item.moduleId.split('_').map(Number);

          // Map statusLabel to SolarStatus enum
          let state;
          switch (item.statusLabel.toLowerCase()) {
            case 'good':
              state = SolarStatus.GOOD;
              break;
            case 'warning':
              state = SolarStatus.WARNING;
              break;
            default:
              state = SolarStatus.BAD;
          }

          return { x, y, state };
        })}
        className="absolute left-0 top-0"
      />
    </PageLayout>
  );
}
