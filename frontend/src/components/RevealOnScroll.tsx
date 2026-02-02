import React, { useRef, useEffect, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  // Menambahkan slide-left dan slide-right ke dalam tipe data
  animationType?: 'slide-up' | 'fade-in' | 'slide-left' | 'slide-right';
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  delay = 0, 
  threshold = 0.1,
  animationType = 'slide-up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Berhenti mengamati setelah elemen terlihat untuk efisiensi
          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold,
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  // Mendefinisikan class animasi berdasarkan tipe yang dipilih
  const getAnimationClasses = () => {
    const base = "transform transition-all duration-1000 ease-out";
    
    switch (animationType) {
      case 'slide-up':
        return `${base} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`;
      
      case 'slide-left':
        // Muncul dari arah kanan ke kiri
        return `${base} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`;
      
      case 'slide-right':
        // Muncul dari arah kiri ke kanan
        return `${base} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`;
      
      case 'fade-in':
        return `transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      
      default:
        return base;
    }
  };

  return (
    <div
      ref={domRef}
      className={getAnimationClasses()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;