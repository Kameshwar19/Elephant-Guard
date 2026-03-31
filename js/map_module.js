// ── MAP_MODULE.JS ──
// Initializes the Leaflet map for geospatial tracking of the nodes and herd.

document.addEventListener('DOMContentLoaded', () => {

  const mapCenter = [10.4, 77.1]; // Anamalai Tiger Reserve coordinates
  let map;

  try {
    map = L.map('real-map').setView(mapCenter, 13);
  } catch (e) {
    console.error('Leaflet failed to load. Are you offline?', e);
    document.getElementById('real-map').innerHTML = '<div style="color:var(--danger); padding:20px;">Geospatial module offline.</div>';
    return;
  }

  // Base layers
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19
  });

  const terrainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  });

  // Default to Terrain for sci-fi look
  terrainLayer.addTo(map);
  
  // Custom Dark Styling via CSS filters (applied globally in CSS, or done here via tile layer styling)
  // For a quick dark map without a custom MapBox token:
  const mapElement = document.getElementById('real-map');
  mapElement.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';

  let currentLayer = 'terrain';
  const toggleBtn = document.getElementById('map-layer-btn');
  if(toggleBtn) {
    toggleBtn.onclick = () => {
      if(currentLayer === 'terrain') {
        map.removeLayer(terrainLayer);
        satelliteLayer.addTo(map);
        currentLayer = 'satellite';
        toggleBtn.textContent = '🗺 TERRAIN';
      } else {
        map.removeLayer(satelliteLayer);
        terrainLayer.addTo(map);
        currentLayer = 'terrain';
        toggleBtn.textContent = '🗺 SATELLITE';
      }
    };
  }

  // Add Sensor Nodes to Map
  const sensors = [
    { loc: [10.42, 77.09], name: 'Node A1' },
    { loc: [10.39, 77.12], name: 'Node B2' },
    { loc: [10.40, 77.08], name: 'Node C3' },
    { loc: [10.38, 77.10], name: 'Node D4' }
  ];

  sensors.forEach(s => {
    L.circleMarker(s.loc, {
      radius: 8,
      color: '#00d4ff',
      fillColor: '#00d4ff',
      fillOpacity: 0.5,
      weight: 2
    }).addTo(map).bindTooltip(s.name, { permanent: true, className: 'map-tooltip', direction: 'right' });
  });

  // Add active tracking target (Herd)
  let herdMarker = L.circleMarker([10.405, 77.105], {
    radius: 12,
    color: '#ff2244',
    fillColor: '#ff2244',
    fillOpacity: 0.8,
    weight: 2
  }).addTo(map).bindTooltip('🐘 Detected Herd', { permanent: true, className: 'map-tooltip warn', direction: 'left' });

  let time = 0;
  setInterval(() => {
    time += 0.05;
    const newLat = 10.405 + Math.sin(time)*0.01;
    const newLng = 77.105 + Math.cos(time*0.8)*0.01;
    herdMarker.setLatLng([newLat, newLng]);
    
    // Update Map Panel Stats
    document.getElementById('map-active').textContent = Math.floor(3 + Math.random()*2);
  }, 1000);

});
