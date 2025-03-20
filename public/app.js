document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([50.62925, 3.057256], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    let markers = [];

    async function updateParkings() {
        try {
            const response = await fetch('http://localhost:8000/parkings');
            const data = await response.json();

            markers.forEach(marker => map.removeLayer(marker)); // Nettoyage des anciens marqueurs
            markers = [];

            data.parkings.forEach(parking => {
                // Conversion des coordonnées Lambert 93 vers WGS84
                const coords = convertLambert93ToWGS84(parking.longitude, parking.latitude);
                let marker = L.marker([coords.latitude, coords.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${parking.nom}</b><br>Places disponibles: ${parking.toto}`);
                markers.push(marker);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données des parkings:', error);
        }
    }

    // Fonction de conversion Lambert 93 vers WGS84
    function convertLambert93ToWGS84(x, y) {
        // Définition de la projection Lambert 93
        proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        
        const result = proj4("EPSG:2154", "EPSG:4326", [x, y]);
        return {
            longitude: result[0],
            latitude: result[1]
        };
    }

    updateParkings(); // Chargement initial des parkings
    setInterval(updateParkings, 60000); // Mise à jour toutes les 60 secondes
});