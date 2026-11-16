
#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "p";
const char* password = "pppppppp";

// ESP32 pins
#define PIR_PIN 27
#define LED_PIN 26

// Create web server
WebServer server(80);

// Read PIR sensor
void handleMotion() {

  int motion = digitalRead(PIR_PIN);

  String response = "{\"motion\":";

  if (motion == HIGH) {
    response += "true";
  } else {
    response += "false";
  }

  response += "}";

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

// Turn LED ON
void handleLedOn() {

  digitalWrite(LED_PIN, HIGH);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "LED is ON");

  Serial.println("LED turned ON");
}

// Turn LED OFF
void handleLedOff() {

  digitalWrite(LED_PIN, LOW);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "LED is OFF");

  Serial.println("LED turned OFF");
}

void setup() {

  Serial.begin(115200);

  // Configure pins
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(LED_PIN, LOW);

  // Connect to WiFi
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {

    delay(500);
    Serial.print(".");
  }

  Serial.println();

  Serial.println("WiFi connected!");

  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Register HTTP endpoints
  server.on("/motion", HTTP_GET, handleMotion);

  server.on("/led/on", HTTP_GET, handleLedOn);

  server.on("/led/off", HTTP_GET, handleLedOff);

  // Start server
  server.begin();

  Serial.println("Server started!");
}

void loop() {

  server.handleClient();

}
