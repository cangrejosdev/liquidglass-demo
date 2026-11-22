import { Component, computed, inject, signal } from '@angular/core';
import { LiquidGlassService, MATERIAL_PRESETS } from '../../core/liquid-glass.service';
import { GlassSurfaceComponent } from '../glass-surface/glass-surface';

interface Track {
  title: string;
  artist: string;
  album: string;
  durationSec: number;
  gradient: string;
  accent: string;
}

interface CityWeather {
  city: string;
  temp: number;
  condition: string;
  uv: string;
  wind: string;
  humidity: string;
  orbGradient: string;
}

interface GlassNotification {
  id: number;
  app: string;
  time: string;
  title: string;
  body: string;
  dotColor: string;
}

@Component({
  selector: 'lg-studio-showcase',
  standalone: true,
  imports: [GlassSurfaceComponent],
  template: `
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      @if (glass.isTaxiScene()) {
        <!-- Contextual Taxi App Liquid Glass Ride Card (shown only in Taxi Nocturno theme) -->
        <lg-surface
          class="lg:col-span-12"
          [interactive]="true"
          contentClass="p-5 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="flex items-start gap-4 sm:items-center">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-200/70 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 text-2xl shadow-[0_0_30px_rgba(250,204,21,0.45)]"
            >
              🚕
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-950"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-950"></span>
                  {{ taxiBooked() ? 'Conductor en camino · 3 min' : 'Taxi disponible cerca' }}
                </span>
                <span
                  class="rounded-full border border-yellow-300/35 bg-yellow-400/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-yellow-200"
                >
                  4829 LMG · Prius Híbrido
                </span>
              </div>
              <h3 class="mt-1.5 text-lg font-bold tracking-tight text-white">
                Gran Vía 42 <span class="text-yellow-300">→</span> Aeropuerto T4
              </h3>
              <p class="text-xs text-white/75">
                Carlos M. · ★ 4.96 · Tarifa estimada <strong class="text-yellow-300">18,50 €</strong>
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              class="rounded-full border border-yellow-200/70 bg-yellow-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-[0_0_22px_rgba(250,204,21,0.35)] transition hover:bg-yellow-300 active:scale-95"
              (click)="taxiBooked.set(!taxiBooked())"
            >
              {{ taxiBooked() ? 'Cancelar viaje' : 'Pedir Taxi ahora' }}
            </button>
            <button
              type="button"
              class="rounded-full border border-yellow-300/35 bg-yellow-400/15 px-4 py-2 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-400/25 active:scale-95"
              (click)="applyTaxiAmberMaterial()"
            >
              Aplicar cristal Ámbar Taxi
            </button>
          </div>
        </lg-surface>
      }

      <!-- Spatial Audio Player -->
      <lg-surface
        class="lg:col-span-5"
        [interactive]="true"
        contentClass="p-6 flex flex-col justify-between h-full gap-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg"
              [style.background]="currentTrack().gradient"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_60%)]"
              ></div>
              <div class="relative flex items-end gap-1 h-6">
                @for (speed of eqSpeeds; track $index) {
                  <span
                    class="w-1 rounded-full bg-white/95"
                    [class.animate-lg-eq]="isPlaying()"
                    [style.height.%]="isPlaying() ? 100 : 35"
                    [style.--eq-speed]="speed"
                  ></span>
                }
              </div>
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  [class]="badgeClass()"
                >
                  Audio Espacial
                </span>
              </div>
              <h3 class="mt-1 truncate text-lg font-bold tracking-tight" [class]="headingClass()">
                {{ currentTrack().title }}
              </h3>
              <p class="truncate text-sm" [class]="mutedClass()">
                {{ currentTrack().artist }} · {{ currentTrack().album }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-90"
            [class]="iconButtonClass()"
            [attr.aria-label]="liked() ? 'Quitar de favoritos' : 'Me gusta'"
            (click)="liked.set(!liked())"
          >
            <span [class.text-rose-400]="liked()">{{ liked() ? '♥' : '♡' }}</span>
          </button>
        </div>

        <!-- Scrubber -->
        <div class="space-y-2">
          <div
            class="relative h-2 w-full cursor-pointer overflow-hidden rounded-full"
            [class]="trackBgClass()"
            (click)="seekTrack($event)"
          >
            <div
              class="h-full rounded-full transition-all duration-300"
              [style.width.%]="progressPercent()"
              [style.background]="currentTrack().gradient"
            ></div>
          </div>
          <div class="flex justify-between font-mono text-[11px]" [class]="mutedClass()">
            <span>{{ formatTime(currentSeconds()) }}</span>
            <span>-{{ formatTime(currentTrack().durationSec - currentSeconds()) }}</span>
          </div>
        </div>

        <!-- Transport Controls -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border text-sm transition active:scale-90"
            [class]="iconButtonClass()"
            aria-label="Pista anterior"
            (click)="prevTrack()"
          >
            ⏮
          </button>

          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold shadow-lg transition hover:scale-105 active:scale-95"
            [class]="primaryGlassBtnClass()"
            [attr.aria-label]="isPlaying() ? 'Pausar' : 'Reproducir'"
            (click)="isPlaying.set(!isPlaying())"
          >
            {{ isPlaying() ? '❚❚' : '▶' }}
          </button>

          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border text-sm transition active:scale-90"
            [class]="iconButtonClass()"
            aria-label="Siguiente pista"
            (click)="nextTrack()"
          >
            ⏭
          </button>
        </div>
      </lg-surface>

      <!-- Atmosphere & Weather Card -->
      <lg-surface
        class="lg:col-span-4"
        [interactive]="true"
        contentClass="p-6 flex flex-col justify-between h-full gap-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
              Atmósfera Viva
            </p>
            <h3 class="mt-1 text-2xl font-bold tracking-tight" [class]="headingClass()">
              {{ currentWeather().city }}
            </h3>
            <p class="text-sm" [class]="mutedClass()">{{ currentWeather().condition }}</p>
          </div>

          <!-- Glowing atmospheric orb -->
          <div
            class="h-14 w-14 rounded-full shadow-lg"
            [style.background]="currentWeather().orbGradient"
          ></div>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="text-6xl font-extralight tracking-tighter" [class]="headingClass()">
            {{ currentWeather().temp }}°
          </span>
          <span class="text-sm font-medium" [class]="mutedClass()">Sensación óptica cristalina</span>
        </div>

        <!-- Mini metrics -->
        <div class="grid grid-cols-3 gap-2">
          <div class="rounded-2xl border p-2.5 text-center" [class]="subTileClass()">
            <p class="text-[10px] uppercase tracking-wider" [class]="mutedClass()">Índice UV</p>
            <p class="mt-0.5 text-sm font-semibold" [class]="headingClass()">
              {{ currentWeather().uv }}
            </p>
          </div>
          <div class="rounded-2xl border p-2.5 text-center" [class]="subTileClass()">
            <p class="text-[10px] uppercase tracking-wider" [class]="mutedClass()">Viento</p>
            <p class="mt-0.5 text-sm font-semibold" [class]="headingClass()">
              {{ currentWeather().wind }}
            </p>
          </div>
          <div class="rounded-2xl border p-2.5 text-center" [class]="subTileClass()">
            <p class="text-[10px] uppercase tracking-wider" [class]="mutedClass()">Humedad</p>
            <p class="mt-0.5 text-sm font-semibold" [class]="headingClass()">
              {{ currentWeather().humidity }}
            </p>
          </div>
        </div>

        <!-- City Selector Pills -->
        <div class="flex flex-wrap gap-1.5">
          @for (city of cities; track city.city; let i = $index) {
            <button
              type="button"
              class="rounded-full border px-3 py-1 text-xs font-medium transition active:scale-95"
              [class]="selectedCityIndex() === i ? activePillClass() : inactivePillClass()"
              (click)="selectedCityIndex.set(i)"
            >
              {{ city.city }}
            </button>
          }
        </div>
      </lg-surface>

      <!-- Tactile Liquid Actions + Search -->
      <lg-surface
        class="lg:col-span-3"
        [interactive]="true"
        contentClass="p-6 flex flex-col justify-between h-full gap-5"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
            Interacción Táctil
          </p>
          <h3 class="mt-1 text-lg font-bold tracking-tight" [class]="headingClass()">
            Superficies Reactivas
          </h3>
          <p class="mt-1 text-xs leading-relaxed" [class]="mutedClass()">
            Mueve el cursor sobre cualquier tarjeta para observar el brillo especular Fresnel y los bordes prismáticos.
          </p>
        </div>

        <!-- Glass Search Input -->
        <div
          class="flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 transition focus-within:ring-2 focus-within:ring-cyan-400/50"
          [class]="subTileClass()"
        >
          <span class="text-sm opacity-70" [class]="headingClass()">⌕</span>
          <input
            type="text"
            placeholder="Buscar efecto óptico..."
            [value]="searchQuery()"
            (input)="searchQuery.set($any($event.target).value)"
            class="w-full bg-transparent text-sm outline-none placeholder:opacity-55"
            [class]="headingClass()"
          />
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2.5">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:scale-[1.01] active:scale-[0.97]"
            [class]="primaryGlassBtnClass()"
            (click)="glass.showLens.set(!glass.showLens())"
          >
            <span>{{ glass.showLens() ? 'Ocultar Lupa Óptica' : 'Activar Lupa Óptica' }}</span>
            <span>◎</span>
          </button>

          <button
            type="button"
            class="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition hover:scale-[1.01] active:scale-[0.97]"
            [class]="iconButtonClass()"
            (click)="glass.activeTab.set('lab')"
          >
            <span>Abrir Laboratorio Óptico</span>
            <span>→</span>
          </button>
        </div>
      </lg-surface>

      <!-- Live Notification Stream -->
      <div class="lg:col-span-12">
        <div class="mb-3 flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
              Pila de Notificaciones Liquid Glass
            </span>
            <span class="rounded-full px-2 py-0.5 font-mono text-[11px]" [class]="badgeClass()">
              {{ notifications().length }}
            </span>
          </div>

          @if (notifications().length < initialNotifications.length) {
            <button
              type="button"
              class="rounded-full border px-3 py-1 text-xs font-medium transition active:scale-95"
              [class]="iconButtonClass()"
              (click)="restoreNotifications()"
            >
              Restaurar todas
            </button>
          }
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          @for (item of filteredNotifications(); track item.id) {
            <lg-surface [interactive]="true" contentClass="p-4 flex items-start gap-3.5">
              <div
                class="mt-1 h-3 w-3 shrink-0 rounded-full shadow-md"
                [style.background]="item.dotColor"
              ></div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <span
                    class="text-[11px] font-semibold uppercase tracking-wider"
                    [class]="mutedClass()"
                  >
                    {{ item.app }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-[11px]" [class]="mutedClass()">{{ item.time }}</span>
                    <button
                      type="button"
                      class="rounded-full px-1.5 text-xs opacity-60 transition hover:opacity-100"
                      [class]="headingClass()"
                      title="Descartar"
                      (click)="dismissNotification(item.id)"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p class="mt-0.5 text-sm font-semibold" [class]="headingClass()">
                  {{ item.title }}
                </p>
                <p class="mt-0.5 text-xs leading-relaxed" [class]="mutedClass()">
                  {{ item.body }}
                </p>
              </div>
            </lg-surface>
          } @empty {
            <lg-surface class="md:col-span-3" contentClass="p-6 text-center">
              <p class="text-sm font-medium" [class]="mutedClass()">
                No hay notificaciones que coincidan. Pulsa «Restaurar todas» para ver la pila.
              </p>
            </lg-surface>
          }
        </div>
      </div>
    </div>
  `,
})
export class StudioShowcaseComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly eqSpeeds = ['0.75s', '0.52s', '0.9s', '0.64s'];
  protected readonly isPlaying = signal<boolean>(true);
  protected readonly liked = signal<boolean>(true);
  protected readonly trackIndex = signal<number>(0);
  protected readonly progressPercent = signal<number>(42);
  protected readonly selectedCityIndex = signal<number>(0);
  protected readonly searchQuery = signal<string>('');
  protected readonly taxiBooked = signal<boolean>(true);

  protected readonly tracks: Track[] = [
    {
      title: 'Refracción Nocturna',
      artist: 'Prismatique',
      album: 'Glass Harmonics',
      durationSec: 238,
      gradient: 'linear-gradient(135deg, #22d3ee, #6366f1, #ec4899)',
      accent: '#22d3ee',
    },
    {
      title: 'Luz de Fresnel',
      artist: 'Aether & Co.',
      album: 'Specular Waves',
      durationSec: 194,
      gradient: 'linear-gradient(135deg, #34d399, #0ea5e9, #a855f7)',
      accent: '#34d399',
    },
    {
      title: 'Horizonte Líquido',
      artist: 'Kuroda Synth',
      album: 'Neo Tokyo 26',
      durationSec: 265,
      gradient: 'linear-gradient(135deg, #fb7185, #f59e0b, #6366f1)',
      accent: '#fb7185',
    },
  ];

  protected readonly cities: CityWeather[] = [
    {
      city: 'Madrid',
      temp: 21,
      condition: 'Cielo cristalino',
      uv: '6 Alto',
      wind: '12 km/h',
      humidity: '38%',
      orbGradient: 'radial-gradient(circle at 30% 30%, #fef08a, #f97316 70%, #ec4899)',
    },
    {
      city: 'Tokio',
      temp: 16,
      condition: 'Bruma neón',
      uv: '2 Bajo',
      wind: '18 km/h',
      humidity: '64%',
      orbGradient: 'radial-gradient(circle at 30% 30%, #a5f3fc, #6366f1 70%, #ec4899)',
    },
    {
      city: 'Reikiavik',
      temp: 4,
      condition: 'Aurora activa',
      uv: '1 Bajo',
      wind: '26 km/h',
      humidity: '72%',
      orbGradient: 'radial-gradient(circle at 30% 30%, #6ee7b7, #06b6d4 65%, #4f46e5)',
    },
    {
      city: 'CDMX',
      temp: 24,
      condition: 'Brisa templada',
      uv: '8 Muy alto',
      wind: '9 km/h',
      humidity: '44%',
      orbGradient: 'radial-gradient(circle at 30% 30%, #fde68a, #fb7185 75%, #9333ea)',
    },
  ];

  protected readonly initialNotifications: GlassNotification[] = [
    {
      id: 1,
      app: 'Motor Óptico',
      time: 'ahora',
      title: 'Mapa de desplazamiento SDF activo',
      body: 'Refracción vectorial en biseles generada proceduralmente con Canvas + SVG Filters.',
      dotColor: '#22d3ee',
    },
    {
      id: 2,
      app: 'Angular 22',
      time: 'hace 2 min',
      title: 'Reactividad 100% con Signals',
      body: 'Todos los parámetros ópticos propagan CSS custom properties y filtros SVG sin Zone.js.',
      dotColor: '#f472b6',
    },
    {
      id: 3,
      app: 'Tailwind CSS v4',
      time: 'hace 5 min',
      title: 'Luminancia adaptativa',
      body: 'Cambia al fondo «Alba Alpina» para ver cómo el cristal y la tipografía se adaptan.',
      dotColor: '#34d399',
    },
  ];

  protected readonly notifications = signal<GlassNotification[]>([...this.initialNotifications]);

  protected readonly currentTrack = computed(() => this.tracks[this.trackIndex()]);
  protected readonly currentWeather = computed(() => this.cities[this.selectedCityIndex()]);
  protected readonly currentSeconds = computed(() =>
    Math.round((this.progressPercent() / 100) * this.currentTrack().durationSec),
  );

  protected readonly filteredNotifications = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.notifications();
    return this.notifications().filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.app.toLowerCase().includes(q),
    );
  });

  // Adaptive theme utility classes
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
  protected readonly subTileClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/40 border-slate-900/10'
      : 'bg-white/[0.08] border-white/15',
  );
  protected readonly iconButtonClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/50 border-slate-900/15 text-slate-900 hover:bg-white/75'
      : 'bg-white/10 border-white/20 text-white hover:bg-white/20',
  );
  protected readonly primaryGlassBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900/85 border-slate-900/20 text-white hover:bg-slate-900'
      : 'bg-white/25 border-white/40 text-white hover:bg-white/35',
  );
  protected readonly trackBgClass = computed(() =>
    this.glass.isLightScene() ? 'bg-slate-900/15' : 'bg-white/20',
  );
  protected readonly activePillClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900 text-white border-slate-900'
      : 'bg-white text-slate-950 border-white',
  );
  protected readonly inactivePillClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/40 text-slate-800 border-slate-900/10 hover:bg-white/65'
      : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20',
  );

  protected prevTrack(): void {
    this.trackIndex.update((i) => (i - 1 + this.tracks.length) % this.tracks.length);
    this.progressPercent.set(18);
  }

  protected nextTrack(): void {
    this.trackIndex.update((i) => (i + 1) % this.tracks.length);
    this.progressPercent.set(12);
  }

  protected seekTrack(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    this.progressPercent.set(Math.round(pct));
  }

  protected formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  protected dismissNotification(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  protected restoreNotifications(): void {
    this.notifications.set([...this.initialNotifications]);
  }

  protected applyTaxiAmberMaterial(): void {
    const preset = MATERIAL_PRESETS.find((p) => p.id === 'taxi-amber');
    if (preset) {
      this.glass.applyPreset(preset);
    }
  }
}
