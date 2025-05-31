import { PageLayout } from '@/components/layout/PageLayout';
import { DeviceSolarGrid } from '@/components/visualization/DeviceSolarGrid';

export default function Page() {
  return (
    <PageLayout full={true}>
      <DeviceSolarGrid modelPath="/static/models/car/car.gltf" rotationSpeed={15} />
    </PageLayout>
  );
}
