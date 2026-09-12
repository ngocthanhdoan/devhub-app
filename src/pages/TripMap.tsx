import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Gauge } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usePrompt } from '@/hooks/usePrompt';
import { ScreenHeader } from '@/components/ScreenHeader';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import { formatTime } from '@/utils/format';
import type { MapData } from '@/types';

// Fix default marker icons for leaflet in bundler
const blueIcon = L.divIcon({
  html: `<div style="background:#2563EB;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

const greenIcon = L.divIcon({
  html: `<div style="background:#10B981;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

const grayIcon = L.divIcon({
  html: `<div style="background:#9CA3AF;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

const redIcon = L.divIcon({
  html: `<div style="background:#EF4444;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

const userIcon = L.divIcon({
  html: `<div style="background:#2563EB;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.2);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  className: '',
});

function numberIcon(num: number, color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;color:white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: '',
  });
}

function FitBounds({ stops }: { stops: MapData['stops'] }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length === 0) return;
    const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [stops, map]);
  return null;
}

export default function TripMap() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: mapData, isLoading, isError } = usePrompt<MapData>(
    'GOB2_0200',
    'mapData',
    { orderId: orderId! },
    { refetchInterval: 15000 },
  );

  const sendLocationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (sendLocationInterval.current) clearInterval(sendLocationInterval.current);
    };
  }, []);

  if (isLoading) return (
    <>
      <ScreenHeader title="Bản đồ chuyến" />
      <LoadingScreen />
    </>
  );

  if (isError || !mapData) return (
    <>
      <ScreenHeader title="Bản đồ chuyến" />
      <ErrorScreen message="Không tải được bản đồ" />
    </>
  );

  const stopColors: Record<string, string> = {
    DONE: '#10B981',
    ARRIVED: '#2563EB',
    PENDING: '#9CA3AF',
    SKIPPED: '#EF4444',
  };

  const polylinePositions: [number, number][] = mapData.stops.map((s) => [s.lat, s.lng]);

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <ScreenHeader title="Bản đồ chuyến" />

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={[mapData.stops[0]?.lat || 10.8, mapData.stops[0]?.lng || 106.7]}
          zoom={12}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />

          {/* Current location */}
          <Marker
            position={[mapData.currentLocation.lat, mapData.currentLocation.lng]}
            icon={userIcon}
          >
            <Popup>Vị trí hiện tại</Popup>
          </Marker>

          {/* Stop markers */}
          {mapData.stops.map((stop) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={numberIcon(stop.sequence, stopColors[stop.status] || '#9CA3AF')}
            >
              <Popup>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{stop.name}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{stop.address}</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Dự kiến: {stop.etaTime}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Polyline connecting stops */}
          {polylinePositions.length > 1 && (
            <Polyline
              positions={polylinePositions}
              pathOptions={{ color: '#2563EB', weight: 3, opacity: 0.6, dashArray: '8, 8' }}
            />
          )}

          <FitBounds stops={mapData.stops} />
        </MapContainer>
      </div>

      {/* Bottom info card */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        {mapData.nextStop ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Điểm tiếp theo</p>
              <p className="font-semibold text-gray-900 truncate">{mapData.nextStop.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mapData.distanceToNextKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  Dự kiến {mapData.nextStop.etaTime}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Đã đến điểm cuối</p>
              <p className="text-xs text-gray-400">Tất cả điểm dừng đã hoàn thành</p>
            </div>
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Tự động cập nhật vị trí mỗi 15 giây
        </p>
      </div>
    </div>
  );
}
