//These are required for Rainbowkit to work
window.global = window.global ?? window;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
