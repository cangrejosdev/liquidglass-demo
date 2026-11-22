import { Component, computed, inject } from '@angular/core';
import { ControlCenterComponent } from './components/control-center/control-center';
import { DraggableLensComponent } from './components/draggable-lens/draggable-lens';
import { FloatingDockComponent } from './components/floating-dock/floating-dock';
import { GlassSurfaceComponent } from './components/glass-surface/glass-surface';
import { LensPlaygroundComponent } from './components/lens-playground/lens-playground';
import { OpticalLabComponent } from './components/optical-lab/optical-lab';
import { SceneBackdropComponent } from './components/scene-backdrop/scene-backdrop';
import { StudioShowcaseComponent } from './components/studio-showcase/studio-showcase';
import { SvgFiltersComponent } from './components/svg-filters/svg-filters';
import { LiquidGlassService, SCENES } from './core/liquid-glass.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SvgFiltersComponent,
    SceneBackdropComponent,
    DraggableLensComponent,
    GlassSurfaceComponent,
    StudioShowcaseComponent,
    ControlCenterComponent,
    OpticalLabComponent,
    LensPlaygroundComponent,
    FloatingDockComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly glass = inject(LiquidGlassService);
  protected readonly scenes = SCENES;

  protected readonly headingClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-900' : 'text-white',
  );

  protected readonly mutedClass = computed(() =>
    this.glass.isLightScene() ? 'text-slate-700/85' : 'text-white/75',
  );

  protected readonly chipClass = computed(() => {
    if (this.glass.isTaxiScene()) {
      return 'bg-yellow-400/15 border-yellow-300/35 text-yellow-100';
    }
    return this.glass.isLightScene()
      ? 'bg-white/55 border-slate-900/12 text-slate-900'
      : 'bg-white/12 border-white/20 text-white/90';
  });

  protected readonly brandBadgeClass = computed(() =>
    this.glass.isTaxiScene()
      ? 'border-yellow-200/60 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-slate-950 shadow-[0_0_24px_rgba(250,204,21,0.45)]'
      : 'border-white/40 bg-gradient-to-br from-cyan-300/80 via-indigo-400/70 to-fuchsia-400/80 text-white',
  );

  protected readonly sceneActiveClass = computed(() => {
    if (this.glass.isTaxiScene()) {
      return 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.45)]';
    }
    return this.glass.isLightScene()
      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
      : 'bg-white text-slate-950 border-white shadow-md';
  });

  protected readonly sceneInactiveClass = computed(() =>
    this.glass.isLightScene()
      ? 'bg-white/40 text-slate-800 border-slate-900/10 hover:bg-white/70'
      : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20',
  );
}
