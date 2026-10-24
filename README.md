# ARTICOL — Artifact Intelligence & Threat Correlation Operations Layer

> An end-to-end IoT and edge-intelligence security operations system for museum artifact protection, visitor flow tracking, and cross-archive threat correlation.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node-RED](https://img.shields.io/badge/Node--RED-Middleware-8F0000?logo=node-red&logoColor=white)](https://nodered.org/)
[![ESP32](https://img.shields.io/badge/ESP32-Arduino-E7352C?logo=espressif&logoColor=white)](https://www.espressif.com/)
[![MQTT](https://img.shields.io/badge/MQTT-EMQX%20Broker-005571?logo=mqtt&logoColor=white)](https://www.emqx.io/)
[![License](https://img.shields.io/badge/License-<ADD_LICENSE_e.g._MIT>-green.svg)](#license)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](#)

---

## 🏛️ Overview

High-value cultural artifacts and museum collections face continuous security risks ranging from physical theft and proximity intrusions to silent environmental degradation caused by temperature and humidity spikes. 

**ARTICOL** (*Artifact Intelligence & Threat Correlation Operations Layer*) resolves this with a synchronized three-tier architecture: edge microcontrollers (ESP32) capture continuous multi-sensor telemetry, a central Node-RED engine executes real-time correlation and threat-scoring algorithms, and a sleek React 19 command-center dashboard gives facility operators complete situational awareness and emergency controls.

The platform is designed for museum curatorial teams, archive security supervisors, and conservation facility managers seeking real-time threat intelligence and automated incident response.

---

## ✨ Features

- **Multi-Sensor Edge Monitoring**: Real-time telemetry gathering from ESP32 edge nodes using DHT11 (temperature & humidity), PIR motion detection, HC-SR04 ultrasonic distance sensing (pedestal displacement & proximity), and acoustic sound sensors.
- **Dynamic Threat Scoring Engine (0–100 Index)**: Weighted rule evaluation aggregating after-hours movements, proximity violations, acoustic anomalies, and artifact displacements into clear threat tiers: `SAFE`, `WARNING`, and `CRITICAL`.
- **Cross-Archive Threat Correlation**: Detects coordinated or sequential intrusion patterns occurring between distinct archive zones (Zone A and Zone B) within an 8-second correlation window (+70 threat score).
- **Directional Visitor Flow Tracking**: Dual ultrasonic beam array at facility entrances computing visitor entries and exits via a finite state machine for live occupancy monitoring.
- **High-Security Vault C Access Enforcement**: Configurable access modes (`RESTRICTED` vs `PUBLIC`) featuring variable distance-perimeter radar triggers (<20 cm critical breach, 20–50 cm warning perimeter, 50–100 cm detection notice).
- **Bidirectional Hardware Actuation**: Remote control of 4-color status LED indicators (Green = Safe, Yellow = Warning, Red = Critical/Lockdown, White = Occupancy) and piezo buzzers via MQTT.
- **Central Lockdown & Operator Acknowledgment**: Instant global facility lockdown controls and a latched alert mechanism that enforces physical artifact replacement before alarms can be dismissed.

---

## 📸 Demo & Screenshots

![ARTICOL Hero Interface](src/assets/hero.png)

> **Live Demo**: <ADD LIVE DEMO LINK>  
> *(Optional demonstration video or live deployment link)*

---

## 🛠️ Tech Stack

### Frontend Command Center
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: Vanilla CSS with dark theme, glassmorphism design tokens, and CSS Grid
- **Icons & Graphics**: Inline SVG & custom SVG vector assets

### Backend & Middleware
- **Engine**: [Node-RED](https://nodered.org/) (Port 1880)
- **Logic**: Custom JavaScript function nodes, Finite State Machines (FSM), and Global/Flow context stores
- **API**: HTTP REST Endpoints for live dashboard polling and control commands

### Embedded & IoT Hardware
- **Microcontroller**: ESP32 Dev Module
- **Sensors**: 
  - DHT11 (Ambient Temperature & Relative Humidity)
  - HC-SR04 (Ultrasonic Distance & Pedestal Displacement)
  - PIR Sensor (Passive Infrared Motion Detection)
  - Sound Sensor Module (Analog sound levels & Digital threshold triggers)
- **Actuators**: 4-channel LED status array (Red, Yellow, Green, White), Piezo Buzzer, Emergency Pushbutton

### Communication & Protocols
- **MQTT**: PubSubClient library over EMQX Public Broker (`broker.emqx.io:1883`)
- **HTTP/REST**: Low-latency polling (`2000 ms`) between React dashboard and Node-RED middleware

---

## 📂 Project Structure

```text
smart-museum-dashboard/
├── articol-arduino.ino          # ESP32 firmware source: WiFi, MQTT, sensor reading & LED actuation
├── ARTICOL - NodeRed Flow.json  # Complete Node-RED pipeline: correlation engine, FSM visitor logic, REST APIs
├── index.html                   # HTML entry point for the React dashboard
├── package.json                 # Project dependencies, build, and dev scripts
├── vite.config.js               # Vite configuration and React plugin setup
├── eslint.config.js             # ESLint configuration
├── public/                      # Static assets and icons
│   ├── favicon.svg              # Dashboard favicon
│   └── icons.svg                # Shared SVG symbols
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application state, telemetry polling, and event collation
    ├── App.css                  # Complete styling system, glassmorphism UI, and responsive layouts
    ├── index.css                # Base stylesheet and font definitions
    ├── assets/                  # UI images and assets (hero preview, branding)
    ├── components/              # Modular UI components
    │   ├── Header.jsx           # Command center header with live Indian Standard Time clock
    │   ├── MuseumMap.jsx        # Interactive archive floor plan with live status pins
    │   ├── GalleryCard.jsx      # Individual archive zone summary cards
    │   ├── ManualControls.jsx   # Vault C mode toggle, lockdown trigger, and alert acknowledgement
    │   └── Gauge.jsx            # SVG circular and linear telemetry gauges
    ├── pages/                   # Main view containers
    │   ├── Dashboard.jsx        # Primary security operations overview
    │   └── GalleryPage.jsx      # In-depth single archive intelligence & sensor radar view
    └── data/
        └── dummyData.js         # Base configuration, gallery definitions, and fallback dataset
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (`v18.0.0` or higher recommended)
- [npm](https://www.npmjs.com/) (`v9.0.0` or higher)
- [Node-RED](https://nodered.org/docs/getting-started/) (`npm install -g --unsafe-perm node-red`)
- [Arduino IDE](https://www.arduino.cc/en/software) (with ESP32 board support package installed)
- Arduino Libraries:
  - `PubSubClient` by Nick O'Leary
  - `DHT sensor library` by Adafruit
  - `Adafruit Unified Sensor`

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/sds5525/ARTICOL-IoT-Project.git
cd ARTICOL-IoT-Project
```

### Step 2: Configure & Flash the ESP32 Hardware

1. Open `articol-arduino.ino` in Arduino IDE.
2. Select your board: **Tools > Board > ESP32 Arduino > ESP32 Dev Module**.
3. Update the WiFi credentials and MQTT broker in the code:
   ```cpp
   // ====== WiFi Credentials ======
   const char* ssid = "<YOUR_WIFI_SSID>";
   const char* password = "<YOUR_WIFI_PASSWORD>";

   // ====== MQTT Broker Settings ======
   const char* mqtt_server = "broker.emqx.io";
   const int mqttPort = 1883;
   ```
4. Verify GPIO pin assignments against your hardware setup:
   - DHT11 Data: `GPIO 5`
   - PIR Sensor: `GPIO 25`
   - Ultrasonic TRIG / ECHO: `GPIO 33` / `GPIO 32`
   - Sound AO / DO: `GPIO 27` / `GPIO 26`
   - Status LEDs: Red (`15`), Yellow (`18`), Green (`19`), White (`23`)
5. Connect your ESP32 via USB and click **Upload**. Open the Serial Monitor at `115200 baud` to verify connectivity.

---

### Step 3: Import & Run the Node-RED Middleware

1. Launch Node-RED in a terminal:
   ```bash
   node-red
   ```
2. Open your browser and navigate to `http://localhost:1880`.
3. Click the top-right menu **☰ > Import**.
4. Select `ARTICOL - NodeRed Flow.json` from the repository root and click **Import**.
5. Click **Deploy** in the top-right corner to start the flow.

---

### Step 4: Run the React Dashboard

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the local Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and visit the URL displayed in the terminal (typically `http://localhost:5173`).

To generate an optimized production build:
```bash
npm run build
npm run preview
```

---

## ⚙️ Environment & Configuration

| Configuration / Setting | Location | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **WiFi SSID** | `articol-arduino.ino` | *User-defined* | Network SSID for ESP32 connectivity |
| **WiFi Password** | `articol-arduino.ino` | *User-defined* | WPA2 password for local wireless network |
| **MQTT Broker** | `articol-arduino.ino` & Node-RED | `broker.emqx.io` | MQTT broker host address |
| **MQTT Port** | `articol-arduino.ino` & Node-RED | `1883` | Unencrypted TCP MQTT port |
| **Node-RED Port** | Node-RED Runtime | `1880` | Local port serving the REST API endpoints |
| **Dashboard Polling Interval** | `src/App.jsx` | `2000 ms` | Polling frequency for archive telemetry |

---

## 📡 Usage & System Architecture

### REST API Endpoints (Node-RED Middleware)

The frontend polls and interacts with the following Node-RED endpoints:

| Method | Endpoint | Description | Sample Request / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/archive/A` | Real-time telemetry, threat score & status for Archive Zone A | `{"id":"A","status":"SAFE","threatScore":0,"temperature":24,"humidity":55,...}` |
| `GET` | `/api/archive/B` | Real-time telemetry, threat score & status for Archive Zone B | `{"id":"B","status":"WARNING","threatScore":45,...}` |
| `GET` | `/api/archive/C` | Real-time telemetry & access mode for High-Security Vault C | `{"id":"C","accessMode":"RESTRICTED","distance":14,...}` |
| `GET` | `/api/visitors` | Live bidirectional visitor headcount | `{"visitorCount": 24}` |
| `POST` | `/api/archiveC/mode` | Toggle Vault C security policy (`RESTRICTED` / `PUBLIC`) | `{"restricted": true}` |
| `POST` | `/api/lockdown` | Activate or release emergency museum lockdown | `{"enabled": true}` |
| `POST` | `/api/acknowledge` | Acknowledge alarm (requires artifact replaced) | `{"success": true}` |

### MQTT Telemetry Topics

| Topic | Publisher | Payload Format | Description |
| :--- | :--- | :--- | :--- |
| `Articol/Temp` | ESP32 | Float string (`"24.50"`) | Ambient temperature in °C |
| `Articol/Humid` | ESP32 | Float string (`"58.20"`) | Relative humidity percentage |
| `Articol/Distance` | ESP32 | Float string (`"3.50"`) | Measured ultrasonic distance in cm |
| `Articol/SAnalog` | ESP32 | Integer string (`"420"`) | Raw microphone analog reading |
| `Articol/SDigital` | ESP32 | `"0"` or `"1"` | Digital sound threshold breach |
| `Articol/PIR` | ESP32 | `"0"` or `"1"` | Motion detection state |
| `Articol/LED` | Node-RED | String commands (e.g. `"on1"`, `"off2"`) | Actuator instructions sent to ESP32 LEDs |
| `Articol/Buzzer` | Node-RED | `"ON"` or `"OFF"` | Audible alarm activation |

---

## 🧪 Testing & Validation

### Dashboard Code Quality
Run ESLint to verify code structure and syntax rules:
```bash
npm run lint
```

### Hardware Verification
1. Connect the ESP32 to your workstation and open the Serial Monitor (`115200 baud`).
2. Verify output logs indicating successful WiFi connection (`[SUCCESS] WiFi Connected!`) and MQTT subscription (`Subscribed to Topic: Articol/LED`).
3. Wave a hand across the PIR sensor or displace an object in front of the ultrasonic sensor to verify immediate serial printouts and MQTT message publication.

### Node-RED Debugging
1. Open `http://localhost:1880` and view the right-hand **Debug Messages** panel.
2. Toggle the inject nodes or review logs for `/api/archive/*` to verify incoming telemetry payloads and threat score computations.

---

## 🗺️ Roadmap & Future Improvements

- [ ] **Camera AI Integration**: Trigger automated snapshot captures and YOLO object detection when perimeter breaches occur.
- [ ] **Persistent Time-Series Database**: Integrate InfluxDB / TimescaleDB with Grafana for long-term climate preservation analytics.
- [ ] **MQTTS TLS Encryption**: Upgrade broker communication to TLS (Port 8883) with device certificate authentication.
- [ ] **Role-Based Access Control (RBAC)**: Implement secure operator authentication and auditable command logs for lockdown triggers.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the `<ADD LICENSE e.g. MIT>` License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author & Contact

- **Author**: [@sds5525](https://github.com/sds5525)
- **Project Repository**: [https://github.com/sds5525/ARTICOL-IoT-Project](https://github.com/sds5525/ARTICOL-IoT-Project)
- **Facility**: Bengaluru Archive Facility, India
