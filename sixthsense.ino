#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "HackTheNorth";
const char* password = "HTNX2024";


Servo myServo;
int servoPin = 13;
int angle = 0;          // Initial angle
int angleStep = 1;      // Step size for each angle change
int delayTime = 15;     // Delay between steps (controls speed of movement)

// Ultrasonic sensor pins
int trig = 18;
int echo = 5;

// DC Motor pin
int dcmotor = 21;
boolean call = false;

// Variables to store distance and max distance
float distance = 0.0;
float threshold = 10.0; // Distance threshold for turning on the motor

WiFiServer server(10000);

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(100);
  }
  server.begin();
  Serial.println(WiFi.localIP());
  boolean  alreadyConnected = false;

  
  myServo.attach(servoPin);
  myServo.write(angle);

  // Set up ultrasonic sensor and motor pins
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(dcmotor, OUTPUT);
  digitalWrite(dcmotor, LOW);  // Ensure motor is off initially
}

void loop() {
  
  // Print the current distance measured by the ultrasonic sensor
  Serial.print("Distance: ");
  Serial.println(distance);
  
  
  // Measure distance using the ultrasonic sensor
  search();
  // Move the servo back and forth between 0 and 180 degrees
  myServo.write(angle);
  angle += angleStep;

  // Reverse direction when the limits are reached
  if (angle <= 0 || angle >= 180) {
    angleStep = -angleStep;
  }
  delay(delayTime); // Control speed of movement
}

void search() {
  HTTPClient http;
  // Send a 10 µs pulse to the trig pin
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  // Measure the duration of the pulse on the echo pin
  long duration = pulseIn(echo, HIGH);

  // Calculate distance in centimeters (speed of sound is approx. 0.034 cm/us)
  distance = duration * 0.034 / 2;

  //Check if distance is below the threshold

  if (distance <= threshold) {
    Serial.println("Too close!");
    digitalWrite(dcmotor, HIGH);  // Turn on the motor
    if (distance<3){
      Serial.println("fall detected, call emergency contact");
      call = true;
      http.begin("http://10.37.117.194:3000/?fell=true");// make sure to keep IP address updated
      int httpCode = http.GET();
      if (httpCode > 0) {
        Serial.printf("HTTP GET successful, code: %d\n", httpCode);
      } else {
        Serial.printf("HTTP GET failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    } else call = false;
    delay(10);
    search();
  } else {
    digitalWrite(dcmotor, LOW);   // Turn off the motor
  }
}
