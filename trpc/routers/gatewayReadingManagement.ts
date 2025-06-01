import { z } from 'zod';
import { prisma } from '@/prisma/prisma';
import { router, protectedProcedure } from '../init';
import sunspecJson from '@/trpc/sunspec_example.json';
import { SystemSummary } from '@/types/solarData';

type Panel = {
  id: string;
  moduleId: string;
  statusLabel: 'good' | 'warning' | 'bad';
  // Add other properties as needed
};

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
    const readings = [];
    const transformed = transformSunspecJsonToGatewayReading(sunspecJson);
    // for (let i = 0; i < 4; i++) {
    const newSimulationReading = {
      ...transformed,
      timestamp: new Date(transformed.timestamp.getTime() + 1 * 1000), // Simulate different timestamps
      gatewaySerialNumber: `${transformed.gatewaySerialNumber}-1`, // Simulate different serial numbers
      individualModulePerformanceJson: transformed.individualModulePerformanceJson.map(
        (module) => ({
          ...module,
          module_id: `${module.module_id}-1`, // Simulate different module IDs
          status_label: module.status_label === 'bad' ? 'good' : module.status_label,
        })
      ),
    };

    const newSimulationReading2 = {
      ...transformed,
      timestamp: new Date(transformed.timestamp.getTime() + 2 * 1000), // Simulate different timestamps
      gatewaySerialNumber: `${transformed.gatewaySerialNumber}-2`, // Simulate different serial numbers
      individualModulePerformanceJson: transformed.individualModulePerformanceJson.map(
        (module) => ({
          ...module,
          module_id: `${module.module_id}-2`, // Simulate different module IDs
          status_label: 'good',
        })
      ),
    };

    // }
    // readings.push(transformed);
    // readings.push(newSimulationReading);
    // readings.push(newSimulationReading2);
    const newReading = await prisma.gatewayReading.create({
      data: readings[0],
    });
    await prisma.gatewayReading.create({
      data: readings[1],
    });
    await prisma.gatewayReading.create({
      data: readings[2],
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

      return reading?.individualModulePerformanceJson as Panel[] | undefined;
    }),
  getReadingSummary: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log("aaaaaaaaaaaaaaaaaaa");

      const reading = await prisma.gatewayReading.findFirst({
        where: {
          gatewaySerialNumber: input.uuid,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(reading);


      return reading?.systemSummaryJson as SystemSummary | undefined;
    }),
});
