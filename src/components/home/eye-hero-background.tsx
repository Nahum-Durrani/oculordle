/**
 * Side-profile eye cross-section for the home hero: a fluorescein dye
 * sweep travels the central retinal artery into the optic nerve, then
 * fans out through a retinal vessel network on the back wall. Pure
 * CSS/SVG (stroke-dash reveal + an `offset-path` particle) — no
 * canvas, no rAF loop, so it can't fall prey to the tab-visibility
 * throttling that a rAF-driven animation hits under automation/testing.
 * Class names are `eyehero-*`-scoped so they can't collide globally.
 */
export function EyeHeroBackground() {
  return (
    <>
      <style>{CSS}</style>
      <svg className="eyehero-bg" viewBox="0 0 1100 700" aria-hidden="true">
        <defs>
          <linearGradient id="eyeheroDyeGradient" x1="1" y1=".5" x2="0" y2=".4">
            <stop stopColor="#edffd2" />
            <stop offset=".42" stopColor="#baff8e" />
            <stop offset="1" stopColor="#6ef19a" />
          </linearGradient>
          <radialGradient id="eyeheroHaze">
            <stop offset="0" stopColor="#a6dcff" stopOpacity=".075" />
            <stop offset=".72" stopColor="#a6dcff" stopOpacity=".016" />
            <stop offset="1" stopColor="#a6dcff" stopOpacity="0" />
          </radialGradient>
          <filter id="eyeheroGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="eyeheroHotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="eyeheroClip">
            <path d="M236 345 C236 180 362 86 566 91 C759 96 851 204 850 347 C849 502 741 607 559 609 C364 612 240 510 236 345Z" />
          </clipPath>
        </defs>

        <g className="eyehero-drift">
          <ellipse cx="555" cy="352" rx="430" ry="320" fill="url(#eyeheroHaze)" />

          {/* Cross-section outline: cornea at left, retina at back, optic nerve at right. */}
          <path
            className="eyehero-anatomy eyehero-anatomy-soft"
            strokeWidth="2"
            d="M236 345 C236 180 362 86 566 91 C759 96 851 204 850 347 C849 502 741 607 559 609 C364 612 240 510 236 345Z"
          />
          <path
            className="eyehero-anatomy"
            strokeWidth="6"
            d="M245 250 C198 272 178 313 178 350 C178 391 201 429 247 448"
          />
          <path
            className="eyehero-anatomy"
            strokeWidth="3"
            d="M247 250 C275 281 284 315 284 350 C284 386 273 419 247 448"
          />
          <ellipse className="eyehero-anatomy" cx="329" cy="350" rx="42" ry="91" strokeWidth="4" />
          <path className="eyehero-anatomy" strokeWidth="3" d="M287 350 H242 M372 350 C473 319 603 316 772 330" />
          <circle cx="409" cy="350" r="17" fill="rgba(255,255,255,.06)" />
          <path
            className="eyehero-anatomy"
            strokeWidth="3"
            d="M826 294 C876 319 922 343 1038 361 M824 397 C882 390 940 381 1038 379"
          />
          <path className="eyehero-anatomy" strokeWidth="10" d="M850 340 C916 345 972 362 1038 370" />
          <path
            className="eyehero-anatomy"
            strokeWidth="3"
            d="M781 178 C825 238 849 298 850 347 C849 415 824 473 779 522"
          />
          <path
            className="eyehero-anatomy"
            strokeWidth="2"
            d="M760 188 C802 246 824 299 825 348 C824 409 802 461 760 511"
          />

          {/* Dye approaches through the central retinal artery in the optic nerve. */}
          <path
            className="eyehero-vessel-base"
            strokeWidth="8"
            d="M1036 378 C965 369 918 356 868 335 C830 319 807 318 777 328"
          />
          <path
            className="eyehero-dye-route"
            pathLength="1"
            strokeWidth="6"
            d="M1036 378 C965 369 918 356 868 335 C830 319 807 318 777 328"
          />
          <circle className="eyehero-dye-drop" r="7" fill="#efffcf" />

          {/* Logo-like retinal vessel network, drawn on the back/inside wall. */}
          <g clipPath="url(#eyeheroClip)">
            <g className="eyehero-vessel-base">
              <path strokeWidth="8" d="M777 328 C748 300 719 263 690 212 C664 166 630 133 587 105" />
              <path strokeWidth="5" d="M723 268 C675 258 626 259 565 274 C512 287 469 286 422 270" />
              <path
                strokeWidth="3"
                d="M651 257 C622 223 607 187 605 144 M565 274 C530 245 506 214 493 177"
              />
              <path
                strokeWidth="2"
                d="M501 279 C465 304 437 326 405 350 M422 270 C385 257 350 251 310 252"
              />
              <path strokeWidth="8" d="M777 328 C739 351 704 390 671 443 C642 489 608 535 561 591" />
              <path
                strokeWidth="5"
                d="M716 382 C671 380 622 370 562 350 C509 333 466 336 415 358"
              />
              <path
                strokeWidth="3"
                d="M650 398 C618 432 598 469 590 514 M562 350 C531 389 506 420 468 445"
              />
              <path
                strokeWidth="2"
                d="M501 339 C462 317 428 298 385 290 M415 358 C379 375 347 396 316 425"
              />
              <path strokeWidth="6" d="M777 328 C755 269 746 219 752 161" />
              <path strokeWidth="4" d="M754 231 C715 207 684 179 658 143" />
              <path strokeWidth="6" d="M777 328 C761 403 758 476 768 548" />
              <path strokeWidth="4" d="M762 442 C719 470 689 501 668 541" />
            </g>

            <g>
              <path
                className="eyehero-dye-vessel"
                pathLength="1"
                strokeWidth="6"
                d="M777 328 C748 300 719 263 690 212 C664 166 630 133 587 105"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-1"
                pathLength="1"
                strokeWidth="4"
                d="M723 268 C675 258 626 259 565 274 C512 287 469 286 422 270"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-3"
                pathLength="1"
                strokeWidth="2.5"
                d="M651 257 C622 223 607 187 605 144 M565 274 C530 245 506 214 493 177 M501 279 C465 304 437 326 405 350"
              />
              <path
                className="eyehero-dye-vessel"
                pathLength="1"
                strokeWidth="6"
                d="M777 328 C739 351 704 390 671 443 C642 489 608 535 561 591"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-2"
                pathLength="1"
                strokeWidth="4"
                d="M716 382 C671 380 622 370 562 350 C509 333 466 336 415 358"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-4"
                pathLength="1"
                strokeWidth="2.5"
                d="M650 398 C618 432 598 469 590 514 M562 350 C531 389 506 420 468 445 M415 358 C379 375 347 396 316 425"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-1"
                pathLength="1"
                strokeWidth="4.5"
                d="M777 328 C755 269 746 219 752 161 M754 231 C715 207 684 179 658 143"
              />
              <path
                className="eyehero-dye-vessel eyehero-branch-2"
                pathLength="1"
                strokeWidth="4.5"
                d="M777 328 C761 403 758 476 768 548 M762 442 C719 470 689 501 668 541"
              />
            </g>
          </g>

          <g className="eyehero-optic-pulse">
            <circle cx="777" cy="328" r="28" fill="#c9ff9d" opacity=".16" filter="url(#eyeheroHotGlow)" />
            <circle cx="777" cy="328" r="9" fill="#efffce" opacity=".7" />
          </g>
        </g>
      </svg>
    </>
  );
}

const CSS = `
.eyehero-bg {
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 50%;
  width: min(1120px, 96vw);
  transform: translate(-50%, -51%);
  pointer-events: none;
  opacity: .78;
}
.eyehero-drift { transform-origin: 550px 350px; animation: eyehero-breathe 7s ease-in-out infinite; }
.eyehero-anatomy {
  fill: none;
  stroke: #fff;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: .12;
}
.eyehero-anatomy-soft { fill: rgba(255,255,255,.015); stroke: rgba(255,255,255,.08); }
.eyehero-vessel-base {
  fill: none;
  stroke: #eaf6ff;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: .13;
}
.eyehero-dye-route, .eyehero-dye-vessel {
  fill: none;
  stroke: url(#eyeheroDyeGradient);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  filter: url(#eyeheroGlow);
}
.eyehero-dye-route { animation: eyehero-dye-enter 9s cubic-bezier(.42, 0, .2, 1) infinite; }
.eyehero-dye-vessel { animation: eyehero-vessel-fill 9s cubic-bezier(.3, 0, .2, 1) infinite; }
.eyehero-branch-1 { animation-delay: .25s; }
.eyehero-branch-2 { animation-delay: .55s; }
.eyehero-branch-3 { animation-delay: .85s; }
.eyehero-branch-4 { animation-delay: 1.15s; }
.eyehero-dye-drop {
  offset-path: path("M1036 378 C965 369 918 356 868 335 C830 319 807 318 777 328");
  filter: url(#eyeheroHotGlow);
  animation: eyehero-dye-particle 9s ease-in-out infinite;
}
.eyehero-optic-pulse { transform-origin: 775px 328px; animation: eyehero-optic-pulse-kf 9s ease-in-out infinite; }

@keyframes eyehero-dye-enter {
  0%, 8% { stroke-dashoffset: 1; opacity: 0; }
  14% { opacity: .7; }
  34%, 74% { stroke-dashoffset: 0; opacity: .7; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes eyehero-vessel-fill {
  0%, 26% { stroke-dashoffset: 1; opacity: 0; }
  33% { opacity: .2; }
  65%, 78% { stroke-dashoffset: 0; opacity: .55; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes eyehero-dye-particle {
  0%, 9% { offset-distance: 0%; opacity: 0; }
  15% { opacity: 1; }
  33% { offset-distance: 100%; opacity: .9; }
  40%, 100% { offset-distance: 100%; opacity: 0; }
}
@keyframes eyehero-optic-pulse-kf {
  0%, 26%, 100% { transform: scale(.7); opacity: 0; }
  36% { transform: scale(1.12); opacity: .85; }
  46%, 76% { transform: scale(1); opacity: .55; }
}
@keyframes eyehero-breathe {
  0%, 100% { transform: scale(.99); opacity: .88; }
  50% { transform: scale(1.01); opacity: 1; }
}

@media (max-width: 650px) {
  .eyehero-bg { width: 145vw; transform: translate(-50%, -52%); opacity: .64; }
}
@media (prefers-reduced-motion: reduce) {
  .eyehero-drift, .eyehero-dye-route, .eyehero-dye-vessel, .eyehero-dye-drop, .eyehero-optic-pulse {
    animation: none !important;
  }
  .eyehero-dye-route, .eyehero-dye-vessel { stroke-dashoffset: 0; opacity: .28; }
  .eyehero-dye-drop { opacity: 0; }
  .eyehero-optic-pulse { opacity: .25; }
}
`;
