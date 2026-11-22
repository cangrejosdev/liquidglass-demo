import { Component, computed, inject, signal } from '@angular/core';
import { LiquidGlassService } from '../../core/liquid-glass.service';
import { GlassSurfaceComponent } from '../glass-surface/glass-surface';

interface ConnectivityTile {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  activeColor: string;
  active: boolean;
}

@Component({
  selector: 'lg-control-center',
  standalone: true,
  imports: [GlassSurfaceComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Connectivity 2x2 Matrix -->
      <lg-surface class="lg:col-span-5" contentClass="p-6 flex flex-col gap-5 h-full justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
            Centro de Control · iOS 26
          </p>
          <h3 class="mt-1 text-xl font-bold tracking-tight" [class]="headingClass()">
            Conectividad Líquida
          </h3>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          @for (tile of connectivity(); track tile.id) {
            <button
              type="button"
              class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-4 text-left transition duration-300 active:scale-95"
              [class]="tile.active ? activeTileClass() : inactiveTileClass()"
              (click)="toggleConnectivity(tile.id)"
            >
              <div class="flex items-center justify-between">
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-inner transition duration-300"
                  [style.background]="tile.active ? tile.activeColor : 'rgba(255,255,255,0.14)'"
                  [class.text-white]="true"
                >
                  {{ tile.icon }}
                </span>
                <span
                  class="h-2 w-2 rounded-full transition"
                  [style.background]="tile.active ? tile.activeColor : 'rgba(255,255,255,0.25)'"
                ></span>
              </div>
              <div class="mt-4">
                <p class="text-sm font-semibold" [class]="headingClass()">{{ tile.label }}</p>
                <p class="text-xs" [class]="mutedClass()">
                  {{ tile.active ? tile.sublabel : 'Desactivado' }}
                </p>
              </div>
            </button>
          }
        </div>
      </lg-surface>

      <!-- Vertical Tactile Liquid Glass Sliders (Brightness & Volume) -->
      <lg-surface class="lg:col-span-3" contentClass="p-6 flex flex-col justify-between gap-5 h-full">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
            Deslizadores Ópticos
          </p>
          <h3 class="mt-1 text-lg font-bold tracking-tight" [class]="headingClass()">
            Brillo & Volumen
          </h3>
        </div>

        <div class="grid flex-1 grid-cols-2 gap-4">
          <!-- Brightness Vertical Pill -->
          <div class="flex flex-col items-center gap-2">
            <div
              class="relative h-56 w-full cursor-ns-resize select-none overflow-hidden rounded-[28px] border touch-none"
              [class]="sliderTrackClass()"
              (pointerdown)="startVerticalDrag($event, 'brightness')"
              (pointermove)="moveVerticalDrag($event, 'brightness')"
              (pointerup)="stopVerticalDrag($event)"
            >
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-amber-300/90 via-white/95 to-white transition-[height] duration-75"
                [style.height.%]="glass.sceneLuminance()"
              ></div>
              <div
                class="pointer-events-none absolute inset-x-0 bottom-3.5 flex flex-col items-center"
              >
                <span class="text-lg text-slate-900 drop-shadow">☀</span>
                <span class="font-mono text-[11px] font-bold text-slate-900">
                  {{ glass.sceneLuminance() }}%
                </span>
              </div>
            </div>
            <span class="text-xs font-medium" [class]="mutedClass()">Brillo Escena</span>
          </div>

          <!-- Volume Vertical Pill -->
          <div class="flex flex-col items-center gap-2">
            <div
              class="relative h-56 w-full cursor-ns-resize select-none overflow-hidden rounded-[28px] border touch-none"
              [class]="sliderTrackClass()"
              (pointerdown)="startVerticalDrag($event, 'volume')"
              (pointermove)="moveVerticalDrag($event, 'volume')"
              (pointerup)="stopVerticalDrag($event)"
            >
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-cyan-400/90 via-sky-200/95 to-white transition-[height] duration-75"
                [style.height.%]="volume()"
              ></div>
              <div
                class="pointer-events-none absolute inset-x-0 bottom-3.5 flex flex-col items-center"
              >
                <span class="text-lg text-slate-900 drop-shadow">♫</span>
                <span class="font-mono text-[11px] font-bold text-slate-900">
                  {{ volume() }}%
                </span>
              </div>
            </div>
            <span class="text-xs font-medium" [class]="mutedClass()">Volumen</span>
          </div>
        </div>
      </lg-surface>

      <!-- Liquid Switches & Morphing Segmented Picker -->
      <lg-surface class="lg:col-span-4" contentClass="p-6 flex flex-col justify-between gap-6 h-full">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
            Interruptores & Modos
          </p>
          <h3 class="mt-1 text-xl font-bold tracking-tight" [class]="headingClass()">
            Física del Cristal
          </h3>
        </div>

        <!-- Liquid Switches -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold" [class]="headingClass()">Refracción SVG Real</p>
              <p class="text-xs" [class]="mutedClass()">Desplazamiento óptico en biseles (Chromium)</p>
            </div>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="glass.svgRefractionEnabled()"
              class="relative h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300"
              [class]="
                glass.svgRefractionEnabled()
                  ? 'border-cyan-300/60 bg-cyan-400/75 shadow-[0_0_20px_rgba(34,211,238,0.45)]'
                  : 'border-white/20 bg-white/15'
              "
              (click)="glass.svgRefractionEnabled.set(!glass.svgRefractionEnabled())"
            >
              <span
                class="block h-5.5 w-6 rounded-full bg-white shadow-md transition-transform duration-300"
                [class.translate-x-5.5]="glass.svgRefractionEnabled()"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold" [class]="headingClass()">Dispersión Prismática</p>
              <p class="text-xs" [class]="mutedClass()">Borde iridiscente + aberración RGB</p>
            </div>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="glass.chromatic() > 0"
              class="relative h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300"
              [class]="
                glass.chromatic() > 0
                  ? 'border-fuchsia-300/60 bg-fuchsia-400/75 shadow-[0_0_20px_rgba(232,121,249,0.45)]'
                  : 'border-white/20 bg-white/15'
              "
              (click)="toggleChromatic()"
            >
              <span
                class="block h-5.5 w-6 rounded-full bg-white shadow-md transition-transform duration-300"
                [class.translate-x-5.5]="glass.chromatic() > 0"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold" [class]="headingClass()">Lupa Flotante</p>
              <p class="text-xs" [class]="mutedClass()">Gota esférica arrastrable por la pantalla</p>
            </div>
            <button
              type="button"
              role="switch"
              [attr.aria-checked]="glass.showLens()"
              class="relative h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300"
              [class]="
                glass.showLens()
                  ? 'border-emerald-300/60 bg-emerald-400/75 shadow-[0_0_20px_rgba(52,211,153,0.45)]'
                  : 'border-white/20 bg-white/15'
              "
              (click)="glass.showLens.set(!glass.showLens())"
            >
              <span
                class="block h-5.5 w-6 rounded-full bg-white shadow-md transition-transform duration-300"
                [class.translate-x-5.5]="glass.showLens()"
              ></span>
            </button>
          </div>
        </div>

        <!-- Morphing Segmented Glass Control -->
        <div class="space-y-2">
          <p class="text-xs font-medium" [class]="mutedClass()">Perfil de Nitidez</p>
          <div
            class="relative grid grid-cols-3 rounded-2xl border p-1"
            [class]="sliderTrackClass()"
          >
            <div
              class="pointer-events-none absolute bottom-1 top-1 w-[calc(33.333%-4px)] rounded-xl bg-white/90 shadow-md transition-transform duration-300 ease-out"
              [style.transform]="'translateX(' + clarityIndex() * 100 + '%)'"
            ></div>
            @for (mode of clarityModes; track mode.id; let i = $index) {
              <button
                type="button"
                class="relative z-10 py-2 text-xs font-semibold transition-colors"
                [class.text-slate-950]="clarityIndex() === i"
                [class]="clarityIndex() === i ? 'text-slate-950' : mutedClass()"
                (click)="applyClarityMode(i)"
              >
                {{ mode.label }}
              </button>
            }
          </div>
        </div>
      </lg-surface>
    </div>
  `,
})
export class ControlCenterComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly volume = signal<number>(74);
  protected readonly clarityIndex = signal<number>(1);
  private draggingSlider: 'brightness' | 'volume' | null = null;

  protected readonly clarityModes = [
    { id: 'crystal', label: 'Cristal', blur: 6, refraction: 88, tintOpacity: 7 },
    { id: 'balanced', label: 'Equilibrado', blur: 12, refraction: 68, tintOpacity: 11 },
    { id: 'frosted', label: 'Escarcha', blur: 24, refraction: 35, tintOpacity: 20 },
  ];

  protected readonly connectivity = signal<ConnectivityTile[]>([
    { id: 'wifi', label: 'Wi-Fi 7', sublabel: 'Studio_6GHz', icon: '≋', activeColor: '#0ea5e9', active: true },
    { id: 'bt', label: 'Bluetooth', sublabel: 'AirPods Max', icon: 'ᛒ', activeColor: '#6366f1', active: true },
    { id: 'airdrop', label: 'AirDrop', sublabel: 'Solo contactos', icon: '◎', activeColor: '#10b981', active: true },
    { id: 'focus', label: 'Enfoque', sublabel: 'Modo Diseño', icon: '☾', activeColor: '#ec4899', active: false },
  ]);

  protected readonly headingClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-900' : 'text-white',
  );
  protected readonly mutedClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-700/80' : 'text-white/70',
  );
  protected readonly activeTileClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/65 border-slate-900/15 shadow-sm'
      : 'bg-white/18 border-white/30 shadow-lg',
  );
  protected readonly inactiveTileClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/30 border-slate-900/10 opacity-75'
      : 'bg-white/[0.06] border-white/10 opacity-75 hover:opacity-100',
  );
  protected readonly sliderTrackClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900/12 border-slate-900/15'
      : 'bg-black/25 border-white/20',
  );

  protected toggleConnectivity(id: string): void {
    this.connectivity.update((list) =>
      list.map((tile) => (tile.id === id ? { ...tile, active: !tile.active } : tile)),
    );
  }

  protected toggleChromatic(): void {
    this.glass.markCustom();
    this.glass.chromatic.set(this.glass.chromatic() > 0 ? 0 : 65);
  }

  protected applyClarityMode(index: number): void {
    this.clarityIndex.set(index);
    const mode = this.clarityModes[index];
    this.glass.markCustom();
    this.glass.blur.set(mode.blur);
    this.glass.refraction.set(mode.refraction);
    this.glass.tintOpacity.set(mode.tintOpacity);
  }

  protected startVerticalDrag(event: PointerEvent, kind: 'brightness' | 'volume'): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    this.draggingSlider = kind;
    this.updateVerticalValue(event, el, kind);
  }

  protected moveVerticalDrag(event: PointerEvent, kind: 'brightness' | 'volume'): void {
    if (this.draggingSlider !== kind) return;
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    this.updateVerticalValue(event, el, kind);
  }

  protected stopVerticalDrag(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    this.draggingSlider = null;
  }

  private updateVerticalValue(
    event: PointerEvent,
    el: HTMLElement,
    kind: 'brightness' | 'volume',
  ): void {
    const rect = el.getBoundingClientRect();
    const ratio = 1 - (event.clientY - rect.top) / rect.height;
    const value = Math.max(8, Math.min(100, Math.round(ratio * 100)));
    if (kind === 'brightness') {
      this.glass.sceneLuminance.set(value);
    } else {
      this.volume.set(value);
    }
  }
}
