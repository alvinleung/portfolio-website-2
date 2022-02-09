import useForceUpdate from '@/hooks/useForceUpdate';
import { AnimatePresence, motion } from 'framer-motion';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
};

const IMAGE_PRELOAD_LIST = [
  '/img/portrait-small.webp',
  '/img/idagio-cover.webp',
  '/img/whatif-cover.webp',
  '/img/bump-cover.webp',
  '/img/helpmate-cover.webp',
  '/img/pivot-cover.webp',
];

const PageLoadContext = createContext({ isLoaded: false, progress: 0 });

export const useLoadingStatus = () => useContext(PageLoadContext);

const PageAssetPreloader = ({ children }: Props) => {
  const sources = IMAGE_PRELOAD_LIST;
  const loadedImages = useRef([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleImageLoad(e: Event) {
    const source = (e.target as HTMLImageElement).src;
    loadedImages.current.push(source);
    checkIsLoaded();
  }

  function handleImageError(e: Event) {
    console.warn(`Unable to load ${(e.target as HTMLImageElement).src}`);
    const source = (e.target as HTMLImageElement).src;
    loadedImages.current.push(source);
    checkIsLoaded();
  }

  function checkIsLoaded() {
    const pageAssetLoadedProgress =
      loadedImages.current.length / sources.length;
    console.log(pageAssetLoadedProgress);
    setProgress(pageAssetLoadedProgress);
    if (pageAssetLoadedProgress === 1) setIsLoaded(true);
  }

  function preloadImages() {
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.addEventListener('load', handleImageLoad);
      img.addEventListener('error', handleImageError);
    });
  }

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <>
      <PageLoadContext.Provider
        value={{ isLoaded: isLoaded, progress: progress }}
      >
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#FFF',
                zIndex: 100000,
              }}
              initial={{
                opacity: isLoaded ? 0 : 1,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        {children}
      </PageLoadContext.Provider>
    </>
  );
};

export default PageAssetPreloader;
