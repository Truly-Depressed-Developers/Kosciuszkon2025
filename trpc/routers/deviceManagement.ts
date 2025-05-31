import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { router, procedure } from '../init';

export const deviceManagementRouter = router({
  addDevice: procedure
    .input(
      z.object({
        name: z.string().min(1, 'Nazwa urządzenia jest wymagana'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error('Nie jesteś zalogowany');
      }

      const existingDevice = await prisma.device.findFirst({
        where: {
          name: input.name,
        },
      });

      if (existingDevice) {
        return {
          success: false,
          message: `Urządzenie ${existingDevice.name} już istnieje`,
        };
      }

      const newDevice = await prisma.device.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
        },
      });

      return {
        success: true,
        message: `Urządzenie ${newDevice.name} dodane pomyślnie`,
      };
    }),
});
