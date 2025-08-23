import React, { useEffect, useState } from "react";

interface HeroBannerProps {
  images: string[];
  fallbackImage: string;
  autoRotateMs?: number; // default 5000
}

const HeroBanner: React.FC<HeroBannerProps> = ({ images, fallbackImage, autoRotateMs = 5000 }) => {
  const validImages = (images || []).filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  // autoplay
  useEffect(() => {
    if (!validImages.length) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoRotateMs);
    return () => clearInterval(id);
  }, [validImages.length, autoRotateMs]);

  const showPrev = () => {
    if (!validImages.length) return;
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const showNext = () => {
    if (!validImages.length) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const src = validImages.length ? validImages[currentIndex] : fallbackImage;

  return (
    <section className="relative w-full h-96 bg-gray-900">
      <img
        src={src}
        alt={`Hero Banner ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-1000"
      />

      {validImages.length > 1 && (
        <>
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full"
            aria-label="Anterior"
          >
            <span className="text-6xl leading-none">‹</span>
          </button>
          <button
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full"
            aria-label="Siguiente"
          >
            <span className="text-6xl leading-none">›</span>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroBanner;