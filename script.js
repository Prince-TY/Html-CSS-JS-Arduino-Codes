
let motionCount = 0;
let previousMotion = false;

const ESP32_IP = "192.168.137.21";

async function checkMotion() {

    try {

        const response = await fetch(
            `http://${ESP32_IP}/motion`
        );

        const data = await response.json();

        if (data.motion === true) {

            if (!previousMotion) {

                motionCount++;

                document.getElementById("count").innerHTML =
                    motionCount;

                document.getElementById("lastTime").innerHTML =
                    new Date().toLocaleTimeString();
            }

            document.getElementById("status").innerHTML =
                "MOTION DETECTED!";

            document.getElementById("status").className =
                "status danger";

            document.getElementById("message").innerHTML =
                "Warning! Movement detected in the monitored area.";

        } else {

            document.getElementById("status").innerHTML =
                "NO MOTION DETECTED";

            document.getElementById("status").className =
                "status safe";

            document.getElementById("message").innerHTML =
                "The monitored area is safe.";
        }

        previousMotion = data.motion;

    } catch (error) {

        document.getElementById("message").innerHTML =
            "Cannot connect to ESP32. Check your WiFi connection.";

        console.log(error);
    }
}


// TURN LED ON
async function turnLedOn() {

    try {

        const response = await fetch(
            `http://${ESP32_IP}/led/on`
        );

        if (!response.ok) {
            throw new Error("LED ON failed");
        }

        document.getElementById("ledStatus").innerHTML =
            "LED IS ON";

        document.getElementById("ledStatus").className =
            "led-status on";

    } catch (error) {

        alert("Cannot turn LED ON!");

        console.log(error);
    }
}


// TURN LED OFF
async function turnLedOff() {

    try {

        const response = await fetch(
            `http://${ESP32_IP}/led/off`
        );

        if (!response.ok) {
            throw new Error("LED OFF failed");
        }

        document.getElementById("ledStatus").innerHTML =
            "LED IS OFF";

        document.getElementById("ledStatus").className =
            "led-status";

    } catch (error) {

        alert("Cannot turn LED OFF!");

        console.log(error);
    }
}


// Check sensor every 500 milliseconds
setInterval(checkMotion, 500);
