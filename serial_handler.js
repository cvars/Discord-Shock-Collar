const { SerialPort } = require('serialport');

// Function to send data over the serial port
function sendData(mode, strength, seconds) {
    // Format data as a single string
    const dataString = `${mode} ${strength} ${seconds}\n`;

    // Write data to the serial port
    port.write(dataString, (err) => {
        if (err) {
            return console.log('Error:', err.message);
        }
        console.log('Data sent successfully');
    });
}


// Create a new SerialPort instance
const port = new SerialPort({ path: 'COM8', baudRate: 115200 });

// Open the serial port
port.on('open', () => {
    console.log('Serial port is open');
});

// Error handling
port.on('error', (err) => {
    console.error('Error:', err.message);
});

module.exports = {
    sendData,
};
