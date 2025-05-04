import pymongo
import paho.mqtt.client as mqtt
import ssl
import json
import time
import random

# MongoDB connection details
MONGO_URI = "mongodb+srv://Admin:AdminSRM2026@cluster0.prm7wbb.mongodb.net/UserData?retryWrites=true&w=majority"
DB_NAME = "UserData"
COLLECTION_NAME = "usercredentials"

# MQTT broker details
MQTT_BROKER = "f8100f3ba7cf45558c79b58a122928fb.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USERNAME = "swiftadmin"
MQTT_PASSWORD = "Hello@2004"

# Connect to MongoDB (with TLS)
try:
    mongo_client = pymongo.MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    db = mongo_client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # Fetch user IDs
    users = collection.find({}, {"_id": 1})
    user_ids = [str(user["_id"]) for user in users]
    print(f"✅ Successfully connected to MongoDB. Found {len(user_ids)} users.")

except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit(1)

# Function to generate random health data
def generate_health_data(user_id):
    return {
        "userId": user_id,
        "heartRate": random.randint(60, 100),
        "oxygenSaturation": random.randint(92, 100),
        "temperature": round(random.uniform(36.5, 38.5), 1),
        "bloodPressure": f"{random.randint(100, 130)}/{random.randint(70, 90)}",
        "respiratoryRate": random.randint(12, 20),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT broker successfully!")
    else:
        print(f"❌ MQTT connection failed with code {rc}")

def on_publish(client, userdata, mid):
    print(f"📡 Message {mid} published.")

# Setup MQTT client
mqtt_client = mqtt.Client()
mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
mqtt_client.tls_set(tls_version=ssl.PROTOCOL_TLS)
mqtt_client.on_connect = on_connect
mqtt_client.on_publish = on_publish

# Connect and start MQTT
try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT)
except Exception as e:
    print(f"❌ Failed to connect to MQTT broker: {e}")
    exit(1)

mqtt_client.loop_start()

# Publishing health data every few seconds
try:
    while True:
        for user_id in user_ids:
            data = generate_health_data(user_id)
            topic = f"patient/health/{user_id}"
            mqtt_client.publish(topic, json.dumps(data))
            print(f"✅ Published to {topic}: {data}")
        time.sleep(3)  # Wait 3 seconds before sending next batch

except KeyboardInterrupt:
    print("\n🛑 Publishing stopped by user.")
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
