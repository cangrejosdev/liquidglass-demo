import { Injectable, computed, signal } from '@angular/core';

export type SceneId = 'aurora' | 'optical-grid' | 'alpine' | 'tokyo' | 'coral' | 'taxi-night';
export type TintPresetId = 'clear' | 'frost' | 'obsidian' | 'cobalt' | 'rose' | 'emerald' | 'amber-taxi';
export type ActiveTab = 'studio' | 'controls' | 'lab' | 'playground';
export type LensShape = 'droplet' | 'circle' | 'pill';

export interface SceneMeta {
  id: SceneId;
  name: string;
  subtitle: string;
  isLight: boolean;
  swatch: string;
}

export interface TintPreset {
  id: TintPresetId;
  name: string;
  rgbDark: string;
  rgbLight: string;
  swatch: string;
}

export interface MaterialPreset {
  id: string;
  name: string;
  tagline: string;
  refraction: number;
  blur: number;
  saturation: number;
  specular: number;
  chromatic: number;
  tintOpacity: number;
  tintPreset: TintPresetId;
  borderRadius: number;
  lightAngle: number;
}

export const SCENES: SceneMeta[] = [
  {
    id: 'aurora',
    name: 'Aurora Boreal',
    subtitle: 'Neón orgánico',
    isLight: false,
    swatch: 'linear-gradient(135deg, #06b6d4, #6366f1, #ec4899)',
  },
  {
    id: 'optical-grid',
    name: 'Retícula Óptica',
    subtitle: 'Prueba de refracción',
    isLight: false,
    swatch: 'linear-gradient(135deg, #0f172a, #38bdf8 50%, #f43f5e)',
  },
  {
    id: 'alpine',
    name: 'Alba Alpina',
    subtitle: 'Modo luminoso',
    isLight: true,
    swatch: 'linear-gradient(135deg, #bae6fd, #fef3c7, #fda4af)',
  },
  {
    id: 'tokyo',
    name: 'Tokio 2099',
    subtitle: 'Bokeh nocturno',
    isLight: false,
    swatch: 'linear-gradient(135deg, #1e1b4b, #f43f5e, #fb923c)',
  },
  {
    id: 'coral',
    name: 'Arrecife Vivo',
    subtitle: 'Bioluminiscente',
    isLight: false,
    swatch: 'linear-gradient(135deg, #042f2e, #14b8a6, #fb7185)',
  },
  {
    id: 'taxi-night',
    name: 'Taxi Nocturno',
    subtitle: 'Tema urbano taxi',
    isLight: false,
    swatch: 'linear-gradient(135deg, #0b0d14 25%, #facc15 62%, #f59e0b)',
  },
];

export const TINT_PRESETS: TintPreset[] = [
  { id: 'clear', name: 'Cristal Puro', rgbDark: '255, 255, 255', rgbLight: '255, 255, 255', swatch: '#ffffff' },
  { id: 'frost', name: 'Escarcha', rgbDark: '226, 238, 255', rgbLight: '248, 250, 252', swatch: '#dbeafe' },
  { id: 'amber-taxi', name: 'Ámbar Taxi', rgbDark: '250, 204, 21', rgbLight: '245, 158, 11', swatch: '#facc15' },
  { id: 'cobalt', name: 'Cobalto', rgbDark: '56, 189, 248', rgbLight: '14, 165, 233', swatch: '#38bdf8' },
  { id: 'rose', name: 'Cuarzo Rosa', rgbDark: '244, 114, 182', rgbLight: '236, 72, 153', swatch: '#f472b6' },
  { id: 'emerald', name: 'Esmeralda', rgbDark: '52, 211, 153', rgbLight: '16, 185, 129', swatch: '#34d399' },
  { id: 'obsidian', name: 'Obsidiana', rgbDark: '15, 23, 42', rgbLight: '15, 23, 42', swatch: '#1e293b' },
];

export const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: 'ios-crystal',
    name: 'iOS Crystal',
    tagline: 'Ultra transparente, bisel óptico nítido',
    refraction: 68,
    blur: 12,
    saturation: 195,
    specular: 82,
    chromatic: 48,
    tintOpacity: 11,
    tintPreset: 'clear',
    borderRadius: 28,
    lightAngle: 132,
  },
  {
    id: 'frosted-dew',
    name: 'Rocío Esmerilado',
    tagline: 'Difusión aterciopelada y alta saturación',
    refraction: 38,
    blur: 24,
    saturation: 220,
    specular: 68,
    chromatic: 25,
    tintOpacity: 19,
    tintPreset: 'frost',
    borderRadius: 32,
    lightAngle: 145,
  },
  {
    id: 'prismatic-lens',
    name: 'Lente Prismática',
    tagline: 'Máxima refracción + dispersión RGB',
    refraction: 96,
    blur: 6,
    saturation: 235,
    specular: 94,
    chromatic: 92,
    tintOpacity: 7,
    tintPreset: 'clear',
    borderRadius: 36,
    lightAngle: 120,
  },
  {
    id: 'obsidian-smoke',
    name: 'Cristal Obsidiana',
    tagline: 'Vidrio ahumado arquitectónico',
    refraction: 55,
    blur: 18,
    saturation: 165,
    specular: 74,
    chromatic: 32,
    tintOpacity: 36,
    tintPreset: 'obsidian',
    borderRadius: 24,
    lightAngle: 135,
  },
  {
    id: 'taxi-amber',
    name: 'Taxi Ámbar',
    tagline: 'Asfalto urbano + cristal dorado taxi',
    refraction: 72,
    blur: 14,
    saturation: 205,
    specular: 86,
    chromatic: 34,
    tintOpacity: 15,
    tintPreset: 'amber-taxi',
    borderRadius: 26,
    lightAngle: 135,
  },
];

@Injectable({ providedIn: 'root' })
export class LiquidGlassService {
  // Navigation & global UI state
  readonly activeTab = signal<ActiveTab>('studio');
  readonly scene = signal<SceneId>('aurora');
  readonly showLens = signal<boolean>(true);
  readonly lensShape = signal<LensShape>('droplet');
  readonly sceneLuminance = signal<number>(100);
  readonly svgRefractionEnabled = signal<boolean>(true);
  readonly activePresetId = signal<string>('ios-crystal');

  // Optical physics parameters (live Angular 22 signals)
  readonly refraction = signal<number>(68);
  readonly blur = signal<number>(12);
  readonly saturation = signal<number>(195);
  readonly specular = signal<number>(82);
  readonly chromatic = signal<number>(48);
  readonly tintOpacity = signal<number>(11);
  readonly tintPreset = signal<TintPresetId>('clear');
  readonly borderRadius = signal<number>(28);
  readonly lightAngle = signal<number>(132);

  // Derived adaptive theme & optical values
  readonly currentScene = computed(
    () => SCENES.find((s) => s.id === this.scene()) ?? SCENES[0],
  );

  readonly isLightScene = computed(() => this.currentScene().isLight);
  readonly isTaxiScene = computed(() => this.scene() === 'taxi-night');

  readonly currentTint = computed(
    () => TINT_PRESETS.find((t) => t.id === this.tintPreset()) ?? TINT_PRESETS[0],
  );

  readonly tintCssColor = computed(() => {
    const tint = this.currentTint();
    const isLight = this.isLightScene();
    const rgb = isLight ? tint.rgbLight : tint.rgbDark;
    const baseOpacity = this.tintOpacity() / 100;
    const adjusted = isLight && tint.id === 'clear' ? Math.min(0.46, baseOpacity + 0.18) : baseOpacity;
    return `rgba(${rgb}, ${adjusted.toFixed(3)})`;
  });

  /** Displacement scale passed to SVG <feDisplacementMap> for cards & controls */
  readonly surfaceDisplacementScale = computed(() => Math.round((this.refraction() / 100) * 34));

  /** Stronger optical displacement for the floating spherical lens */
  readonly lensDisplacementScale = computed(() => Math.round(28 + (this.refraction() / 100) * 56));

  /** RGB chromatic dispersion channel offset delta */
  readonly chromaticDelta = computed(() => Number(((this.chromatic() / 100) * 7.5).toFixed(2)));

  /** CSS custom properties bound to the root container so all Liquid Glass surfaces stay in sync */
  readonly cssVariables = computed<Record<string, string>>(() => ({
    '--lg-blur': `${this.blur()}px`,
    '--lg-sat': `${this.saturation()}%`,
    '--lg-specular': (this.specular() / 100).toFixed(2),
    '--lg-chromatic': (this.chromatic() / 100).toFixed(2),
    '--lg-tint': this.tintCssColor(),
    '--lg-radius': `${this.borderRadius()}px`,
    '--lg-light-angle': `${this.lightAngle()}deg`,
    '--lg-brightness': this.isLightScene() ? '1.08' : '1.06',
    '--lg-shadow-alpha': this.isLightScene() ? '0.18' : '0.44',
  }));

  /** Live generated CSS + Tailwind snippet for developers in the Optical Lab */
  readonly generatedCssCode = computed(() => {
    const blur = this.blur();
    const sat = this.saturation();
    const spec = (this.specular() / 100).toFixed(2);
    const radius = this.borderRadius();
    const angle = this.lightAngle();
    const tint = this.tintCssColor();
    const scale = this.surfaceDisplacementScale();

    return `.liquid-glass {
  position: relative;
  border-radius: ${radius}px;
  background: ${tint};
  backdrop-filter: blur(${blur}px) saturate(${sat}%) url(#lg-surface-filter);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
  box-shadow:
    0 24px 60px -15px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, ${(Number(spec) * 0.65).toFixed(2)}),
    inset 0 -1px 0 rgba(255, 255, 255, ${(Number(spec) * 0.16).toFixed(2)});
}

/* Fresnel Rim Highlight (${angle}deg) & Optical Displacement Scale: ${scale} */
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.25px;
  background: linear-gradient(${angle}deg,
    rgba(255, 255, 255, ${(Number(spec) * 0.92).toFixed(2)}),
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, ${(Number(spec) * 0.62).toFixed(2)}));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`;
  });

  readonly generatedTailwindClasses = computed(() => {
    return `relative overflow-hidden rounded-[${this.borderRadius()}px] backdrop-blur-[${this.blur()}px] backdrop-saturate-[${this.saturation()}%] bg-[${this.tintCssColor().replaceAll(' ', '')}] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.6)]`;
  });

  applyPreset(preset: MaterialPreset): void {
    this.activePresetId.set(preset.id);
    this.refraction.set(preset.refraction);
    this.blur.set(preset.blur);
    this.saturation.set(preset.saturation);
    this.specular.set(preset.specular);
    this.chromatic.set(preset.chromatic);
    this.tintOpacity.set(preset.tintOpacity);
    this.tintPreset.set(preset.tintPreset);
    this.borderRadius.set(preset.borderRadius);
    this.lightAngle.set(preset.lightAngle);
  }

  markCustom(): void {
    this.activePresetId.set('custom');
  }

  /**
   * Generates a real procedural rounded-bezel optical displacement normal map as a PNG Data URL.
   * Neutral flat center = rgb(128, 128, 128). Beveled perimeter encodes Snell's-law radial refraction vectors.
   */
  generateBezelDisplacementMap(size = 256, bezelFraction = 0.2): string {
    if (typeof document === 'undefined') {
      return '';
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const img = ctx.createImageData(size, size);
      const data = img.data;
      const half = size / 2;
      const cornerRadius = size * 0.22;
      const innerHalf = half - cornerRadius;
      const bezelPx = size * bezelFraction;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const px = x + 0.5 - half;
          const py = y + 0.5 - half;

          // Signed distance to rounded rectangle boundary (negative inside)
          const qx = Math.abs(px) - innerHalf;
          const qy = Math.abs(py) - innerHalf;
          const ox = Math.max(qx, 0);
          const oy = Math.max(qy, 0);
          const distOutside = Math.hypot(ox, oy);
          const distInside = Math.min(Math.max(qx, qy), 0);
          const sdf = distOutside + distInside - cornerRadius;

          // Distance inward from outer edge (0 at edge, positive inside)
          const edgeDist = Math.max(0, -sdf);

          let dx = 0;
          let dy = 0;

          if (edgeDist < bezelPx) {
            // Smooth convex curved glass bezel profile
            const t = 1 - edgeDist / bezelPx; // 0 at inner flat region, 1 at outer rim
            const curve = Math.sin(t * Math.PI * 0.5) * Math.pow(t, 1.35);

            // Outward unit normal of the rounded-rect SDF
            let nx = 0;
            let ny = 0;
            if (distOutside > 0.0001) {
              nx = (Math.sign(px) * ox) / distOutside;
              ny = (Math.sign(py) * oy) / distOutside;
            } else if (qx > qy) {
              nx = Math.sign(px);
            } else {
              ny = Math.sign(py);
            }

            // Bend rays inward across the curved glass bevel
            dx = -nx * curve;
            dy = -ny * curve;
          }

          const idx = (y * size + x) * 4;
          data[idx] = Math.max(0, Math.min(255, Math.round(128 + dx * 124)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dy * 124)));
          data[idx + 2] = 128;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return '';
    }
  }

  /**
   * Generates a spherical convex optical lens displacement map for the draggable Liquid Glass droplet/lens.
   */
  generateSphericalLensMap(size = 256): string {
    if (typeof document === 'undefined') {
      return '';
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const img = ctx.createImageData(size, size);
      const data = img.data;
      const half = size / 2;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const nx = (x + 0.5 - half) / half;
          const ny = (y + 0.5 - half) / half;
          const r = Math.hypot(nx, ny);

          let dx = 0;
          let dy = 0;

          if (r < 1 && r > 0.0001) {
            // Convex glass droplet magnification + steep refractive edge pull
            const mag = 0.24 * r + 0.76 * Math.pow(r, 3.2);
            dx = -(nx / r) * mag;
            dy = -(ny / r) * mag;
          }

          const idx = (y * size + x) * 4;
          data[idx] = Math.max(0, Math.min(255, Math.round(128 + dx * 125)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dy * 125)));
          data[idx + 2] = 128;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return '';
    }
  }
}
