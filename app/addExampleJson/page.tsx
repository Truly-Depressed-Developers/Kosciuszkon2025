import { trpc } from '@/trpc/server';

export default async function Page() {
  await trpc.gatewayReading.addNewGatewayReading();
  return <div>Added example json</div>;
}
