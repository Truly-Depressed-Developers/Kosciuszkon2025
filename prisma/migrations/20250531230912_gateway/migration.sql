-- CreateTable
CREATE TABLE "GatewayReading" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "gatewayManufacturer" TEXT NOT NULL,
    "gatewayModel" TEXT NOT NULL,
    "gatewaySerialNumber" TEXT NOT NULL,
    "systemSummaryJson" JSONB NOT NULL,
    "overallOperationalStatusJson" JSONB NOT NULL,
    "acGridParametersJson" JSONB NOT NULL,
    "environmentalContextJson" JSONB NOT NULL,
    "gatewayInternalTemperaturesJson" JSONB NOT NULL,
    "individualModulePerformanceJson" JSONB NOT NULL,

    CONSTRAINT "GatewayReading_pkey" PRIMARY KEY ("id")
);
