import { z } from 'zod';

// --- Podstawowe schematy ---
export const valueUnitSchema = z.object({
  value: z.number().nullable(),
  unit: z.string().nullable(),
});
export type ValueUnit = z.infer<typeof valueUnitSchema>;

export const panelPerformanceSchema = z.object({
  moduleId: z.string(),
  manufacturer: z.string(),
  dcVoltage: valueUnitSchema,
  dcCurrent: valueUnitSchema,
  dcPower: valueUnitSchema,
  temperature: valueUnitSchema,
  statusLabel: z.string().nullable(),
});
export type PanelPerformance = z.infer<typeof panelPerformanceSchema>;

export const gatewayDeviceIdentificationSchema = z.object({
  manufacturer: z.string(),
  model: z.string(),
  serialNumber: z.string(),
});
export type GatewayDeviceIdentification = z.infer<typeof gatewayDeviceIdentificationSchema>;

export const systemSummarySchema = z.object({
  total_ac_power_output: valueUnitSchema,
  total_dc_input_power: valueUnitSchema,
  energy_produced_today: valueUnitSchema,
  energy_produced_total_lifetime: valueUnitSchema,
});
export type SystemSummary = z.infer<typeof systemSummarySchema>;

export const overallOperationalStatusSchema = z.object({
  systemStateNumeric: z.number().nullable(),
  systemStateLabel: z.string().nullable(),
  faultCodeGeneral: z.number().nullable(),
  faultCodeVendor: z.number().nullable(),
});
export type OverallOperationalStatus = z.infer<typeof overallOperationalStatusSchema>;

export const acGridParametersSchema = z.object({
  gridFrequency: valueUnitSchema,
  phaseL1VoltageLn: valueUnitSchema,
  phaseL2VoltageLn: valueUnitSchema.optional(),
  phaseL3VoltageLn: valueUnitSchema.optional(),
});
export type AcGridParameters = z.infer<typeof acGridParametersSchema>;

export const environmentalContextSchema = z.object({
  planeOfArrayIrradiance: valueUnitSchema,
  ambientTemperature: valueUnitSchema,
});
export type EnvironmentalContext = z.infer<typeof environmentalContextSchema>;

export const gatewayInternalTemperaturesSchema = z.object({
  cabinetTemperature: valueUnitSchema,
  heatsinkTemperature: valueUnitSchema,
});
export type GatewayInternalTemperatures = z.infer<typeof gatewayInternalTemperaturesSchema>;

export const gatewayDataInputSchema = z.object({
  timestamp: z
    .string()
    .datetime({ message: 'Timestamp musi być poprawną datą w formacie ISO 8601' }),
  gatewayDeviceIdentification: gatewayDeviceIdentificationSchema,
  systemSummary: systemSummarySchema,
  overallOperationalStatus: overallOperationalStatusSchema,
  acGridParameters: acGridParametersSchema,
  environmentalContext: environmentalContextSchema,
  gatewayInternalTemperatures: gatewayInternalTemperaturesSchema,
  individualModulePerformance: z.array(panelPerformanceSchema),
});

export type GatewayDataInput = z.infer<typeof gatewayDataInputSchema>;

export const environmentalAndInternalDataSchema = z.object({
  environmentalContext: environmentalContextSchema,
  gatewayInternalTemperatures: gatewayInternalTemperaturesSchema,
});
export type EnvironmentalAndInternalData = z.infer<typeof environmentalAndInternalDataSchema>;
