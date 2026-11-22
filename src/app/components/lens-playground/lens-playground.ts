import { Component, computed, inject } from '@angular/core';
import { LiquidGlassService, MATERIAL_PRESETS } from '../../core/liquid-glass.service';
import { GlassSurfaceComponent } from '../glass-surface/glass-surface';

@Component({
  selector: 'lg-lens-playground',
  standalone: true,
  imports: [GlassSurfaceComponent],
  template: `
    <div class="space-y-6">
      <lg-surface contentClass="p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest" [class]="mutedClass()">
            Prueba de Refracción Interactiva
          </p>
          <h3 class="mt-1 text-2xl font-bold tracking-tight" [class]="headingClass()">
            Arrastra la Lupa Óptica sobre el Lienzo
          </h3>
          <p class="mt-1 max-w-2xl text-sm" [class]="mutedClass()">
            Pasa la gota de cristal por encima de las líneas geométricas, la tipografía y el espectro cromático inferior para observar cómo la lente esférica curva y separa los canales RGB en tiempo real.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-95"
            [class]="primaryBtnClass()"
            (click)="activatePrismaticTest()"
          >
            Modo Prisma Máximo
          </button>
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-95"
            [class]="secondaryBtnClass()"
            (click)="glass.showLens.set(true)"
          >
            Mostrar Lupa
          </button>
        </div>
      </lg-surface>

      <!-- High-contrast optical specimen board -->
      <div
        class="relative overflow-hidden rounded-[32px] border border-white/20 bg-slate-950/70 p-6 shadow-2xl sm:p-10"
      >
        <!-- Crisp vertical calibration bars -->
        <div
          class="pointer-events-none absolute inset-0 opacity-20"
          style="background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 2px, transparent 2px, transparent 36px);"
        ></div>

        <div class="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-12">
          <!-- Typography specimen -->
          <div class="space-y-4 md:col-span-7">
            <span
              class="inline-block rounded-full bg-cyan-400/20 px-3 py-1 font-mono text-xs text-cyan-300"
            >
              SPECIMEN · SNELL'S LAW & DISPERSION
            </span>
            <h4 class="text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl">
              La luz se curva en cada borde líquido.
            </h4>
            <p class="max-w-xl text-base leading-relaxed text-slate-300">
              A diferencia del desenfoque plano tradicional, <strong class="text-white">Liquid Glass</strong> combina mapas vectoriales de desplazamiento (SDF), bordes especulares Fresnel y separación prismática de color.
            </p>

            <!-- Color calibration spectrum -->
            <div class="grid grid-cols-6 gap-2 pt-2">
              <div class="h-14 rounded-2xl bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.6)]"></div>
              <div class="h-14 rounded-2xl bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.6)]"></div>
              <div class="h-14 rounded-2xl bg-violet-500 shadow-[0_0_24px_rgba(139,92,246,0.6)]"></div>
              <div class="h-14 rounded-2xl bg-fuchsia-500 shadow-[0_0_24px_rgba(217,70,239,0.6)]"></div>
              <div class="h-14 rounded-2xl bg-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.6)]"></div>
              <div class="h-14 rounded-2xl bg-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.6)]"></div>
            </div>
          </div>

          <!-- Optical geometric target -->
          <div class="flex flex-col items-center justify-center gap-4 md:col-span-5">
            <div
              class="relative flex h-60 w-60 items-center justify-center rounded-full border-4 border-cyan-400/60 bg-gradient-to-tr from-indigo-600/40 via-fuchsia-500/35 to-amber-400/40"
            >
              <div
                class="flex h-44 w-44 items-center justify-center rounded-full border-4 border-white/60"
              >
                <div
                  class="flex h-28 w-28 items-center justify-center rounded-full border-4 border-rose-400/80 bg-white/10"
                >
                  <span class="font-mono text-2xl font-black text-white">n=1.52</span>
                </div>
              </div>
              <div class="absolute inset-x-0 h-0.5 bg-white/45"></div>
              <div class="absolute inset-y-0 w-0.5 bg-white/45"></div>
            </div>
            <p class="font-mono text-xs text-slate-300">
              Índice de refracción simulado · Cristal óptico Crown
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LensPlaygroundComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly headingClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-900' : 'text-white',
  );
  protected readonly mutedClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-700/80' : 'text-white/70',
  );
  protected readonly primaryBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
      : 'bg-white text-slate-950 border-white hover:bg-white/90',
  );
  protected readonly secondaryBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/50 text-slate-900 border-slate-900/15 hover:bg-white/75'
      : 'bg-white/15 text-white border-white/25 hover:bg-white/25',
  );

  protected activatePrismaticTest(): void {
    const prismatic = MATERIAL_PRESETS.find((p) => p.id === 'prismatic-lens');
    if (prismatic) {
      this.glass.applyPreset(prismatic);
    }
    this.glass.scene.set('optical-grid');
    this.glass.showLens.set(true);
  }
}
