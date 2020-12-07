export const ANIMIATION_FAST = 0.2;
export const ANIMIATION_NORMAL = 0.5;
export const ANIMIATION_EASING = [0.16, 1, 0.3, 1];

export const AnimationConfig = {
  VERY_FAST: 0.1,
  FAST: 0.2,
  NORMAL: 0.5,
  DEBUG: 10,
  EASING: [0.16, 1, 0.3, 1], // ease out expo
  // EASING: [0.22, 1, 0.36, 1], // ease out quint
  variants: {},
};

export const AnimationVariants = {
  TITLE: {
    initial: {
      opacity: 0,
      y: 30,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, ease: AnimationConfig.EASING },
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: 0.1 },
    },
  },
};
