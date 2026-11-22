import { Component, computed, inject, signal } from '@angular/core';
import { LiquidGlassService } from '../../core/liquid-glass.service';

@Component({
  selector: 'lg-svg-filters',
  standalone: true,
  template: `
    <svg
      aria-hidden="true"
      class="pointer-events-none fixed -left-[9999px] -top-[9999px] h-0 w-0 opacity-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Surface Bezel Optical Refraction + Prismatic RGB Dispersion -->
        <filter
          id="lg-surface-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          color-interpolation-filters="sRGB"
        >
          @if (bezelMapUrl()) {
            <feImage
              [attr.href]="bezelMapUrl()"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="bezelMap"
            />
          } @else {
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              result="bezelMap"
            />
          }

          @if (glass.chromatic() > 8 && glass.surfaceDisplacementScale() > 0) {
            <!-- Red channel: slightly stronger refraction -->
            <feDisplacementMap
              in="SourceGraphic"
              in2="bezelMap"
              [attr.scale]="surfaceRedScale()"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="onlyR"
            />

            <!-- Green channel: reference refraction -->
            <feDisplacementMap
              in="SourceGraphic"
              in2="bezelMap"
              [attr.scale]="glass.surfaceDisplacementScale()"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="onlyG"
            />

            <!-- Blue channel: slightly weaker refraction -->
            <feDisplacementMap
              in="SourceGraphic"
              in2="bezelMap"
              [attr.scale]="surfaceBlueScale()"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="onlyB"
            />

            <feBlend in="onlyR" in2="onlyG" mode="screen" result="rg" />
            <feBlend in="rg" in2="onlyB" mode="screen" />
          } @else {
            <feDisplacementMap
              in="SourceGraphic"
              in2="bezelMap"
              [attr.scale]="glass.surfaceDisplacementScale()"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          }
        </filter>

        <!-- Spherical Convex Optical Lens Filter for Draggable Droplet / Loupe -->
        <filter
          id="lg-lens-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          color-interpolation-filters="sRGB"
        >
          @if (lensMapUrl()) {
            <feImage
              [attr.href]="lensMapUrl()"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lensMap"
            />
          } @else {
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="lensMap"
            />
          }

          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            [attr.scale]="lensRedScale()"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lDispR"
          />
          <feColorMatrix
            in="lDispR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="lOnlyR"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            [attr.scale]="glass.lensDisplacementScale()"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lDispG"
          />
          <feColorMatrix
            in="lDispG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="lOnlyG"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            [attr.scale]="lensBlueScale()"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lDispB"
          />
          <feColorMatrix
            in="lDispB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="lOnlyB"
          />

          <feBlend in="lOnlyR" in2="lOnlyG" mode="screen" result="lRG" />
          <feBlend in="lRG" in2="lOnlyB" mode="screen" />
        </filter>
      </defs>
    </svg>
  `,
})
export class SvgFiltersComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly bezelMapUrl = signal<string>('');
  protected readonly lensMapUrl = signal<string>('');

  protected readonly surfaceRedScale = computed(() =>
    Math.round(this.glass.surfaceDisplacementScale() + this.glass.chromaticDelta()),
  );
  protected readonly surfaceBlueScale = computed(() =>
    Math.max(0, Math.round(this.glass.surfaceDisplacementScale() - this.glass.chromaticDelta())),
  );

  protected readonly lensRedScale = computed(() =>
    Math.round(this.glass.lensDisplacementScale() + this.glass.chromaticDelta() * 1.45),
  );
  protected readonly lensBlueScale = computed(() =>
    Math.max(0, Math.round(this.glass.lensDisplacementScale() - this.glass.chromaticDelta() * 1.45)),
  );

  constructor() {
    this.bezelMapUrl.set(this.glass.generateBezelDisplacementMap(256, 0.22));
    this.lensMapUrl.set(this.glass.generateSphericalLensMap(256));
  }
}
