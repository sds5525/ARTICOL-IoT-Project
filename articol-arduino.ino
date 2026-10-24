#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// ====== WiFi Credentials ======
const char* ssid = "OnePlus Nord CE 2";           // Replace with your WiFi SSID
const char* password = "santhu00";          // Replace with your WiFi password

// ====== MQTT Broker Settings ======
const char* mqtt_server = "broker.emqx.io";
const int mqttPort = 1883;
const char* mqtt_User = "Admin";
const char* mqtt_Password = "Password";
const char* pubTempTopic = "Articol/Temp";
const char* pubHumidTopic = "Articol/Humid";
const char* subtopic = "Articol/LED";
const char* pubSoundAnalogTopic = "Articol/SAnalog";
const char* pubSoundDigitalTopic = "Articol/SDigital";
const char* pubDistanceTopic = "Articol/Distance";
const char* pubPirTopic = "Articol/PIR";

// ====== GPIO Pin Definitions ======
const int redLED = 15;
const int yellowLED = 18;
const int greenLED=19;
const int whiteLED=23;
const int DHTPIN = 5;
const int pirPin = 25;
const int TRIG_PIN = 33;
const int ECHO_PIN = 32;
const int SOUND_AO = 27;
const int SOUND_DO = 26;

#define DHTTYPE DHT11

int pirState = LOW;    // Start assuming no motion is detected
int val = 0;

// ====== Global Variables ======
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastSensorRead = 0;
unsigned long lastStatusPrint = 0;
const long sensorInterval = 5000;
const long statusPrintInterval = 10000; // Show WiFi/MQTT status every 10 sec
unsigned long lastUltrasonicRead = 0;
const long ultrasonicInterval = 5000;   // 5 seconds
unsigned long lastSoundRead = 0;
const long soundInterval = 50;   // Read every 50 ms

bool wifiConnected = false;
bool mqttConnected = false;

// ====== WiFi Connection ======
void setup_wifi() {
  Serial.println("\n[INFO] Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 20) {
    delay(500);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ [SUCCESS] WiFi Connected!");
    Serial.print("[INFO] IP Address: ");
    Serial.println(WiFi.localIP());
    wifiConnected = true;
  } else {
    Serial.println("\n❌ [ERROR] WiFi Connection Failed! Check Credentials.");
    wifiConnected = false;
  }
}

// ====== MQTT Reconnection Handling ======
void reconnect() {
  if (!client.connected()) {
    Serial.println("\n[INFO] Connecting to MQTT...");

    // Generate a unique client ID using MAC address
    String clientId = "ESP32Client-";
    clientId += WiFi.macAddress(); 

    if (client.connect(clientId.c_str(), mqtt_User, mqtt_Password)) {
      Serial.println("✅ [SUCCESS] Connected to MQTT Broker!");
      client.subscribe(subtopic);
      Serial.print("[INFO] Subscribed to Topic: ");
      Serial.println(subtopic);
      mqttConnected = true;
    } else {
      Serial.print("❌ [ERROR] MQTT Connection Failed, Code: ");
      Serial.println(client.state());
      Serial.println("[INFO] Retrying in 2 seconds...");
      mqttConnected = false;
      delay(2000);
    }
  }
}

//====== LED Control Function ======
void controlLED(String msg) {
  if (msg == "on1") {
    digitalWrite(redLED, HIGH);
    Serial.println("[ACTION] Red LED Turned ON ✅");
  } else if (msg == "off1") {
    digitalWrite(redLED, LOW);
    Serial.println("[ACTION] Red LED Turned OFF ❌");
  }
   else if (msg == "on2") {
    digitalWrite(yellowLED, HIGH);
    Serial.println("[ACTION] Yellow LED Turned ON ✅");
  } else if (msg == "off2") {
    digitalWrite(yellowLED, LOW);
    Serial.println("[ACTION] Yellow LED Turned OFF ❌"); 
  }
  else if (msg == "on3") {
    digitalWrite(greenLED, HIGH);
    Serial.println("[ACTION] Green LED Turned ON ✅");
  } else if (msg == "off3") {
    digitalWrite(greenLED, LOW);
    Serial.println("[ACTION] Green LED Turned OFF ❌"); 
  }
  else if (msg == "on4") {
    digitalWrite(whiteLED, HIGH);
    Serial.println("[ACTION] White LED Turned ON ✅");
  } else if (msg == "off4") {
    digitalWrite(whiteLED, LOW);
    Serial.println("[ACTION] White LED Turned OFF ❌"); 
  } else if (msg == "on0") {
    digitalWrite(redLED, HIGH);
    digitalWrite(yellowLED, HIGH);
    digitalWrite(whiteLED, HIGH);
    digitalWrite(greenLED, HIGH);
    Serial.println("[ACTION] All LED Turned ON ✅");
  } else if (msg == "off0") {
    digitalWrite(redLED, LOW);
    digitalWrite(yellowLED, LOW);
    digitalWrite(whiteLED, LOW);
    digitalWrite(greenLED, LOW);
    Serial.println("[ACTION] All LED Turned OFF ❌");
  } else {
    Serial.println("[WARNING] Unknown Command Received! ❗");
  }
}

// ====== MQTT Callback Function ======
void callback(char* topic, byte* payload, unsigned int length) {
  String msgString;
  for (int i = 0; i < length; i++) {
    msgString += (char)payload[i];
  }

  Serial.print("\n📩 [RECEIVED] Message from ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(msgString);

  controlLED(msgString);
}

// ====== Publish Ultrasonic Distance Every 15 sec ======
void publishUltrasonicData() {

  if (millis() - lastUltrasonicRead >= ultrasonicInterval) {

    lastUltrasonicRead = millis();

    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);

    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);

    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);

    if (duration == 0) {
      Serial.println("⚠️ [ULTRASONIC] No Echo Received!");
      return;
    }

    float distance = duration * 0.0343 / 2;

    char distanceString[10];
    dtostrf(distance, 6, 2, distanceString);

    client.publish(pubDistanceTopic, distanceString);

    Serial.print("📏 Distance: ");
    Serial.print(distanceString);
    Serial.println(" cm");
  }
}


// ====== Publish Sensor Data (Non-Blocking) ======
void publishTempData() {
  if (millis() - lastSensorRead >= sensorInterval) {
    lastSensorRead = millis();
    
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (!isnan(temperature) && !isnan(humidity)) {
      char tempString[10], humidString[10];
      dtostrf(temperature, 6, 2, tempString);
      dtostrf(humidity, 6, 2, humidString);

      client.publish(pubTempTopic, tempString);
      Serial.print("📤 [PUBLISH] Temperature Sent to ");
      Serial.print(pubTempTopic);
      Serial.print(": ");
      Serial.println(tempString);

      client.publish(pubHumidTopic, humidString);
      Serial.print("📤 [PUBLISH] Humidity Sent to ");
      Serial.print(pubHumidTopic);
      Serial.print(": ");
      Serial.println(humidString);
    } else {
      Serial.println("❌ [ERROR] Failed to Read Temperature or Humidity!");
    }
  }
}

//====== Publish Sound Sensor Data Every 500 ms ======
void publishSoundData() {

  if (millis() - lastSoundRead >= soundInterval) {

    lastSoundRead = millis();

    int soundAnalog = analogRead(SOUND_AO);
    int soundDigital = digitalRead(SOUND_DO);

    // Publish Analog Value
    char analogString[10];
    sprintf(analogString, "%d", soundAnalog);
    client.publish(pubSoundAnalogTopic, analogString);

    // Publish Digital Value (for monitoring/debugging)
    char digitalString[2];
    sprintf(digitalString, "%d", soundDigital);
    client.publish(pubSoundDigitalTopic, digitalString);

    // Serial Monitor
     Serial.print("🎤 Sound -> Analog: ");
     Serial.print(soundAnalog);

     Serial.print(" | Digital: ");
     Serial.println(soundDigital);
   }
}

//=======PIR Sensor=============
void publishPIRData() {
  val = digitalRead(pirPin);

  if (val == HIGH) {

    if (pirState == LOW) {
        pirState = HIGH;

        client.publish(pubPirTopic, "1");
        Serial.print("📤 [PUBLISH] PIR Sent to ");
        Serial.print(pubPirTopic);
        Serial.println(": Motion Detected");
    }

  } else {

    if (pirState == HIGH) {
        pirState = LOW;

        client.publish(pubPirTopic, "0");
        Serial.print("📤 [PUBLISH] PIR Sent to ");
        Serial.print(pubPirTopic);
        Serial.println(": No Motion");
    }
  }
}

// ====== Print WiFi & MQTT Status Every 10 sec ======
void printStatus() {
  if (millis() - lastStatusPrint >= statusPrintInterval) {
    lastStatusPrint = millis();

    Serial.println("\n===== 📡 SYSTEM STATUS =====");
    Serial.print("🌐 WiFi: ");
    Serial.println(WiFi.status() == WL_CONNECTED ? "Connected ✅" : "Disconnected ❌");

    Serial.print("🔌 MQTT: ");
    Serial.println(client.connected() ? "Connected ✅" : "Disconnected ❌");
    Serial.println("============================\n");
  }
}

// ====== Arduino Setup ======
void setup() {
  Serial.begin(115200);
  Serial.println("\n===== 🚀 ESP32 MQTT Sensor Node Booting... =====");

  setup_wifi();
  
  client.setServer(mqtt_server, mqttPort);
  client.setCallback(callback);

  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(whiteLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(pirPin, INPUT);
  Serial.println("Calibrating sensor... Please wait.");
  delay(2000); 
  Serial.println("PIR Sensor Ready!");
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(SOUND_DO, INPUT);
  pinMode(SOUND_AO, INPUT);
  dht.begin();
}

// ====== Arduino Loop ======
void loop() {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ [WARNING] WiFi Disconnected! Reconnecting...");
    setup_wifi();
  }

  if (!client.connected()) {
    Serial.println("⚠️ [WARNING] MQTT Disconnected! Reconnecting...");
    reconnect();
  }

  client.loop();  
  publishTempData();  
  publishSoundData();
  publishUltrasonicData();
  publishPIRData();
  printStatus(); // Show system status every 10 sec
}