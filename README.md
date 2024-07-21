# Discord Shock Collar

This project allows for remote control of a shock collar via Discord messages. The collar can be commanded to shock or buzz, with the commands being relayed through a microcontroller connected to a serial port.

## Disclaimer
This project is for research purposes only. I am in no way responsible for any harm, injury, or damages that may occur from the use or misuse of this project.

## Table of Contents
- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [Credits](#credits)

## Hardware Requirements
- Microcontroller (e.g., ESP32)
- RF Transmitter
- Shock collar
- LED (optional for visual feedback)
- Connecting wires

## Software Requirements
- Arduino IDE
- Node.js
- Discord.js-selfbot-v13
- serialport npm package

## Installation

### Arduino
1. Connect the TX_PIN (Pin 17) to the RF transmitter.
2. Connect an LED to the LED_BUILTIN pin (Pin 2) (optional).
3. Upload the provided Arduino sketch to the microcontroller.

### Node.js
1. Clone the repository.
    ```bash
    git clone https://github.com/cvars/Discord-Shock-Collar.git
    cd Discord-Shock-Collar
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the Node.js server:
    ```bash
    node index.js
    ```
2. Send commands via Discord DM:
    - `shock` to trigger a shock.
    - `buzz` to trigger a buzz.

## Code Explanation

### Arduino Sketch
- **Constants and Enumerations**:
    - `LED_BUILTIN`, `TX_PIN`: Define the pin numbers for the LED and transmitter.
    - `BIT_DURATION`, `DELIMITER_DURATION`, `PREAMBLE_HIGH_DURATION`, `PREAMBLE_LOW_DURATION`: Define durations for signal transmission.
    - `CHANNEL`, `TYPE`: Enumerations for channel and type of signal.

- **Functions**:
    - `tx_delim()`: Transmits delimiter.
    - `tx_bit(bool value)`: Transmits a single bit.
    - `tx_preamble()`: Transmits preamble.
    - `tx_single_packet()`: Transmits a single packet.
    - `tx_packet()`: Transmits multiple packets.
    - `setup()`: Initializes the microcontroller.
    - `loop()`: Main loop for receiving and processing serial commands.

### Node.js Script
- **Functions**:
    - `sendData()`: Sends data over the serial port.
    - `sendKeepAlive()`: Sends a keep-alive signal every 10 seconds.
    - `client.on("ready")`: Notifies when signed into Discord.
    - `client.on('messageCreate')`: Processes Discord messages and sends commands to the microcontroller.

## Credits
- Special thanks to [kubagp1](https://github.com/kubagp1) for providing valuable references and insights used in this project.
