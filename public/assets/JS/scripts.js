// CONFIG START - Map adjustments made to both JS and CSS
import { mapConfig, markerConfig } from "./config.js";


function updateMapSize() {
  const mapElement = document.getElementById("map");
  mapElement.style.width = mapConfig.width + "px";
  mapElement.style.height = mapConfig.height + "px";
}

function updateMarkerSize() {
  // Create a style element
  var style = document.createElement("style");

  // Define the CSS rule for markers
  var css = `
        .marker {
            width: ${markerConfig.size.width}px;
            height: ${markerConfig.size.height}px;
        }
    `;

  // Add the CSS to the style element
  if (style.styleSheet) {
    style.styleSheet.cssText = css; // Support for IE
  } else {
    style.appendChild(document.createTextNode(css)); // Support for other browsers
  }

  // Append the style element to the head of the document
  document.head.appendChild(style);
}

// Initial setup
updateMapSize();
updateMarkerSize();

// CONFIG END



// CSV HANDLER START
// Drag and Drop or Select CSV file
function handleFileSelect(evt) {
  const file = evt.target.files[0];
  processCSV(file);
}

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("csvFileInput");

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});
dropZone.addEventListener("drop", (event) => {
  event.stopPropagation();
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processCSV(files[0]);
  }
});
fileInput.addEventListener("change", (event) => {
  if (event.target.files.length > 0) {
    processCSV(event.target.files[0]);
  }
});

// Cleans CSV file and parses it
function processCSV(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    let text = e.target.result;
    // Remove any leading empty lines and then remove leading commas from the header and data lines
    let fixedText = text.replace(/^\s*[\r\n]+/gm, "").replace(/^,+/gm, "");
    Papa.parse(fixedText, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (results && results.data) {
          processLocations(results.data);
        } else {
          console.error(`No data found in CSV: ${file.name}`);
        }
      },
      error: function (error) {
        console.error("Error parsing CSV:", error);
      },
    });
  };
  reader.onerror = function (error) {
    console.error("Error reading file:", error);
  };
  reader.readAsText(file);
}

// Takes the headers City and State, change them in location.**** if needed
function processLocations(locations) {
  for (const location of locations) {
    let city, state;

    // Check if there's a combined "City & State" column
    if (location["City & State"]) {
      const parts = location["City & State"].split(',').map(part => part.trim());
      if (parts.length < 2) {
        console.error("Invalid City & State format");
        continue;
      }
      [city, state] = parts; // Destructuring assignment
    }
    // Otherwise, check for separate "Primary Worksite City" and "Primary Worksite State" columns
    else if (location["Primary Worksite City"] && location["Primary Worksite State"]) {
      city = location["Primary Worksite City"].trim();
      state = location["Primary Worksite State"].trim();
    } else {
      console.error("Missing City & State or Primary Worksite City & State");
      continue;
    }

    // Now you have city and state, proceed with them
    getCoordinates(city, state);
  }
}


// END CSV HANDLER


function getCoordinates(city, state) {
  fetch(`/coordinates/${encodeURIComponent(city)}/${encodeURIComponent(state)}`)
    .then(response => response.json())
    .then(data => {
      if (data.found) {
        console.log(`${city}, ${state} - Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
        addMarker(data.latitude, data.longitude, state);
      } else {
        console.error("Geocoding failed or not found in database");
      }
    })
    .catch(error => console.error("Error fetching coordinates:", error));
}





// Needed for offset of markersize - Change marker size in config.js
function positionMarker(marker, xPos, yPos) {
  marker.style.left = `${xPos - markerConfig.adjustment}px`;
  marker.style.top = `${yPos - markerConfig.adjustment}px`;
}

// Adds Markers to the map, only works with Mercator Projection Maps.
function addMarker(latitude, longitude, state) {
  const mapBounds = mapConfig.bounds;
  const mapWidth = mapConfig.width;
  const mapHeight = mapConfig.height;

  // Calculate position
  let xRelative =
    (longitude - mapBounds.west) / (mapBounds.east - mapBounds.west);
  let xPos = xRelative * mapWidth;
  let radianLatitude = latitude * (Math.PI / 180);
  let mercatorY = Math.log(Math.tan(Math.PI / 4 + radianLatitude / 2));
  let yMin = Math.log(
    Math.tan(Math.PI / 4 + (mapBounds.south * Math.PI) / 360)
  );
  let yMax = Math.log(
    Math.tan(Math.PI / 4 + (mapBounds.north * Math.PI) / 360)
  );
  let yRelative = (mercatorY - yMin) / (yMax - yMin);
  let yPos = (1 - yRelative) * mapHeight;

  // Create and position the marker
  let marker = document.createElement("div");
  marker.className = "marker";
  positionMarker(marker, xPos, yPos);

  // Add State Name to marker
  let text = document.createElement("span");
  text.className = "marker-text";
  text.innerHTML = state; // Use the state name here
  marker.appendChild(text);

  // Add the marker to the map
  document.getElementById("map").appendChild(marker);
}

// Single point add
document.getElementById("mapForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  getCoordinates(city, state);
});

//Export Map with Markers
document.getElementById("exportButton").addEventListener("click", function () {
  html2canvas(document.getElementById("map"),{scale: 2}).then(function (canvas) {
    // Create an image
    var img = canvas.toDataURL("image/png");

    // Create a link to download it
    var link = document.createElement("a");
    link.download = "map_export.png";
    link.href = img;
    link.click();
  });
});



