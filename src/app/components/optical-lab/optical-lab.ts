import { Component, computed, inject, signal } from '@angular/core';
import {
  LiquidGlassService,
  MATERIAL_PRESETS,
  TINT_PRESETS,
} from '../../core/liquid-glass.service';
import { GlassSurfaceComponent } from '../glass-surface/glass-surface';

@Component({
  selector: 'lg-optical-lab',
  standalone: true,
  imports: [GlassSurfaceComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: Interactive Optical Parameters -->
      <lg-surface class="lg:col-span-6" contentClass="p-6 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
              Laboratorio Óptico en Vivo
            </p>
            <h3 class="mt-1 text-xl font-bold tracking-tight" [class]="headingClass()">
              Calibración del Material
            </h3>
          </div>

          <span class="rounded-full px-3 py-1 font-mono text-xs" [class]="badgeClass()">
            scale={{ glass.surfaceDisplacementScale() }} · blur={{ glass.blur() }}px
          </span>
        </div>

        <!-- Material Presets -->
        <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          @for (preset of presets; track preset.id) {
            <button
              type="button"
              class="rounded-2xl border p-3 text-left transition active:scale-95"
              [class]="
                glass.activePresetId() === preset.id
                  ? activePresetClass()
                  : inactivePresetClass()
              "
              (click)="glass.applyPreset(preset)"
            >
              <p class="text-xs font-bold">{{ preset.name }}</p>
              <p class="mt-0.5 line-clamp-2 text-[10px] opacity-75">{{ preset.tagline }}</p>
            </button>
          }
        </div>

        <!-- Sliders Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Refraction -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Refracción Óptica</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.refraction() }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              class="lg-slider"
              [value]="glass.refraction()"
              (input)="onNumberSlider('refraction', $event)"
            />
          </label>

          <!-- Blur -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Escarcha (Blur)</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.blur() }}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              class="lg-slider"
              [value]="glass.blur()"
              (input)="onNumberSlider('blur', $event)"
            />
          </label>

          <!-- Saturation -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Saturación Cromática</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.saturation() }}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="260"
              class="lg-slider"
              [value]="glass.saturation()"
              (input)="onNumberSlider('saturation', $event)"
            />
          </label>

          <!-- Specular Fresnel -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Brillo Fresnel</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.specular() }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              class="lg-slider"
              [value]="glass.specular()"
              (input)="onNumberSlider('specular', $event)"
            />
          </label>

          <!-- Chromatic Dispersion -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Dispersión RGB</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.chromatic() }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              class="lg-slider"
              [value]="glass.chromatic()"
              (input)="onNumberSlider('chromatic', $event)"
            />
          </label>

          <!-- Tint Opacity -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Densidad del Tinte</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.tintOpacity() }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              class="lg-slider"
              [value]="glass.tintOpacity()"
              (input)="onNumberSlider('tintOpacity', $event)"
            />
          </label>

          <!-- Border Radius -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Curvatura del Bisel</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.borderRadius() }}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="44"
              class="lg-slider"
              [value]="glass.borderRadius()"
              (input)="onNumberSlider('borderRadius', $event)"
            />
          </label>

          <!-- Light Angle -->
          <label class="block space-y-1.5">
            <div class="flex justify-between text-xs font-medium">
              <span [class]="headingClass()">Ángulo de Luz</span>
              <span class="font-mono" [class]="mutedClass()">{{ glass.lightAngle() }}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              class="lg-slider"
              [value]="glass.lightAngle()"
              (input)="onNumberSlider('lightAngle', $event)"
            />
          </label>
        </div>

        <!-- Tint Swatches -->
        <div class="space-y-2">
          <p class="text-xs font-medium" [class]="mutedClass()">Tinte del Cristal</p>
          <div class="flex flex-wrap items-center gap-2.5">
            @for (tint of tints; track tint.id) {
              <button
                type="button"
                class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-95"
                [class]="
                  glass.tintPreset() === tint.id ? activePresetClass() : inactivePresetClass()
                "
                (click)="selectTint(tint.id)"
              >
                <span
                  class="h-3.5 w-3.5 rounded-full border border-black/20 shadow-inner"
                  [style.background]="tint.swatch"
                ></span>
                <span>{{ tint.name }}</span>
              </button>
            }
          </div>
        </div>
      </lg-surface>

      <!-- Right: Side-by-Side Comparison + Live Code Generator -->
      <div class="flex flex-col gap-6 lg:col-span-6">
        <!-- Classic Glassmorphism vs Liquid Glass Comparison -->
        <lg-surface contentClass="p-6 space-y-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
              Comparativa Directa
            </p>
            <h3 class="mt-1 text-lg font-bold tracking-tight" [class]="headingClass()">
              Glassmorphism Clásico vs. Liquid Glass
            </h3>
          </div>

          <div
            class="relative grid grid-cols-1 gap-4 overflow-hidden rounded-3xl p-5 sm:grid-cols-2"
            style="background: linear-gradient(125deg, #06b6d4 0%, #6366f1 38%, #ec4899 72%, #f59e0b 100%);"
          >
            <!-- High contrast geometric stripes behind both samples -->
            <div
              class="pointer-events-none absolute inset-0 opacity-45"
              style="background-image: repeating-linear-gradient(-35deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 6px, transparent 6px, transparent 26px);"
            ></div>

            <!-- Classic Glassmorphism -->
            <div
              class="relative z-10 flex flex-col justify-between rounded-3xl border border-white/25 bg-white/15 p-4 text-white backdrop-blur-md"
            >
              <span class="w-fit rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase">
                Clásico
              </span>
              <div class="mt-6">
                <p class="text-sm font-bold">Solo backdrop-blur</p>
                <p class="mt-1 text-xs text-white/80">
                  Borde plano uniforme, sin refracción de borde ni brillo especular direccional.
                </p>
              </div>
            </div>

            <!-- True Liquid Glass -->
            <lg-surface [interactive]="true" contentClass="p-4 flex flex-col justify-between h-full">
              <span
                class="w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white backdrop-blur-sm"
              >
                Liquid Glass
              </span>
              <div class="mt-6">
                <p class="text-sm font-bold text-white drop-shadow-sm">Óptica Completa</p>
                <p class="mt-1 text-xs text-white/90">
                  Bisel refractivo SDF, borde Fresnel {{ glass.lightAngle() }}°, saturación {{ glass.saturation() }}% y prisma RGB.
                </p>
              </div>
            </lg-surface>
          </div>
        </lg-surface>

        <!-- Live Exportable CSS / Tailwind Snippet -->
        <lg-surface contentClass="p-6 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 rounded-full border p-1" [class]="codeTabBarClass()">
              <button
                type="button"
                class="rounded-full px-3 py-1 text-xs font-semibold transition"
                [class]="codeTab() === 'css' ? activeTabBtnClass() : mutedClass()"
                (click)="codeTab.set('css')"
              >
                CSS + Fresnel
              </button>
              <button
                type="button"
                class="rounded-full px-3 py-1 text-xs font-semibold transition"
                [class]="codeTab() === 'tailwind' ? activeTabBtnClass() : mutedClass()"
                (click)="codeTab.set('tailwind')"
              >
                Tailwind v4
              </button>
            </div>

            <button
              type="button"
              class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition active:scale-95"
              [class]="copyBtnClass()"
              (click)="copyCode()"
            >
              {{ copied() ? '✓ Copiado' : 'Copiar código' }}
            </button>
          </div>

          <pre
            class="max-h-56 overflow-auto rounded-2xl border border-white/10 bg-slate-950/75 p-4 font-mono text-[11px] leading-relaxed text-cyan-100"
          ><code>{{ activeCode() }}</code></pre>
        </lg-surface>
      </div>
    </div>
  `,
})
export class OpticalLabComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly presets = MATERIAL_PRESETS;
  protected readonly tints = TINT_PRESETS;

  protected readonly codeTab = signal<'css' | 'tailwind'>('css');
  protected readonly copied = signal<boolean>(false);

  protected readonly activeCode = computed(() =>
    this.codeTab() === 'css'
      ? this.glass.generatedCssCode()
      : this.glass.generatedTailwindClasses(),
  );

  protected readonly headingClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-900' : 'text-white',
  );
  protected readonly mutedClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-700/80' : 'text-white/70',
  );
  protected readonly badgeClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900/10 text-slate-900'
      : 'bg-white/15 text-white/90',
  );
  protected readonly activePresetClass = computed(() => {
    if (this.glass.isTaxiScene()) {
      return 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]';
    }
    return this.glass.isLightScene()
      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
      : 'bg-white text-slate-950 border-white shadow-lg';
  });
  protected readonly inactivePresetClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/45 text-slate-900 border-slate-900/10 hover:bg-white/70'
      : 'bg-white/[0.08] text-white border-white/15 hover:bg-white/15',
  );
  protected readonly codeTabBarClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/40 border-slate-900/15'
      : 'bg-black/25 border-white/15',
  );
  protected readonly activeTabBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900 text-white'
      : 'bg-white text-slate-950',
  );
  protected readonly copyBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
      : 'bg-white/20 text-white border-white/30 hover:bg-white/30',
  );

  protected onNumberSlider(
    key:
      | 'refraction'
      | 'blur'
      | 'saturation'
      | 'specular'
      | 'chromatic'
      | 'tintOpacity'
      | 'borderRadius'
      | 'lightAngle',
    event: Event,
  ): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.glass.markCustom();
    this.glass[key].set(value);
  }

  protected selectTint(id: (typeof TINT_PRESETS)[number]['id']): void {
    this.glass.markCustom();
    this.glass.tintPreset.set(id);
  }

  protected async copyCode(): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(this.activeCode());
      } catch {
        // Ignore clipboard errors in restricted environments
      }
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
}
