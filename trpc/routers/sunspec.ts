import { procedure, protectedProcedure, router } from '../init';
import { gatewayDataInputSchema, type GatewayDataInput } from '../../types/solarData';
import { prisma } from '@/prisma/prisma';

export const solarDataRouter = router({
  saveSimplifiedSolarData: protectedProcedure
    .input(gatewayDataInputSchema)
    .mutation(async ({ input }) => {
      const {
        timestamp,
        gatewayDeviceIdentification,
        systemSummary,
        overallOperationalStatus,
        acGridParameters,
        environmentalContext,
        gatewayInternalTemperatures,
        individualModulePerformance,
      }: GatewayDataInput = input;
      const environmentalAndInternalData = {
        environmentalContext: environmentalContext,
        gatewayInternalTemperatures: gatewayInternalTemperatures,
      };

      const newGatewayReading = await prisma.gatewayReading.create({
        data: {
          timestamp: new Date(timestamp),
          gatewayManufacturer: gatewayDeviceIdentification.manufacturer,
          gatewayModel: gatewayDeviceIdentification.model,
          gatewaySerialNumber: gatewayDeviceIdentification.serialNumber,

          systemSummaryJson: systemSummary,
          overallOperationalStatusJson: overallOperationalStatus,
          acGridParametersJson: acGridParameters,
          environmentalContextJson: environmentalContext,
          gatewayInternalTemperaturesJson: gatewayInternalTemperatures,
          individualModulePerformanceJson: individualModulePerformance,
        },
      });

      return {
        success: true,
        message: 'Dane solarne (uproszczone) zapisane pomyślnie.',
        gatewayReadingId: newGatewayReading.id,
      };
    }),
});
