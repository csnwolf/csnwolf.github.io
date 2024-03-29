
let stop = {
    nr: 13,
    name: "Wanaka",
    lat: -44.7,
    lng: 169.15,
    user: "csnwolf",
    wikipedia: "https://en.wikipedia.org/wiki/Wanaka"
};

const map = L.map("map", {
    fullscreenControl: true,
    //center: [stop.lat, stop.lng ],
    //zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let nav = document.querySelector("#navigation");
//console.log(nav);

ROUTE.sort((stop1, stop2) => {
    if (stop1.nr > stop2.nr) {
        return 1;
    } else {
        return -1;
    }
});

for (let entry of ROUTE) {
    //console.log(entry);

    nav.innerHTML += `
        <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>
    `;

    let mrk = L.marker([entry.lat, entry.lng ]).addTo(map);
    mrk.bindPopup(`
    <h4>Stop ${entry.nr}: ${entry.name}</h4>
    <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read about stop in Wikipedia</a></p>
`);

    if(entry.nr == 13)  {
        map.setView([ entry.lat, entry.lng], 13);
        mrk.openPopup();
    }
}

nav.options.selectedIndex = 13 - 1;
nav.onchange = (evt) => {
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username =options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`
    console.log(username, link);

    window.location.href = link;
};
//

//console.log(document.querySelector("#map"));

// Minimap
var miniMap = new L.Control.MiniMap(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"), {
        toggleDisplay: true,
        minimized: false
    }
).addTo(map);