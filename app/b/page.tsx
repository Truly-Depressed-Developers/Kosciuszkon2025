import { trpc } from '@/trpc/server';

const data = {
  "timestamp": "2025-05-31T20:10:00Z",
  "gatewayDeviceIdentification": {
    "manufacturer": "GatewayProducentXYZ",
    "model": "GatewayModel-1000",
    "serialNumber": "GW-SN-987654321"
  },
  "systemSummary": {
    "totalAcPowerOutput": {
      "value": 5750.0,
      "unit": "W"
    },
    "totalDcInputPower": {
      "value": 5980.0,
      "unit": "W"
    },
    "energyProducedToday": {
      "value": 28.5,
      "unit": "kWh"
    },
    "energyProducedTotalLifetime": {
      "value": 15264.2,
      "unit": "kWh"
    }
  },
  "overallOperationalStatus": {
    "systemStateNumeric": 4,
    "systemStateLabel": "Producing",
    "faultCodeGeneral": 0,
    "faultCodeVendor": 0
  },
  "individualModulePerformance": [
    {
      "moduleId": "Rzad1_Panel1_SN_PANEL_A123",
      "manufacturer": "PanelProducentA",
      "dcVoltage": {
        "value": 35.5,
        "unit": "V"
      },
      "dcCurrent": {
        "value": 8.1,
        "unit": "A"
      },
      "dcPower": {
        "value": 287.5,
        "unit": "W"
      },
      "temperature": {
        "value": 42.0,
        "unit": "°C"
      },
      "statusLabel": "Optimal"
    },
    {
      "moduleId": "Rzad1_Panel2_SN_PANEL_B456",
      "manufacturer": "PanelProducentB",
      "dcVoltage": {
        "value": 35.2,
        "unit": "V"
      },
      "dcCurrent": {
        "value": 8.0,
        "unit": "A"
      },
      "dcPower": {
        "value": 281.6,
        "unit": "W"
      },
      "temperature": {
        "value": 41.5,
        "unit": "°C"
      },
      "statusLabel": "Optimal"
    }
  ],
  "acGridParameters": {
    "gridFrequency": {
      "value": 50.02,
      "unit": "Hz"
    },
    "phaseL1VoltageLn": {
      "value": 231.0,
      "unit": "V"
    },
    "phaseL2VoltageLn": {
      "value": 230.5,
      "unit": "V"
    },
    "phaseL3VoltageLn": {
      "value": 230.8,
      "unit": "V"
    }
  },
  "environmentalContext": {
    "planeOfArrayIrradiance": {
      "value": 880.0,
      "unit": "W/m^2"
    },
    "ambientTemperature": {
      "value": 26.0,
      "unit": "°C"
    }
  },
  "gatewayInternalTemperatures": {
    "cabinetTemperature": {
      "value": 38.5,
      "unit": "Cel"
    },
    "heatsinkTemperature": {
      "value": 45.0,
      "unit": "Cel"
    }
  }
}

export default async function ExampleServerComponent() {
  const exampleData = await trpc.sunspec.saveSimplifiedSolarData(data);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>Example server component</h3>
      </div>
      <div>
        <h3>User data</h3>
      </div>
    </div>
  );
}
