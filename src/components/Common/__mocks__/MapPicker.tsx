import React from "react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: string;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  return (
    <div data-testid="mock-map-picker">
      <input
        type="text"
        placeholder="e.g. 19.1136, 72.8697"
        onChange={(e) => {
          const [lat, lng] = e.target.value.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            onLocationSelect(lat, lng);
          }
        }}
      />
    </div>
  );
};

export default MapPicker;
