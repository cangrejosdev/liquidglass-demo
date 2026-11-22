import { Component, computed, inject } from '@angular/core';
import { ActiveTab, LiquidGlassService } from '../../core/liquid-glass.service';
import { GlassSurfaceComponent } from '../glass-surface/glass-surface';

interface DockItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'lg-floating-dock',
  standalone: true,
  imports: [GlassSurfaceComponent],
  template: `
    <nav
      aria-label="Navegación principal Liquid Glass"
      class="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 pointer-events-none"
    >
      <lg-surface
        class="pointer-events-auto max-w-full"
        customRadius="9999px"
        contentClass="p-1.5 flex items-center gap-1.5"
      >
        <div class="relative grid grid-cols-4 items-center">
          <!-- Morphing liquid indicator pill -->
          <div
            class="pointer-events-none absolute bottom-0 top-0 w-1/4 rounded-full border transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            [class]="indicatorClass()"
            [style.transform]="'translateX(' + activeIndex() * 100 + '%)'"
          ></div>

          @for (item of items; track item.id) {
            <button
              type="button"
              class="relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-semibold transition-colors sm:px-5 sm:text-sm"
              [class]="glass.activeTab() === item.id ? activeTextClass() : inactiveTextClass()"
              (click)="glass.activeTab.set(item.id)"
            >
              <span class="text-sm">{{ item.icon }}</span>
              <span class="hidden sm:inline">{{ item.label }}</span>
            </button>
          }
        </div>

        <div class="h-6 w-px opacity-20" [class]="dividerClass()"></div>

        <!-- Quick toggle for draggable crystal lens -->
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-xs font-semibold transition active:scale-95"
          [class]="glass.showLens() ? lensActiveBtnClass() : lensInactiveBtnClass()"
          [title]="glass.showLens() ? 'Ocultar lupa óptica' : 'Mostrar lupa óptica'"
          (click)="glass.showLens.set(!glass.showLens())"
        >
          <span>◎</span>
          <span class="hidden md:inline">Lupa</span>
        </button>
      </lg-surface>
    </nav>
  `,
})
export class FloatingDockComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly items: DockItem[] = [
    { id: 'studio', label: 'Estudio', icon: '✦' },
    { id: 'controls', label: 'Controles', icon: '⌘' },
    { id: 'lab', label: 'Laboratorio', icon: '◈' },
    { id: 'playground', label: 'Refracción', icon: '◉' },
  ];

  protected readonly activeIndex = computed(() =>
    Math.max(0, this.items.findIndex((i) => i.id === this.glass.activeTab())),
  );

  protected readonly indicatorClass = computed(() => {
    if (this.glass.isTaxiScene()) {
      return 'bg-yellow-400 border-yellow-200/70 shadow-[0_0_24px_rgba(250,204,21,0.45)]';
    }
    return this.glass.isLightScene()
      ? 'bg-slate-900/90 border-slate-900/20 shadow-lg'
      : 'bg-white/25 border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_20px_rgba(0,0,0,0.25)]';
  });

  protected readonly activeTextClass = computed(() =>
    this.glass.isTaxiScene() ? 'text-slate-950' : 'text-white',
  );

  protected readonly inactiveTextClass = computed(() =>
    this.glass.isLightScene()
      ? 'text-slate-800/80 hover:text-slate-950'
      : 'text-white/70 hover:text-white',
  );

  protected readonly dividerClass = computed(() =>
    this.glass.isLightScene() ? 'bg-slate-900' : 'bg-white',
  );

  protected readonly lensActiveBtnClass = computed(() => {
    if (this.glass.isTaxiScene()) {
      return 'bg-yellow-400/30 text-yellow-100 border-yellow-300/60 shadow-[0_0_20px_rgba(250,204,21,0.35)]';
    }
    return this.glass.isLightScene()
      ? 'bg-cyan-600 text-white border-cyan-700/30 shadow-md'
      : 'bg-cyan-400/30 text-cyan-100 border-cyan-300/50 shadow-[0_0_20px_rgba(34,211,238,0.35)]';
  });

  protected readonly lensInactiveBtnClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/40 text-slate-800 border-slate-900/15 hover:bg-white/70'
      : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20',
  );
}
