mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center:listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// // console.log(coordinates);

// ✅ Fixed: Create the popup first and set HTML on it
const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.title}</h4><p><b>Exact Location Will Be Provided After Booking</b> </p>`);

const marker = new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
    .setPopup(popup)        // Attach the popup
    .addTo(map);
