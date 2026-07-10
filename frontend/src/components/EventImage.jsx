import React, { useState } from 'react';

// Placeholder SVG as data URI — works offline, no broken icon ever
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%234f46e5' opacity='0.12'/%3E%3Crect x='0' y='0' width='400' height='220' fill='url(%23grad)'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%234f46e5' stop-opacity='0.18'/%3E%3Cstop offset='100%25' stop-color='%23818cf8' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='95' r='38' fill='%234f46e5' opacity='0.18'/%3E%3Cpath d='M184 85 L200 68 L216 85 L210 85 L210 108 L190 108 L190 85Z' fill='%234f46e5' opacity='0.5'/%3E%3Crect x='140' y='118' width='120' height='8' rx='4' fill='%234f46e5' opacity='0.25'/%3E%3Crect x='160' y='132' width='80' height='6' rx='3' fill='%234f46e5' opacity='0.15'/%3E%3C/svg%3E`;

/**
 * EventImage — a drop-in <img> replacement with:
 * - object-fit: cover
 * - fixed height
 * - lazy loading
 * - automatic placeholder fallback if image fails to load
 */
const EventImage = ({
  src,
  alt = 'Event Image',
  height = 200,
  borderRadius = '0',
  style = {}
}) => {
  const [errored, setErrored] = useState(false);

  const imgSrc = !src || errored
    ? PLACEHOLDER_SVG
    : src.startsWith('http') || src.startsWith('data:')
      ? src
      : `/${src.replace(/^\//, '').trim()}`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      style={{
        width: '100%',
        height: `${height}px`,
        objectFit: 'cover',
        display: 'block',
        borderRadius,
        ...style
      }}
    />
  );
};

export default EventImage;
