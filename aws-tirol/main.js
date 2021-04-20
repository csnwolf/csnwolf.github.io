// https://leafletjs.com/reference-1.7.1.html#tilelayer
let basemapGray = L.tileLayer.provider('BasemapAT.grau');

// https://leafletjs.com/reference-1.7.1.html#map-example
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]

});

// https://leafletjs.com/reference-1.7.1.html#control-layers
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
// https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
// https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
// https://leafletjs.com/reference-1.7.1.html#layergroup
    "BasemapAT.overlay+ortho": L.layerGroup([
// https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.orthofoto'),
// https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';

// https://leafletjs.com/reference-1.7.1.html#featuregroup
let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");
// awsLayer.addTo(map);
// https://leafletjs.com/reference-1.7.1.html#featuregroup
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen (cm)");
// snowLayer.addTo(map);
// https://leafletjs.com/reference-1.7.1.html#featuregroup
let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit (km/h)");
// windLayer.addTo(map);
// https://leafletjs.com/reference-1.7.1.html#featuregroup
let temperatureLayer = L.featureGroup();
layerControl.addOverlay(temperatureLayer, "Temperatur (C)");
temperatureLayer.addTo(map);


fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            // console.log('Station: ', station);
// https://leafletjs.com/reference-1.7.1.html#marker
            let marker = L.marker([
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
                <li>Datum: ${formattedDate.toLocaleString("de")}</li>
                <li>Seehöhe: ${station.geometry.coordinates[2]} m</li>
                <li>Temperatur: ${station.properties.LT} C</li>
                <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
                <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
                <li>Windrichtung: ${station.properties.WR || '?'}</li>
                </ul>
                <a target= "_blank" href= "https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
            marker.addTo(awsLayer);
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
// https://leafletjs.com/reference-1.7.1.html#divicon
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
// https://leafletjs.com/reference-1.7.1.html#marker
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);
            }
            if (station.properties.WG) {
                let windHighlightClass = '';
                if (station.properties.WG > 10) {
                    windHighlightClass = 'wind-10';
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = 'wind-20';
                }
// https://leafletjs.com/reference-1.7.1.html#divicon
                let windIcon = L.divIcon({
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`,
                });
// https://leafletjs.com/reference-1.7.1.html#marker
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }
            if (station.properties.LT || station.properties.LT == 0) {
                let temperatureHighlightClass = '';
                if (station.properties.LT < 0) {
                    temperatureHighlightClass = 'temperaturnegativ';
                }
                if (station.properties.LT >= 0) {
                    temperatureHighlightClass = 'temperaturpositiv';
                }
// https://leafletjs.com/reference-1.7.1.html#divicon
                let temperatureIcon = L.divIcon({
                    html: `<div class="temperature-label ${temperatureHighlightClass}">${station.properties.LT}</div>`,
                });
// https://leafletjs.com/reference-1.7.1.html#marker
                let temperatureMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: temperatureIcon
                });
                temperatureMarker.addTo(temperatureLayer);
            }
        }
        map.fitBounds(awsLayer.getBounds());
    });