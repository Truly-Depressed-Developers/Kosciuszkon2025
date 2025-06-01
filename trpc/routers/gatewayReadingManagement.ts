import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { router, protectedProcedure } from '../init';
import sunspecJson from '@/trpc/sunspec_example.json';

function transformSunspecJsonToGatewayReading(data: typeof sunspecJson) {
  return {
    timestamp: new Date(data.timestamp),
    gatewayManufacturer: data.gateway_device_identification.manufacturer,
    gatewayModel: data.gateway_device_identification.model,
    gatewaySerialNumber: data.gateway_device_identification.serial_number,

    systemSummaryJson: data.system_summary,
    overallOperationalStatusJson: data.overall_operational_status,
    acGridParametersJson: data.ac_grid_parameters,
    environmentalContextJson: data.environmental_context,
    gatewayInternalTemperaturesJson: data.gateway_internal_temperatures,
    individualModulePerformanceJson: data.individual_module_performance,
  };
}

export const gatewayReadingManagementRouter = router({
  addNewGatewayReading: protectedProcedure.mutation(async () => {
    const transformed = transformSunspecJsonToGatewayReading(sunspecJson);

    const newReading = await prisma.gatewayReading.create({
      data: transformed,
    });

    return newReading;
  }),
  getReadingById: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const reading = await prisma.gatewayReading.findFirst({
        where: {
          gatewaySerialNumber: input.uuid,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!reading) {
        throw new Error('Reading not found');
      }

      return reading;
    }),
});
