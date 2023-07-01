import React, { useRef, useEffect, useState, SetStateAction } from "react";
import mapboxgl from "mapbox-gl";
import NavBar from "../components/Navbar";

interface DashboardProps {
  token: string;
}

const ContactSection: React.FC <DashboardProps> = ({ token })  => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);
  const [zoom, setZoom] = useState<number>(9);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidWNoaWEiLCJhIjoiY2xqZjdobHU4MjIwajNmdGhiZWxpMW9zbCJ9.V1VhvZtwUVrdQ_YPpomVqg";

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });
    }
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    const handleMove = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const center = map.current!.getCenter();
      setLng(center.lng.toFixed(4) as unknown as SetStateAction<number>);
      setLat(center.lat.toFixed(4) as unknown as SetStateAction<number>);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setZoom(map.current!.getZoom().toFixed(2) as unknown as SetStateAction<number>);
    };

    map.current.on("move", handleMove);

    return () => {
      map.current?.off("move", handleMove);
    };
  }, []);

  return (
    <> <NavBar /><section className="text-gray-600 body-font relative">
    <div id="map" className="absolute inset-0 w-full h-full" />
    <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  </section></>
   
  );
};

export default ContactSection;
