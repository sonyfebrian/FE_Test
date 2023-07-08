/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

interface MapboxProps {
  onCoordinateCreate: (newCoordinate: any) => void;
}

const Mapbox: React.FC<MapboxProps> = ({ onCoordinateCreate }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
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

      mapRef.current.on('load', () => {
        addDrawControl();
      });

      mapRef.current.on('click', (e) => {
        const coordinates = e.lngLat.toArray().join(',');
        console.log('Selected coordinates:', coordinates);
        onCoordinateCreate(e.lngLat.toArray());
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };

  }, []);

  const addDrawControl = () => {
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },

    });

    mapRef.current?.addControl(drawRef.current);
    mapRef.current?.on('draw.create', handleDrawCreate);
  };

  const handleDrawCreate = (e: any) => {
    const { features } = e;
    if (features.length > 0) {
      const feature = features[0];
      console.log('Drawn feature:', feature);
    }
  };


  return <div ref={mapContainerRef} style={{ height: '400px' }}  ></div>;
};

export default Mapbox;
