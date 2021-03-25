const map = L.map("map", {
    center: [-44.7, 169.15 ],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

// WMTS-Services

console.log(document.querySelector("#map"));
