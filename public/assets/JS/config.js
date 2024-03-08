// Width and Height of your map by Pixels
const mapConfig = {
    width: 1650,
    height: 895,
    // Latitude and logitude bounds
    bounds: {
        north: 49.5,
        south: 24.9,
        east: -66.7,
        west: -124.9
    }
};

// Market size
const markerDiameter = 60
const markerConfig = {
    size: { width: markerDiameter, height: markerDiameter },
    adjustment: markerDiameter/2
};

export { mapConfig, markerConfig };