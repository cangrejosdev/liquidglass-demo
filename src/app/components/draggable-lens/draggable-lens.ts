import { Component, computed, inject, signal } from '@angular/core';
import { LensShape, LiquidGlassService } from '../../core/liquid-glass.service';

@Component({
  selector: 'lg-draggable-lens',
  standalone: true,
  template: `
    @if (glass.showLens()) {
      <div
        class="fixed left-0 top-0 z-50 select-none touch-none"
        [style.transform]="'translate3d(' + posX() + 'px, ' + posY() + 'px, 0)'"
        [class.cursor-grabbing]="dragging()"
        [class.cursor-grab]="!dragging()"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
      >
        <div
          class="relative overflow-hidden transition-[width,height,border-radius,transform] duration-300 ease-out"
          [class.scale-[1.04]]="dragging()"
          [style.width.px]="dimensions().w"
          [style.height.px]="dimensions().h"
          [style.border-radius]="dimensions().radius"
          style="box-shadow: 0 28px 65px -12px rgba(0,0,0,0.52), 0 8px 20px rgba(0,0,0,0.28), inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(255,255,255,0.22), inset 2px 0 4px rgba(125,211,252,0.45), inset -2px 0 4px rgba(244,114,182,0.45);"
        >
          <!-- Optical spherical magnifying refraction layer -->
          <div
            class="pointer-events-none absolute inset-0 rounded-[inherit]"
            [style.backdrop-filter]="lensBackdropFilter()"
            [style.-webkit-backdrop-filter]="lensBackdropFilter()"
          ></div>

          <!-- Clear crystal specular dome highlight -->
          <div
            class="pointer-events-none absolute inset-0 rounded-[inherit]"
            style="background: radial-gradient(120% 85% at 28% 18%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0) 60%), radial-gradient(85% 60% at 75% 88%, rgba(255,255,255,0.26) 0%, transparent 65%);"
          ></div>

          <!-- Prismatic curved Fresnel rim -->
          <div
            class="pointer-events-none absolute inset-0 rounded-[inherit] p-[1.75px]"
            style="background: conic-gradient(from 135deg, rgba(255,255,255,0.95), rgba(56,189,248,0.65), rgba(255,255,255,0.25), rgba(244,114,182,0.7), rgba(255,255,255,0.85), rgba(52,211,153,0.55), rgba(255,255,255,0.95)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude;"
          ></div>

          <!-- Subtle floating HUD inside the lens -->
          <div class="relative z-10 flex h-full flex-col justify-between p-3.5">
            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white/95 uppercase backdrop-blur-md"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]"></span>
                Lupa Óptica
              </span>

              <button
                type="button"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-black/30 text-xs text-white/90 transition hover:bg-black/50"
                title="Ocultar lupa"
                (pointerdown)="$event.stopPropagation()"
                (click)="glass.showLens.set(false)"
              >
                ✕
              </button>
            </div>

            <div class="flex items-center justify-between gap-1.5">
              <div
                class="flex items-center gap-1 rounded-full bg-black/30 p-0.5 backdrop-blur-md"
                (pointerdown)="$event.stopPropagation()"
              >
                @for (shape of shapes; track shape.id) {
                  <button
                    type="button"
                    class="rounded-full px-2 py-0.5 text-[10px] font-medium transition"
                    [class.bg-white]="glass.lensShape() === shape.id"
                    [class.text-slate-900]="glass.lensShape() === shape.id"
                    [class.text-white/80]="glass.lensShape() !== shape.id"
                    [class.hover:text-white]="glass.lensShape() !== shape.id"
                    (click)="glass.lensShape.set(shape.id)"
                  >
                    {{ shape.label }}
                  </button>
                }
              </div>

              <span
                class="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/85 backdrop-blur-md"
              >
                {{ glass.lensDisplacementScale() }}px
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DraggableLensComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly shapes: { id: LensShape; label: string }[] = [
    { id: 'droplet', label: 'Gota' },
    { id: 'circle', label: 'Lente' },
    { id: 'pill', label: 'Cápsula' },
  ];

  protected readonly posX = signal<number>(
    typeof window !== 'undefined' ? Math.max(24, Math.min(window.innerWidth - 290, window.innerWidth - 340)) : 640,
  );
  protected readonly posY = signal<number>(112);
  protected readonly dragging = signal<boolean>(false);

  private dragOffsetX = 0;
  private dragOffsetY = 0;

  protected readonly dimensions = computed(() => {
    switch (this.glass.lensShape()) {
      case 'circle':
        return { w: 210, h: 210, radius: '9999px' };
      case 'pill':
        return { w: 300, h: 126, radius: '9999px' };
      case 'droplet':
      default:
        return { w: 248, h: 174, radius: '42px' };
    }
  });

  protected readonly lensBackdropFilter = computed(() => {
    const sat = Math.min(260, this.glass.saturation() + 20);
    const lensBlur = Math.max(0.5, Math.round(this.glass.blur() * 0.14 * 10) / 10);
    if (this.glass.svgRefractionEnabled()) {
      return `url(#lg-lens-filter) blur(${lensBlur}px) saturate(${sat}%) brightness(1.1)`;
    }
    return `blur(${Math.max(4, lensBlur * 2)}px) saturate(${sat}%) brightness(1.1)`;
  });

  protected onPointerDown(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    this.dragging.set(true);
    this.dragOffsetX = event.clientX - this.posX();
    this.dragOffsetY = event.clientY - this.posY();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const { w, h } = this.dimensions();
    const maxX = typeof window !== 'undefined' ? window.innerWidth - w - 8 : 1000;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - h - 8 : 700;
    this.posX.set(Math.max(8, Math.min(maxX, event.clientX - this.dragOffsetX)));
    this.posY.set(Math.max(8, Math.min(maxY, event.clientY - this.dragOffsetY)));
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) return;
    const el = event.currentTarget as HTMLElement | null;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    this.dragging.set(false);
  }
}
