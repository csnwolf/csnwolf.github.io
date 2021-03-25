const map = L.map("map", {
    center: [-44.7, 169.15 ],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([-44.7, 169.15 ]).addTo(map);
mrk.bindPopup("Wanaka").openPopup();


console.log(document.querySelector("#map"));
