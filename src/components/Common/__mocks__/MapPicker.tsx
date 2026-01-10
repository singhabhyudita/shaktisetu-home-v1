import React from "react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lon: number) => void;
  initialCenter?: [number, number];
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  return (
    <div data-testid="mock-map-picker">
      <input
        type="text"
        placeholder="e.g. 19.1136, 72.8697"
        onChange={(e) => {
          const parts = e.target.value
            .split(",")
            .map((p) => parseFloat(p.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            onLocationSelect(parts[0], parts[1]);
          }
        }}
      />
    </div>
  );
};

export default MapPicker;
