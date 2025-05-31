// This is a Server Component by default (no 'use client')

import { PageLayout } from '@/components/layout/PageLayout';

type Props = {
  params: {
    deviceId: string;
  };
};

const DevicePage = ({ params }: Props) => {
  const { deviceId } = params;

  return (
    <PageLayout>
      <div>
        <h1>Device ID: {deviceId}</h1>
      </div>
    </PageLayout>
  );
};

export default DevicePage;
