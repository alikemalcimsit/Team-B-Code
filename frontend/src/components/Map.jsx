import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet (only in browser)
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

function MapController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  
  return null
}

// Helper function to normalize neighborhood name
const normalizeNeighborhood = (neighborhood) => {
  if (!neighborhood) return null
  // Remove common suffixes and normalize
  return neighborhood
    .replace(/Mah\.?$/i, '')
    .replace(/Mahallesi?$/i, '')
    .replace(/Mh\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function Map({ district, neighborhood, height = '400px' }) {
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef(null)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Istanbul center coordinates
  const defaultCenter = [41.0082, 28.9784]
  
  // District coordinates
  const districtCoordinates = {
    'Kadıköy': [40.9833, 29.0333],
    'Üsküdar': [41.0214, 29.0119],
    'Beşiktaş': [41.0422, 29.0081],
    'Şişli': [41.0603, 28.9858],
    'Beyoğlu': [41.0369, 28.9850],
    'Bakırköy': [40.9826, 28.8578],
    'Fatih': [41.0186, 28.9497],
    'Kartal': [40.9108, 29.2161],
    'Maltepe': [40.9359, 29.1433],
    'Pendik': [40.8754, 29.2350],
    'Beykoz': [41.1350, 29.1025],
    'Sarıyer': [41.1083, 29.0594],
    'Ataşehir': [40.9839, 29.1283],
    'Başakşehir': [41.1006, 28.8031],
    'Beylikdüzü': [41.0025, 28.6378],
    'Esenyurt': [41.0342, 28.6772],
    'Küçükçekmece': [41.0069, 28.7892],
    'Zeytinburnu': [40.9878, 28.9078],
    'Kağıthane': [41.0783, 28.9744],
    'Güngören': [41.0214, 28.8706],
    'Bahçelievler': [41.0014, 28.8503],
    'Avcılar': [41.0225, 28.7097],
    'Bağcılar': [41.0406, 28.8456],
    'Esenler': [41.0475, 28.8628],
    'Gaziosmanpaşa': [41.0689, 28.9025],
    'Sultangazi': [41.1122, 28.8719],
    'Eyüpsultan': [41.0469, 28.9428],
    'Arnavutköy': [41.1956, 28.7336],
    'Çatalca': [41.1425, 28.4556],
    'Silivri': [41.0739, 28.2464],
    'Şile': [41.1783, 29.6103],
    'Çekmeköy': [41.0261, 29.1797],
    'Sancaktepe': [41.0022, 29.2431],
    'Sultanbeyli': [40.9606, 29.2683],
    'Tuzla': [40.8278, 29.3069],
    'Adalar': [40.8733, 29.0917],
    'Ümraniye': [41.0214, 29.1203],
  }
  
  // Neighborhood coordinates - Üsküdar (corrected coordinates)
  const neighborhoodCoordinates = {
    'Üsküdar': {
      'Çengelköy': [41.0579, 29.0514],
      'Çengelköy Mh.': [41.0579, 29.0514],
      'Çengelköy Mah.': [41.0579, 29.0514],
      'Çengelköy Mahallesi': [41.0579, 29.0514],
      'Beylerbeyi': [41.0428, 29.0414],
      'Beylerbeyi Mh.': [41.0428, 29.0414],
      'Kuzguncuk': [41.0294, 29.0233],
      'Kuzguncuk Mh.': [41.0294, 29.0233],
      'Selimiye': [41.0153, 29.0150],
      'Selimiye Mh.': [41.0153, 29.0150],
      'Bulgurlu': [41.0081, 29.0364],
      'Bulgurlu Mh.': [41.0081, 29.0364],
      'Ahmediye': [41.0181, 29.0058],
      'Ahmediye Mh.': [41.0181, 29.0058],
      'Altunizade': [41.0236, 29.0358],
      'Altunizade Mh.': [41.0236, 29.0358],
      'Acıbadem': [41.0125, 29.0258],
      'Acıbadem Mh.': [41.0125, 29.0258],
    },
    'Kadıköy': {
      'Moda': [40.9803, 29.0253],
      'Moda Mh.': [40.9803, 29.0253],
      'Moda Mah.': [40.9803, 29.0253],
      'Bahariye': [40.9864, 29.0267],
      'Bahariye Mh.': [40.9864, 29.0267],
      'Bostancı': [40.9558, 29.0997],
      'Bostancı Mh.': [40.9558, 29.0997],
      'Fenerbahçe': [40.9675, 29.0256],
      'Fenerbahçe Mh.': [40.9675, 29.0256],
      'Göztepe': [40.9767, 29.0675],
      'Göztepe Mh.': [40.9767, 29.0675],
      'Caddebostan': [40.9642, 29.0667],
      'Caddebostan Mh.': [40.9642, 29.0667],
      'Kozyatağı': [40.9742, 29.0981],
      'Kozyatağı Mh.': [40.9742, 29.0981],
    },
    'Beşiktaş': {
      'Ortaköy': [41.0475, 29.0242],
      'Ortaköy Mh.': [41.0475, 29.0242],
      'Bebek': [41.0803, 29.0431],
      'Bebek Mh.': [41.0803, 29.0431],
      'Etiler': [41.0828, 29.0567],
      'Etiler Mh.': [41.0828, 29.0567],
      'Levent': [41.0819, 29.0108],
      'Levent Mh.': [41.0819, 29.0108],
      'Arnavutköy': [41.0647, 29.0392],
      'Arnavutköy Mh.': [41.0647, 29.0392],
    },
    'Şişli': {
      'Nişantaşı': [41.0447, 28.9878],
      'Nişantaşı Mh.': [41.0447, 28.9878],
      'Teşvikiye': [41.0472, 28.9831],
      'Teşvikiye Mh.': [41.0472, 28.9831],
      'Mecidiyeköy': [41.0717, 28.9925],
      'Mecidiyeköy Mh.': [41.0717, 28.9925],
      'Gayrettepe': [41.0689, 28.9975],
      'Gayrettepe Mh.': [41.0689, 28.9975],
    },
    'Beyoğlu': {
      'Taksim': [41.0369, 28.9850],
      'Taksim Mh.': [41.0369, 28.9850],
      'Cihangir': [41.0317, 28.9836],
      'Cihangir Mh.': [41.0317, 28.9836],
      'Galata': [41.0242, 28.9742],
      'Galata Mh.': [41.0242, 28.9742],
      'Karaköy': [41.0225, 28.9775],
      'Karaköy Mh.': [41.0225, 28.9775],
    },
  }
  
  const getCenter = () => {
    // First try to find exact neighborhood match
    if (district && neighborhood) {
      const normalizedNeighborhood = normalizeNeighborhood(neighborhood)
      const districtNeighborhoods = neighborhoodCoordinates[district]
      
      if (districtNeighborhoods) {
        // Try exact match first (case-insensitive)
        const exactMatch = Object.keys(districtNeighborhoods).find(
          key => key.toLowerCase() === neighborhood.toLowerCase().trim()
        )
        if (exactMatch) {
          return districtNeighborhoods[exactMatch]
        }
        
        // Try normalized match (case-insensitive)
        if (normalizedNeighborhood) {
          const normalizedMatch = Object.keys(districtNeighborhoods).find(
            key => {
              const normalizedKey = normalizeNeighborhood(key)
              return normalizedKey && normalizedKey.toLowerCase() === normalizedNeighborhood.toLowerCase()
            }
          )
          if (normalizedMatch) {
            return districtNeighborhoods[normalizedMatch]
          }
        }
        
        // Try partial match (case-insensitive)
        for (const [key, coords] of Object.entries(districtNeighborhoods)) {
          const keyNormalized = normalizeNeighborhood(key)
          const searchNormalized = normalizedNeighborhood || neighborhood.trim()
          
          if (keyNormalized && searchNormalized) {
            if (keyNormalized.toLowerCase() === searchNormalized.toLowerCase() ||
                keyNormalized.toLowerCase().includes(searchNormalized.toLowerCase()) ||
                searchNormalized.toLowerCase().includes(keyNormalized.toLowerCase())) {
              return coords
            }
          }
        }
      }
    }
    
    // Fall back to district center
    if (district && districtCoordinates[district]) {
      return districtCoordinates[district]
    }
    
    return defaultCenter
  }
  
  if (!isClient) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    )
  }

  const markerPosition = getCenter()
  const zoomLevel = neighborhood ? 15 : (district ? 13 : 11)

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 relative z-0" style={{ height }}>
      <MapContainer
        center={markerPosition}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        ref={mapRef}
        zoomControl={true}
      >
        {/* Modern CartoDB Positron tile layer - cleaner and more modern */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <MapController center={markerPosition} zoom={zoomLevel} />
        <Marker position={markerPosition}>
          <Popup>
            {district && (
              <>
                <strong>{district}</strong>
                {neighborhood && <><br />{neighborhood}</>}
              </>
            )}
            {!district && 'İstanbul'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
