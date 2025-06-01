'use client';
import { trpc } from '@/trpc/client';
import { SystemSummary } from '@/types/solarData';
import { Loader2 } from 'lucide-react';

type Props = {
  text: string;
  UUID: string;
  summaryKey: 'total_dc_input_power' | 'energy_produced_today' | 'energy_produced_total_lifetime';
};

export default function KPIBadge(props: Props) {
  return (
    <div className="rounded-lg bg-black p-2 pl-4 pr-4 text-white shadow-lg">
      <InnerKPIBadge {...props} />
    </div>
  );
}
function InnerKPIBadge({ text, UUID, summaryKey }: Props) {
  console.log('UUID', UUID);
  console.log('summaryKey', summaryKey);
  console.log('text', text);
  const { data: deviceData } = trpc.gatewayReading.getReadingSummary.useQuery(
    { uuid: UUID },
    { refetchInterval: 5000 }
  );
  console.log('deviceData', deviceData);

  if (!deviceData) {
    return (
      <>
        <Loader2 className="mr-2 size-4 animate-spin" />
      </>
    );
  }
  const systemSummary: SystemSummary = (deviceData as SystemSummary) || {};

  const wattage = systemSummary[summaryKey].value || 0;
  const unit = systemSummary[summaryKey].unit || 'W';

  return (
    <>
      <h1 className="text-sm font-bold">{text}</h1>
      <p className="text-xs text-gray-400">
        {wattage} {unit}
      </p>
    </>
  );
}
