import { useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';

interface UseSnapScrollReturn {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export const useSnapScroll = (sectionIds: string[]): UseSnapScrollReturn => {
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollY.get();
      const windowHeight = window.innerHeight;

      for (let i = 0; i < sectionIds.length; i++) {
        const sectionElement = document.getElementById(sectionIds[i]);
        if (sectionElement) {
          const sectionTop = sectionElement.offsetTop;
          const sectionBottom = sectionTop + sectionElement.offsetHeight;

          if (currentScrollY >= sectionTop - windowHeight / 2 && currentScrollY < sectionBottom - windowHeight / 2) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    const unsubscribe = scrollY.onChange(handleScroll);
    return () => unsubscribe();
  }, [scrollY, sectionIds]);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      window.scrollTo({
        top: sectionElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return { activeSection, scrollToSection };
}