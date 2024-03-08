//Add into scripts.js to place multiple markers to adjust the map bounds to calibrate

function plotPredefinedPoints() {
    addMarker(41.8781, -87.6298); // Chicago
    addMarker(39.7392, -104.9903); // Denver
    addMarker(33.7490, -84.3880); // Atlanta
    addMarker(42.3601, -71.0589); // Boston
    addMarker(36.9991, -109.0452); // Four corners
    addMarker(29.7604, -95.3698); // Houston
    addMarker(40.7128, -74.0060); // New York
    addMarker(34.0522, -118.2437); // Los Angeles`
    addMarker(45.9445, -104.0446); // Corner of North and South Dakota
    addMarker(25.7617, -80.1918); // Miami
    addMarker(26, -100) // South Bound of map. Should be level with tip of texas... but I didn't adjust the longitude accordingly
    addMarker(49, -109) // 49th parallel, should line up with canada border

}

window.onload = function() {
    plotPredefinedPoints();
};
