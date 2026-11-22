import { Component, computed, inject } from '@angular/core';
import { LiquidGlassService } from '../../core/liquid-glass.service';

@Component({
  selector: 'lg-scene-backdrop',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[filter] duration-300"
      [style.filter]="luminanceFilter()"
    >
      @switch (glass.scene()) {
        @case ('aurora') {
          <!-- Aurora Borealis: luminous ribbons, floating chromatic orbs & subtle editorial grid -->
          <div class="absolute inset-0 bg-[#040715]"></div>
          <div
            class="animate-lg-float absolute -left-24 -top-24 h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-cyan-400/75 via-blue-600/55 to-transparent blur-3xl"
          ></div>
          <div
            class="animate-lg-float-reverse absolute -right-28 top-[12%] h-[42rem] w-[42rem] rounded-full bg-gradient-to-bl from-fuchsia-500/70 via-violet-600/55 to-transparent blur-3xl"
          ></div>
          <div
            class="animate-lg-float absolute bottom-[-14%] left-[22%] h-[36rem] w-[44rem] rounded-full bg-gradient-to-tr from-emerald-400/65 via-teal-500/45 to-amber-300/30 blur-3xl"
          ></div>

          <!-- Crisp luminous shapes behind the glass to reveal optical refraction -->
          <div
            class="animate-lg-ribbon absolute -left-[10%] top-[24%] h-40 w-[120%] bg-gradient-to-r from-cyan-300/45 via-fuchsia-400/45 to-amber-300/45 blur-md"
          ></div>
          <div
            class="absolute right-[14%] top-[18%] h-44 w-44 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-200 shadow-[0_0_90px_rgba(244,114,182,0.75)]"
          ></div>
          <div
            class="absolute bottom-[22%] left-[10%] h-36 w-36 rounded-full bg-gradient-to-tr from-emerald-400 via-cyan-300 to-white shadow-[0_0_80px_rgba(34,211,238,0.7)]"
          ></div>

          <!-- Subtle diagonal architectural lines -->
          <div
            class="absolute inset-0 opacity-20"
            style="background-image: linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px); background-size: 72px 72px;"
          ></div>
          <div
            class="absolute inset-x-0 top-[46%] flex select-none justify-center overflow-hidden opacity-[0.14]"
          >
            <span class="whitespace-nowrap text-[14vw] font-black tracking-[-0.06em] text-white">
              LIQUID GLASS
            </span>
          </div>
        }

        @case ('optical-grid') {
          <!-- High-contrast Optical Calibration Backdrop: bends lines dramatically under refraction -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
          ></div>

          <!-- Precision checker & line pattern -->
          <div
            class="absolute inset-0 opacity-35"
            style="background-image: linear-gradient(rgba(56,189,248,0.55) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(244,114,182,0.55) 1.5px, transparent 1.5px); background-size: 44px 44px;"
          ></div>

          <!-- Vivid chromatic spectrum ribbons -->
          <div
            class="absolute -left-20 top-[18%] h-24 w-[130%] -rotate-6 bg-gradient-to-r from-cyan-400 via-violet-500 via-50% to-rose-500 opacity-85 shadow-[0_0_60px_rgba(56,189,248,0.5)]"
          ></div>
          <div
            class="absolute -left-20 bottom-[22%] h-20 w-[130%] rotate-3 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 opacity-80"
          ></div>

          <!-- Concentric calibration target rings -->
          <div
            class="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-300/40"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-fuchsia-400/45"
          ></div>
          <div
            class="absolute left-1/2 top-1/2 h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300/55"
          ></div>

          <div
            class="absolute inset-x-0 top-[36%] flex flex-col items-center gap-3 select-none opacity-30"
          >
            <span class="text-[11vw] font-black leading-none tracking-tighter text-white">
              REFRACCIÓN · 22
            </span>
            <span class="font-mono text-lg tracking-[0.65em] text-cyan-200">
              OPTICAL DISPLACEMENT CALIBRATION
            </span>
          </div>
        }

        @case ('alpine') {
          <!-- Bright Alpine Sunrise: tests adaptive light-mode glass luminance -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-sky-200 via-amber-50 to-rose-200"
          ></div>
          <div
            class="animate-lg-float absolute left-[12%] top-[8%] h-80 w-80 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-white shadow-[0_0_120px_rgba(251,191,36,0.9)]"
          ></div>
          <div
            class="animate-lg-float-reverse absolute right-[8%] top-[22%] h-96 w-96 rounded-full bg-gradient-to-bl from-sky-400/75 via-indigo-300/55 to-transparent blur-2xl"
          ></div>
          <div
            class="absolute -bottom-24 left-[-5%] h-[52vh] w-[70vw] rotate-[-7deg] rounded-t-[100%] bg-gradient-to-t from-indigo-500/70 via-sky-400/60 to-white/80"
          ></div>
          <div
            class="absolute -bottom-28 right-[-8%] h-[56vh] w-[72vw] rotate-[6deg] rounded-t-[100%] bg-gradient-to-t from-rose-400/65 via-orange-300/60 to-amber-100/80"
          ></div>
          <div
            class="absolute inset-0 opacity-20"
            style="background-image: radial-gradient(rgba(15,23,42,0.35) 1px, transparent 1px); background-size: 36px 36px;"
          ></div>
          <div
            class="absolute inset-x-0 top-[44%] flex select-none justify-center opacity-[0.12]"
          >
            <span class="text-[13vw] font-black tracking-[-0.05em] text-slate-900">
              ALPINE LIGHT
            </span>
          </div>
        }

        @case ('tokyo') {
          <!-- Tokyo 2099: Deep indigo with vivid neon vertical signs & bokeh orbs -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-[#090418] via-[#13082a] to-[#070b1a]"
          ></div>
          <div
            class="animate-lg-float absolute left-[8%] top-[10%] h-[34rem] w-24 rounded-full bg-gradient-to-b from-rose-500 via-fuchsia-500 to-transparent opacity-80 blur-xl"
          ></div>
          <div
            class="animate-lg-float-reverse absolute left-[28%] top-[5%] h-[38rem] w-16 rounded-full bg-gradient-to-b from-cyan-400 via-sky-500 to-transparent opacity-85 blur-lg"
          ></div>
          <div
            class="animate-lg-float absolute right-[24%] top-[12%] h-[36rem] w-20 rounded-full bg-gradient-to-b from-amber-400 via-orange-500 to-transparent opacity-80 blur-xl"
          ></div>
          <div
            class="animate-lg-float-reverse absolute right-[8%] top-[8%] h-[32rem] w-24 rounded-full bg-gradient-to-b from-violet-500 via-pink-500 to-transparent opacity-80 blur-xl"
          ></div>

          <!-- Sharp neon bokeh discs -->
          <div
            class="absolute left-[18%] top-[62%] h-32 w-32 rounded-full bg-rose-500/80 shadow-[0_0_70px_rgba(244,63,94,0.85)]"
          ></div>
          <div
            class="absolute right-[16%] top-[56%] h-40 w-40 rounded-full bg-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.85)]"
          ></div>
          <div
            class="absolute left-[46%] top-[24%] h-28 w-28 rounded-full bg-amber-300/85 shadow-[0_0_65px_rgba(252,211,77,0.85)]"
          ></div>

          <div
            class="absolute inset-0 opacity-20"
            style="background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 28px);"
          ></div>
        }

        @case ('coral') {
          <!-- Bioluminescent Coral Reef -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-[#021c1e] via-[#042f36] to-[#1a0b24]"
          ></div>
          <div
            class="animate-lg-float absolute left-[-8%] top-[6%] h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-teal-400/75 via-emerald-300/45 to-transparent blur-3xl"
          ></div>
          <div
            class="animate-lg-float-reverse absolute right-[-10%] bottom-[-8%] h-[44rem] w-[44rem] rounded-full bg-gradient-to-tl from-rose-500/75 via-orange-400/55 to-amber-200/30 blur-3xl"
          ></div>
          <div
            class="absolute left-[38%] top-[18%] h-48 w-48 rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-fuchsia-500 shadow-[0_0_95px_rgba(251,113,133,0.7)]"
          ></div>
          <div
            class="absolute bottom-[18%] left-[18%] h-44 w-44 rounded-full bg-gradient-to-tr from-cyan-300 via-teal-400 to-emerald-300 shadow-[0_0_85px_rgba(45,212,191,0.75)]"
          ></div>
          <div
            class="absolute inset-x-0 bottom-[28%] flex select-none justify-center opacity-[0.14]"
          >
            <span class="text-[13vw] font-black tracking-tight text-teal-100">
              BIOLUMINA
            </span>
          </div>
        }

        @case ('taxi-night') {
          <!-- Taxi Nocturno: Deep urban asphalt, glowing amber route map, headlights & subtle checkered band -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-[#07080d] via-[#11131b] to-[#1a1508]"
          ></div>

          <!-- Warm taxi amber & headlight ambient glows -->
          <div
            class="animate-lg-float absolute -left-24 top-[6%] h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-yellow-400/55 via-amber-500/35 to-transparent blur-3xl"
          ></div>
          <div
            class="animate-lg-float-reverse absolute -right-24 bottom-[4%] h-[38rem] w-[38rem] rounded-full bg-gradient-to-tl from-amber-400/50 via-yellow-500/30 to-transparent blur-3xl"
          ></div>
          <div
            class="animate-lg-float absolute right-[18%] top-[14%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-rose-500/35 via-orange-500/25 to-transparent blur-3xl"
          ></div>

          <!-- Urban street map grid -->
          <div
            class="absolute inset-0 opacity-25"
            style="background-image: linear-gradient(rgba(250,204,21,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.18) 1px, transparent 1px); background-size: 64px 64px;"
          ></div>

          <!-- Glowing GPS Taxi Route SVG -->
          <svg
            class="absolute inset-0 h-full w-full opacity-75"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <!-- Secondary avenues -->
            <path
              d="M -60 220 L 420 220 L 540 340 L 1100 340 L 1480 260"
              stroke="rgba(255,255,255,0.12)"
              stroke-width="3"
            />
            <path
              d="M 240 -40 L 240 480 L 460 700 L 460 940"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="3"
            />
            <path
              d="M 980 -40 L 980 520 L 1220 760 L 1220 940"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="3"
            />

            <!-- Active Taxi Golden Route Glow -->
            <path
              d="M 110 740 L 340 520 L 660 520 L 820 340 L 1160 340 L 1310 190"
              stroke="rgba(250,204,21,0.32)"
              stroke-width="18"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M 110 740 L 340 520 L 660 520 L 820 340 L 1160 340 L 1310 190"
              stroke="#facc15"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-dasharray="14 10"
            />

            <!-- Origin & Destination Beacons -->
            <circle cx="340" cy="520" r="22" fill="rgba(250,204,21,0.22)" />
            <circle cx="340" cy="520" r="9" fill="#facc15" />
            <circle cx="1160" cy="340" r="26" fill="rgba(251,146,60,0.24)" />
            <circle cx="1160" cy="340" r="10" fill="#fb923c" />
          </svg>

          <!-- Subtle iconic Taxi Checker band (looks awesome when refracted under glass) -->
          <div
            class="absolute -left-10 bottom-[16%] h-9 w-[120%] -rotate-2 opacity-35"
            style="background-image: repeating-conic-gradient(#facc15 0% 25%, #090b10 0% 50%); background-size: 24px 24px;"
          ></div>

          <!-- Sharp urban traffic bokeh lights -->
          <div
            class="absolute left-[14%] top-[20%] h-32 w-32 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-white shadow-[0_0_95px_rgba(250,204,21,0.85)]"
          ></div>
          <div
            class="absolute right-[12%] bottom-[24%] h-24 w-24 rounded-full bg-gradient-to-tr from-rose-500 via-red-400 to-amber-200 shadow-[0_0_75px_rgba(244,63,94,0.7)]"
          ></div>

          <div
            class="absolute inset-x-0 top-[42%] flex select-none justify-center opacity-[0.12]"
          >
            <span class="text-[13vw] font-black tracking-[-0.04em] text-yellow-300">
              TAXI · 24/7
            </span>
          </div>
        }
      }
    </div>
  `,
})
export class SceneBackdropComponent {
  protected readonly glass = inject(LiquidGlassService);

  protected readonly luminanceFilter = computed(() => {
    const lum = this.glass.sceneLuminance();
    const brightness = 0.55 + (lum / 100) * 0.5;
    return `brightness(${brightness.toFixed(2)})`;
  });
}
