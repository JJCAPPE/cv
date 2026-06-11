export function MotionSignal() {
  return (
    <figure
      className="motion-signal"
      tabIndex={0}
      aria-labelledby="motion-signal-title"
      aria-describedby="motion-signal-description"
    >
      <figcaption className="motion-signal__caption">
        <span id="motion-signal-title">motion → signal</span>
        <span id="motion-signal-description">
          illustrative biomechanics pass
        </span>
      </figcaption>

      <svg
        className="motion-signal__graphic motion-signal__graphic--desktop"
        viewBox="0 0 720 250"
        role="img"
        aria-label="A rowing pose sequence is converted into kinematic features and a force curve."
      >
        <defs>
          <pattern
            id="signal-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 20 0 L 0 0 0 20" className="motion-signal__grid" />
          </pattern>
        </defs>

        <rect
          x="16"
          y="34"
          width="688"
          height="182"
          fill="url(#signal-grid)"
          className="motion-signal__field"
        />

        <g className="motion-signal__label">
          <text x="24" y="22">
            01 / capture
          </text>
          <text x="319" y="22">
            02 / infer
          </text>
          <text x="470" y="22">
            03 / model
          </text>
        </g>

        <g className="motion-signal__frame">
          <path d="M28 64V46H46 M258 46H276V64 M28 188V206H46 M258 206H276V188" />
          <line x1="48" y1="181" x2="258" y2="181" />
          <line x1="238" y1="157" x2="250" y2="181" />
          <rect x="143" y="158" width="23" height="7" />
        </g>

        <g className="motion-signal__pose motion-signal__pose--catch motion-signal__animated">
          <circle cx="116" cy="75" r="9" />
          <path d="M120 85L134 105L151 148L198 151L242 178" />
          <path d="M133 104L171 112L226 109" />
          <g className="motion-signal__keypoints">
            <circle cx="133" cy="104" r="2.7" />
            <circle cx="151" cy="148" r="2.7" />
            <circle cx="198" cy="151" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="171" cy="112" r="2.7" />
            <circle cx="226" cy="109" r="2.7" />
          </g>
        </g>

        <g className="motion-signal__pose motion-signal__pose--drive motion-signal__animated">
          <circle cx="139" cy="72" r="9" />
          <path d="M141 82L145 104L153 148L186 151L242 178" />
          <path d="M145 104L170 113L203 111" />
          <g className="motion-signal__keypoints">
            <circle cx="145" cy="104" r="2.7" />
            <circle cx="153" cy="148" r="2.7" />
            <circle cx="186" cy="151" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="170" cy="113" r="2.7" />
            <circle cx="203" cy="111" r="2.7" />
          </g>
        </g>

        <g className="motion-signal__pose motion-signal__pose--finish motion-signal__animated">
          <circle cx="169" cy="73" r="9" />
          <path d="M165 83L156 105L151 148L174 152L242 178" />
          <path d="M156 105L164 116L179 116" />
          <g className="motion-signal__keypoints">
            <circle cx="156" cy="105" r="2.7" />
            <circle cx="151" cy="148" r="2.7" />
            <circle cx="174" cy="152" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="164" cy="116" r="2.7" />
            <circle cx="179" cy="116" r="2.7" />
          </g>
        </g>

        <line
          x1="37"
          y1="50"
          x2="37"
          y2="201"
          className="motion-signal__scan motion-signal__animated"
        />

        <g className="motion-signal__pipeline">
          <line x1="293" y1="126" x2="309" y2="126" />
          <path d="M304 121L309 126L304 131" />

          <rect x="319" y="52" width="112" height="39" />
          <rect x="319" y="106" width="112" height="39" />
          <rect x="319" y="160" width="112" height="39" />
          <text x="333" y="76">
            2D keypoints
          </text>
          <text x="333" y="130">
            3D kinematics
          </text>
          <text x="333" y="184">
            stroke phase
          </text>

          <line x1="333" y1="91" x2="333" y2="106" />
          <line x1="333" y1="145" x2="333" y2="160" />
          <circle
            cx="419"
            cy="71"
            r="3"
            className="motion-signal__node motion-signal__node--one motion-signal__animated"
          />
          <circle
            cx="419"
            cy="125"
            r="3"
            className="motion-signal__node motion-signal__node--two motion-signal__animated"
          />
          <circle
            cx="419"
            cy="179"
            r="3"
            className="motion-signal__node motion-signal__node--three motion-signal__animated"
          />

          <line x1="441" y1="126" x2="457" y2="126" />
          <path d="M452 121L457 126L452 131" />
        </g>

        <g className="motion-signal__chart">
          <line x1="478" y1="190" x2="690" y2="190" />
          <line x1="478" y1="54" x2="478" y2="190" />
          <line x1="478" y1="145" x2="690" y2="145" />
          <line x1="478" y1="99" x2="690" y2="99" />
          <path
            d="M478 187C500 184 510 144 527 107C544 69 574 63 599 79C625 96 632 135 653 161C665 176 678 184 690 187"
            className="motion-signal__curve motion-signal__animated"
          />
          <line
            x1="478"
            y1="54"
            x2="478"
            y2="190"
            className="motion-signal__cursor motion-signal__animated"
          />
          <circle
            cx="599"
            cy="79"
            r="4"
            className="motion-signal__peak motion-signal__animated"
          />
          <text x="486" y="69">
            force
          </text>
          <text x="651" y="207">
            time
          </text>
        </g>

        <g className="motion-signal__footer-label">
          <text x="24" y="236">
            pose sequence
          </text>
          <text x="319" y="236">
            motion features
          </text>
          <text x="603" y="236">
            output
          </text>
        </g>
      </svg>

      <svg
        className="motion-signal__graphic motion-signal__graphic--mobile"
        viewBox="0 0 350 350"
        role="img"
        aria-label="A rowing pose sequence becomes kinematic features and a force curve."
      >
        <defs>
          <pattern
            id="signal-grid-mobile"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 18 0 L 0 0 0 18" className="motion-signal__grid" />
          </pattern>
        </defs>

        <rect
          x="8"
          y="28"
          width="334"
          height="306"
          fill="url(#signal-grid-mobile)"
          className="motion-signal__field"
        />

        <g className="motion-signal__label">
          <text x="14" y="18">
            01 / capture
          </text>
          <text x="190" y="18">
            02 / infer
          </text>
          <text x="14" y="194">
            03 / model
          </text>
        </g>

        <g className="motion-signal__frame">
          <path d="M18 54V38H34 M146 38H162V54 M18 142V158H34 M146 158H162V142" />
          <line x1="32" y1="143" x2="151" y2="143" />
          <line x1="139" y1="128" x2="147" y2="143" />
          <rect x="83" y="128" width="18" height="6" />
        </g>

        <g
          className="motion-signal__pose motion-signal__pose--catch motion-signal__animated"
          transform="translate(-38 -4) scale(.73)"
        >
          <circle cx="116" cy="75" r="9" />
          <path d="M120 85L134 105L151 148L198 151L242 178" />
          <path d="M133 104L171 112L226 109" />
          <g className="motion-signal__keypoints">
            <circle cx="133" cy="104" r="2.7" />
            <circle cx="151" cy="148" r="2.7" />
            <circle cx="198" cy="151" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="171" cy="112" r="2.7" />
            <circle cx="226" cy="109" r="2.7" />
          </g>
        </g>

        <g
          className="motion-signal__pose motion-signal__pose--drive motion-signal__animated"
          transform="translate(-38 -4) scale(.73)"
        >
          <circle cx="139" cy="72" r="9" />
          <path d="M141 82L145 104L153 148L186 151L242 178" />
          <path d="M145 104L170 113L203 111" />
          <g className="motion-signal__keypoints">
            <circle cx="145" cy="104" r="2.7" />
            <circle cx="153" cy="148" r="2.7" />
            <circle cx="186" cy="151" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="170" cy="113" r="2.7" />
            <circle cx="203" cy="111" r="2.7" />
          </g>
        </g>

        <g
          className="motion-signal__pose motion-signal__pose--finish motion-signal__animated"
          transform="translate(-38 -4) scale(.73)"
        >
          <circle cx="169" cy="73" r="9" />
          <path d="M165 83L156 105L151 148L174 152L242 178" />
          <path d="M156 105L164 116L179 116" />
          <g className="motion-signal__keypoints">
            <circle cx="156" cy="105" r="2.7" />
            <circle cx="151" cy="148" r="2.7" />
            <circle cx="174" cy="152" r="2.7" />
            <circle cx="242" cy="178" r="2.7" />
            <circle cx="164" cy="116" r="2.7" />
            <circle cx="179" cy="116" r="2.7" />
          </g>
        </g>

        <line
          x1="24"
          y1="42"
          x2="24"
          y2="154"
          className="motion-signal__scan motion-signal__scan--mobile motion-signal__animated"
        />

        <g className="motion-signal__pipeline">
          <rect x="190" y="39" width="137" height="31" />
          <rect x="190" y="84" width="137" height="31" />
          <rect x="190" y="129" width="137" height="31" />
          <text x="202" y="59">
            2D keypoints
          </text>
          <text x="202" y="104">
            3D kinematics
          </text>
          <text x="202" y="149">
            stroke phase
          </text>
          <line x1="202" y1="70" x2="202" y2="84" />
          <line x1="202" y1="115" x2="202" y2="129" />
          <circle
            cx="316"
            cy="54"
            r="3"
            className="motion-signal__node motion-signal__node--one motion-signal__animated"
          />
          <circle
            cx="316"
            cy="99"
            r="3"
            className="motion-signal__node motion-signal__node--two motion-signal__animated"
          />
          <circle
            cx="316"
            cy="144"
            r="3"
            className="motion-signal__node motion-signal__node--three motion-signal__animated"
          />
        </g>

        <g className="motion-signal__chart">
          <line x1="24" y1="315" x2="326" y2="315" />
          <line x1="24" y1="211" x2="24" y2="315" />
          <line x1="24" y1="280" x2="326" y2="280" />
          <line x1="24" y1="245" x2="326" y2="245" />
          <path
            d="M24 312C54 310 70 281 92 250C115 218 153 216 184 229C219 244 236 270 263 292C285 309 306 313 326 312"
            className="motion-signal__curve motion-signal__animated"
          />
          <line
            x1="24"
            y1="211"
            x2="24"
            y2="315"
            className="motion-signal__cursor motion-signal__cursor--mobile motion-signal__animated"
          />
          <circle
            cx="153"
            cy="216"
            r="4"
            className="motion-signal__peak motion-signal__animated"
          />
          <text x="32" y="226">
            force
          </text>
          <text x="288" y="328">
            time
          </text>
        </g>
      </svg>
    </figure>
  );
}
