"use client";

import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const iconUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const markerIcon = L.icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
});

type Latlng = [number, number];

type LocationMarkerProps = {
  position: Latlng | null;
  setPosition: (position: Latlng) => void;
};

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      const newLocation: Latlng = [e.latlng.lat, e.latlng.lng];
      setPosition(newLocation);

      // Check if the map instance is defined before calling flyTo
      if (map) {
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon}>
      <Popup>Your selected location</Popup>
    </Marker>
  ) : null;
}

const MapLandmark = ({
  location = { lat: 13, lng: 100 }, // Default location if none provided
}: {
  location?: { lat: number; lng: number };
}) => {
  const [position, setPosition] = useState<Latlng | null>(null);

  return (
    <div>
      <h1 className="mt-4 font-semibold">Where are you?</h1>

      {/* Hidden inputs to capture coordinates */}
      <input type="hidden" name="lat" value={position ? position[0] : ""} />
      <input type="hidden" name="lng" value={position ? position[1] : ""} />

      <MapContainer
        className="h-[50vh] rounded-lg z-0 relative mb-2"
        center={[location.lat, location.lng]}
        zoom={7}
        scrollWheelZoom
      >
        {/* Initial marker */}
        <Marker position={[location.lat, location.lng]} icon={markerIcon}>
          <Popup>
            Initial Location <br /> Drag or click to update.
          </Popup>
        </Marker>

        {/* User-selected location marker */}
        <LocationMarker position={position} setPosition={setPosition} />

        {/* Layers control */}
        <LayersControl>
          <LayersControl.BaseLayer name="OpenStreetMap" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="ESRI Imagery">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapLandmark;
