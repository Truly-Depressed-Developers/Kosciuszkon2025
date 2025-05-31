import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { router, protectedProcedure } from '../init';

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
});
