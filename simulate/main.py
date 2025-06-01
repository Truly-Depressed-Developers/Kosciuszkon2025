import requests
import json
import time
import random
import datetime
import pytz
import schedule
from typing import Tuple, List

statusToVoltageRange = {"good": (34, 38), "warning": (26, 29), "bad": (5, 8)}
statusToCurrentRange = {"good": (8, 8.5), "warning": (6.2, 6.6), "bad": (1.4, 1.7)}
statusToTemperatureRange = {"good": (42, 45), "warning": (42, 45), "bad": (42, 45)}

statusesPerIndex = [
    "good",
    "good",
    "good",
    "bad",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "bad",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "good",
    "warning",
    "good",
    "good",
    "good",
]


def randomFloatInRange(status: str, range):
    r = range[status]
    return random.random() * (r[1] - r[0]) + r[0]


# Configuration
ENDPOINT_URL = "http://localhost:3000/api/trpc/sunspec.saveSimplifiedSolarData?batch=1"
POST_INTERVAL_SECONDS = 10

DATA_TEMPLATE = {
    "timestamp": None,
    "gatewayDeviceIdentification": {
        "manufacturer": None,
        "model": None,
        "serialNumber": None,
    },
    "systemSummary": {
        "total_ac_power_output": {"value": 5750, "unit": "W"},
        "total_dc_input_power": {"value": 5980, "unit": "W"},
        "energy_produced_today": {"value": 28.5, "unit": "kWh"},
        "energy_produced_total_lifetime": {"value": 15264.2, "unit": "kWh"},
    },
    "overallOperationalStatus": {
        "systemStateNumeric": 4,
        "systemStateLabel": "Producing",
        "faultCodeGeneral": 0,
        "faultCodeVendor": 0,
    },
    "individualModulePerformance": None,
    "acGridParameters": {
        "gridFrequency": {"value": 50.02, "unit": "Hz"},
        "phaseL1VoltageLn": {"value": 231, "unit": "V"},
        "phaseL2VoltageLn": {"value": 230.5, "unit": "V"},
        "phaseL3VoltageLn": {"value": 230.8, "unit": "V"},
    },
    "environmentalContext": {
        "planeOfArrayIrradiance": {"value": 880, "unit": "W/m^2"},
        "ambientTemperature": {"value": 26, "unit": "°C"},
    },
    "gatewayInternalTemperatures": {
        "cabinetTemperature": {"value": 38.5, "unit": "Cel"},
        "heatsinkTemperature": {"value": 45, "unit": "Cel"},
    },
}


def generateModulesArray(indices: List[Tuple[int, int, str]]):
    return [generatePanelData(x, y, status) for x, y, status in indices]


def generatePanelData(x: int, y: int, status: str):
    voltage = randomFloatInRange(status, statusToVoltageRange)
    current = randomFloatInRange(status, statusToCurrentRange)
    power = voltage * current
    temperature = randomFloatInRange(status, statusToTemperatureRange)

    return {
        "moduleId": f"{x}_{y}_PANEL_B456",
        "manufacturer": "PanelProducentB",
        "dcVoltage": {"value": voltage, "unit": "V"},
        "dcCurrent": {"value": current, "unit": "A"},
        "dcPower": {"value": power, "unit": "W"},
        "temperature": {"value": temperature, "unit": "°C"},
        "statusLabel": status,
    }


def generate_data(manufacturer, model, serialNumber):
    """
    Generates a dictionary containing the data to be sent.
    This function can be customized to fetch data from sensors,
    databases, or any other source.  This example generates random data.
    """
    data = DATA_TEMPLATE.copy()
    data["timestamp"] = datetime.datetime.now(pytz.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    data["individualModulePerformance"] = generateModulesArray(
        [
            (x + 1, y + 1, statusesPerIndex[y * 5 + x])
            for x in range(0, 5)
            for y in range(0, 5)
        ]
    )

    data["systemSummary"]["total_dc_input_power"]["value"] = sum(
        [cell["dcPower"]["value"] for cell in data["individualModulePerformance"]]
    )

    data["gatewayDeviceIdentification"]["manufacturer"] = manufacturer
    data["gatewayDeviceIdentification"]["model"] = model
    data["gatewayDeviceIdentification"]["serialNumber"] = serialNumber

    return data


def post_data(manufacturer, model, serialNumber):
    """
    Posts the JSON payload to the specified endpoint.
    """
    data = generate_data(manufacturer, model, serialNumber)
    data = {"0": {"json": data}}
    print(data)
    try:
        response = requests.post(ENDPOINT_URL, json=data)
        response.raise_for_status()
        print(f"Successfully posted data: {data}")
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content}")

    except requests.exceptions.RequestException as e:
        print(f"Error posting data: {e}")


def create_panels(w: int, h: int):
    return ["good" for x in range(w) for y in range(h)]


def degrade_panels(panels, degradeLimit):
    good_indices = [i for i, s in enumerate(panels) if s == "good"]

    if len(panels) - len(good_indices) <= degradeLimit:
        return panels

    if good_indices:
        index_to_switch = random.choice(good_indices)
        panels[index_to_switch] = "bad"
    return panels


def create_datasource(
    manufacturer, model, serialNumber, sendDelay, degradeDelay, degradeLimit
):
    panels = create_panels(5, 5)

    schedule.every(sendDelay).seconds.do(
        lambda: post_data(manufacturer, model, serialNumber)
    )
    schedule.every(degradeDelay).seconds.do(
        lambda: degrade_panels(panels, degradeLimit)
    )


if __name__ == "__main__":
    # GW-SN-987654321

    create_datasource("BiSolar", "Hyundai IONIQ 5", "HY-IO-632829582", 10, 180, 5)

    while True:
        schedule.run_pending()
        time.sleep(1)
