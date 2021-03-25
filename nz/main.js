
let stop = {
    nr: 13,
    name: "Wanaka",
    lat: -44.7,
    lng: 169.15,
    user: "csnwolf",
    wikipedia: "https://en.wikipedia.org/wiki/Wanaka"
};

const map = L.map("map", {
    center: [stop.lat, stop.lng ],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let mrk = L.marker([stop.lat, stop.lng ]).addTo(map);
mrk.bindPopup("Wanaka").openPopup();


//console.log(document.querySelector("#map"));
