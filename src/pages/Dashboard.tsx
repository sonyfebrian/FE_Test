import React, { useRef, useEffect, } from "react";
import mapboxgl, { Map, LngLatBoundsLike } from 'mapbox-gl';
import NavBar from "../components/Navbar";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useNavigate } from "react-router-dom";

interface DashboardProps {

  onLogout: () => void;
}

interface Ruas {
  id: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };

}

interface RuasResponse {
  data: Ruas[];
}

const ContactSection: React.FC<DashboardProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const navigate = useNavigate();
  const tokens = localStorage.getItem('token');
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoidWNoaWEiLCJhIjoiY2xqZjdobHU4MjIwajNmdGhiZWxpMW9zbCJ9.V1VhvZtwUVrdQ_YPpomVqg";

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 1
      });

      mapRef.current.on('load', async () => {
        addDrawControl();
        await loadRuasData();
      });

      mapRef.current.on('click', (e) => {
        const coordinates = e.lngLat.toArray().join(',');
        console.log('Selected coordinates:', coordinates);
      });


    }

    const addDrawControl = () => {
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          trash: true
        }
      });

      mapRef.current?.addControl(drawRef.current);
      mapRef.current?.on('draw.create', handleDrawCreate);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDrawCreate = (e: any) => {
      const { features } = e;
      if (features.length > 0) {
        const feature = features[0];
        console.log('Drawn feature:', feature);
      }
    };

    const loadRuasData = async () => {
      try {
        const response = await fetch('http://34.101.145.49:3001/api/master-data/ruas/?page=1&per_page=10', {
          headers: {
            Authorization: `Bearer ${tokens}`
          }
        });
        const data: RuasResponse = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geojson: any = {
          type: 'FeatureCollection',
          features: data.data.map((ruas: Ruas) => ({
            type: 'Feature',
            properties: {
              id: ruas.id
            },
            geometry: {
              // type: ruas.geometry.type,
              coordinates: ruas
            }
          }))
        };
        console.log(geojson.features, "fetaures")
        if (mapRef.current) {
          const bounds = getBounds(geojson);
          mapRef.current.fitBounds(bounds, { padding: 20 });

          if (!mapRef.current.getSource('ruas')) {
            mapRef.current.addSource('ruas', {
              type: 'geojson',
              data: geojson
            });

            mapRef.current.addLayer({
              id: 'ruas',
              type: 'line',
              source: 'ruas',
              paint: {
                'line-color': '#FF0000',
                'line-width': 2
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load ruas data:', error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getBounds = (geojson: any): LngLatBoundsLike => {
      const bounds = new mapboxgl.LngLatBounds();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geojson.features.forEach((feature: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        feature.geometry?.coordinates?.forEach((coordinate: any) => {
          bounds.extend(coordinate);
        });
      });
      return bounds;
    };


    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [tokens]);
  const handleLogout = () => {


    navigate("/");
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />

      <div ref={mapContainerRef} className="w-full flex flex-col h-screen content-center justify-center"></div>

    </>

  );
};

export default ContactSection;
