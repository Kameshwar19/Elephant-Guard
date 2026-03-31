# ElephantGuard AI v2

A futuristic, browser-based dashboard for AI wildlife monitoring and protection, specifically designed around the concept of securing wilderness areas and tracking elephant herds.

## Overview

ElephantGuard AI v2 is a highly interactive, simulated command center built entirely with HTML, CSS (Vanilla), and JavaScript. It features a modern, dark-themed, "glassmorphism" aesthetic with a suite of functional (simulated) modules designed to demonstrate real-time data processing, computer vision, and geospatial tracking.

## Features

- **Futuristic Login System**: A mock secure terminal access portal with animations.
- **Real-Time Sensor Dashboard**: Live feeds for infrared sensors and seismic node vibrations, visualized with sparklines.
- **CNN Vision Hub**: Client-side Object Detection using TensorFlow.js (`@tensorflow/tfjs`) and COCO-SSD models, applied directly to webcam or mock video feeds.
- **Thermal Drone Dispatch**: A simulated radar interface for UAV monitoring and thermal tracking with manual override (WASD).
- **Infrasound Acoustic Matrix**: A live, animated audio spectrogram monitoring specific frequencies (e.g., elephant rumbles).
- **Geospatial Map**: Integrated with Leaflet.js to display a live map of the Anamalai Tiger Reserve, complete with moving herd markers and geofence tracking.
- **Gesture Control Array**: Client-side gesture recognition to interact with the dashboard.

## Technologies Used

- **HTML5 & Vanilla CSS**: Utilizing modern CSS variables, flexbox, grid, and specific UI/UX design patterns for a futuristic look.
- **Vanilla JavaScript**: Modular architecture handling all logic, simulations, and API integrations.
- **Three.js**: For 3D background rendering.
- **GSAP (GreenSock)**: For smooth, complex animations and scroll triggers.
- **TensorFlow.js & COCO-SSD**: For client-side AI computer vision processing.
- **Chart.js**: For rendering data metrics.
- **Leaflet.js**: For interactive geospatial mapping.

## Setup & Running

This project is a static frontend application. No build steps or server-side dependencies are strictly required.

1. Clone this repository.
2. Open `index.html` directly in your modern web browser.
   - *Note:* Because the application requests access to the webcam for computer vision and gesture modules, running it over a local server (like Live Server in VS Code, or `python -m http.server`) is recommended. Some browsers restrict webcam access for `file://` protocols.

## Modules Breakdown

- `css/styles.css`: Contains the entire design system and responsive layouts.
- `js/app.js`: Core application logic, sparklines, and animations.
- `js/auth.js`: Handles the login screen and dashboard unlocking sequence.
- `js/cnn_module.js`: Integrates TensorFlow to run object detection on a video stream.
- `js/drone.js`: Simulates the radar interface and drone movement logic.
- `js/acoustic.js`: Renders the simulated infrasound spectrogram.
- `js/map_module.js`: Initializes Leaflet, sets up the map layers, and animates the herd tracking.
- `js/gesture.js`: Basic client-side gesture recognition placeholders.

## License

This project is intended for demonstration and educational purposes.
