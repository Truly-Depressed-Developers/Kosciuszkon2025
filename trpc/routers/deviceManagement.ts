import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { router, protectedProcedure } from '../init';

// Define or import the Panel type
type Panel = {
  id: string;
  module_id: string;
  status_label: 'good' | 'warning' | 'bad';
  // Add other properties as needed
};

export const deviceManagementRouter = router({
  addDevice: protectedProcedure
    .input(
      z.object({
        uuid: z.string().min(1, 'UUID is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingDevice = await prisma.device.findFirst({
        where: {
          uuid: input.uuid,
        },
      });

      if (existingDevice) {
        return {
          success: false,
          message: `Device ${existingDevice.uuid} already exists`,
        };
      }

      const existingGateway = await prisma.gatewayReading.findFirst({
        where: {
          gatewaySerialNumber: input.uuid,
        },
      });
      if (!existingGateway) {
        return {
          success: false,
          message: `No gateway reading found for device ${input.uuid}. Please ensure the device is registered.`,
        };
      }

      const newDevice = await prisma.device.create({
        data: {
          uuid: input.uuid,
          userId: ctx.user.id,
        },
      });

      return {
        success: true,
        message: `Device ${newDevice.uuid} added successfully`,
      };
    }),
  getDevices: protectedProcedure.query(async ({ ctx }) => {
    const devices = await prisma.device.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!devices || devices.length === 0) {
      return {
        success: false,
        message: 'No devices found for the user.',
      };
    }

    const readings = await Promise.all(
      devices.map(async (device) => {
        const reading = await prisma.gatewayReading.findFirst({
          where: {
            gatewaySerialNumber: device.uuid,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return {
          uuid: device.uuid,
          panels: reading?.individualModulePerformanceJson as Panel[] | undefined,
        };
      })
    );
    return readings;
  }),
});
