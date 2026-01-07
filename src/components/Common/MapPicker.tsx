import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet + React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  initialCenter?: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map clicks
const MapEvents = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to move the camera when position state changes
const MapCameraController = ({
  position,
}: {
  position: [number, number] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  initialCenter = [19.076, 72.8777], // Default to Mumbai
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [inputValue, setInputValue] = useState("");

  // No longer using a useEffect to sync position -> inputValue to avoid cursor jumps.
  // Instead, we update inputValue explicitly on map interactions.

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse: "lat, lng"
    const parts = val.split(",").map((p) => p.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      }
    }
  };

  const handleMarkerDrag = (e: L.LeafletEvent) => {
    const marker = e.target;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      setPosition([lat, lng]);
      setInputValue(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div className="map-picker-wrapper" style={{ marginBottom: "1.5rem" }}>
      <div
        className="form-group"
        style={{ marginBottom: "0.8rem", position: "relative" }}
      >
        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Coordinates (Lat, Lng)
        </label>
        <input
          type="text"
          className="modern-input"
          placeholder="e.g. 19.1136, 72.8697"
          value={inputValue}
          onChange={handleManualInputChange}
          style={{ width: "100%", paddingRight: "40px" }}
        />
        <span
          style={{
            position: "absolute",
            right: "12px",
            top: "35px",
            fontSize: "1rem",
            opacity: 0.5,
          }}
        />
      </div>

      <div
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <MapContainer
          center={initialCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCameraController position={position} />
          <MapEvents
            onLocationSelect={(lat, lng) => {
              setPosition([lat, lng]);
              setInputValue(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
              onLocationSelect(lat, lng);
            }}
          />
          {position && (
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            />
          )}
        </MapContainer>
      </div>
      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          marginTop: "0.4rem",
          fontStyle: "italic",
        }}
      >
        {position
          ? "You can also drag the marker to fine-tune."
          : "Click on map or enter coordinates above."}
      </p>
    </div>
  );
};

export default MapPicker;
