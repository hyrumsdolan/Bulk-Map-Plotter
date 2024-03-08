const router = require("express").Router();
const Location = require('../models/Location');


// Add this route in your server file or a separate route file if you have one

router.get('/coordinates/:city/:state', async (req, res) => {
  console.log("API call")
  const { city, state } = req.params;
  console.log({city, state})
  try {
    const location = await Location.findOne({ where: { city, state } });
    console.log(location)
    if (location) {
      return res.json({ found: true, latitude: location.latitude, longitude: location.longitude });
    }

    // If not found in the database, make an API call
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure your API key is stored in .env
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)},${encodeURIComponent(state)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log("post fetch", data)

    if (data.status === 'OK') {
      const latitude = data.results[0].geometry.location.lat;
      const longitude = data.results[0].geometry.location.lng;

      // Save the new location to the database
      await Location.create({ city, state, latitude, longitude });

      return res.json({ found: true, latitude, longitude });
    } else {
      return res.status(400).json({ found: false, message: "Geocoding failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ found: false, message: "Server error" });
  }
});


module.exports = router;
