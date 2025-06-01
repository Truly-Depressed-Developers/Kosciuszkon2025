import KPIBadge from '@/components/KPIIndexes/KPIBadge';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { DeviceSolarGrid } from '@/components/visualization/DeviceSolarGrid';
import Link from 'next/link';

// const Page = async({ params }: Promise<{ id: string }>)=>{

// const { id } = await params;

// }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
        // solarStatus={ }
        className="absolute left-0 top-0"
      />
    </PageLayout>
  );
}
