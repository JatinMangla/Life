import iphone11 from '~/assets/iphone-11.glb';
import macbookPro from '~/assets/macbook-pro.glb';

export const ModelAnimationType = {
  SpringUp: 'spring-up',
  LaptopOpen: 'laptop-open',
} as const;

export type ModelAnimation = (typeof ModelAnimationType)[keyof typeof ModelAnimationType];

export interface DeviceModel {
  /** Path to the GLB, resolved by Vite. */
  url: string;
  width: number;
  height: number;
  position: { x: number; y: number; z: number };
  animation: ModelAnimation;
}

export const deviceModels = {
  phone: {
    url: iphone11,
    width: 374,
    height: 512,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.SpringUp,
  },
  laptop: {
    url: macbookPro,
    width: 1280,
    height: 800,
    position: { x: 0, y: 0, z: 0 },
    animation: ModelAnimationType.LaptopOpen,
  },
} satisfies Record<string, DeviceModel>;

export type DeviceType = keyof typeof deviceModels;
