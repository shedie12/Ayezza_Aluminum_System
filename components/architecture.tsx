export function Architecture() {
  return <svg className="architecture" viewBox="0 0 1000 790" role="img" aria-label="Architectural illustration of a modern home with black aluminum framed floor-to-ceiling windows">
    <defs>
      <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#c7d5cd"/><stop offset="1" stopColor="#eef0e2"/></linearGradient>
      <linearGradient id="wall" x2="1" y2="1"><stop stopColor="#ece8dc"/><stop offset="1" stopColor="#c5c2b5"/></linearGradient>
      <linearGradient id="glass" x2="1" y2="1"><stop stopColor="#253f39"/><stop offset=".5" stopColor="#6a8272"/><stop offset="1" stopColor="#c4c6aa"/></linearGradient>
      <linearGradient id="ground" x2="0" y2="1"><stop stopColor="#abaf92"/><stop offset="1" stopColor="#64775b"/></linearGradient>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
    </defs>
    <g filter="url(#grain)"><path fill="url(#sky)" d="M0 0h1000v790H0z"/><circle cx="770" cy="138" r="92" fill="#f4edd4" opacity=".6"/>
      <path d="M0 425Q120 230 250 423T500 398T800 370T1000 350V790H0Z" fill="#758c6b"/><path d="M0 535Q220 440 510 529T1000 470V790H0Z" fill="url(#ground)"/>
      <path d="M126 691L513 584L1000 635V790H379Z" fill="#d9d7c7"/>
      <path d="M122 256L724 196L916 286L318 361Z" fill="#f1eee4"/><path d="M122 256L318 361V646L122 534Z" fill="#c4c3b3"/>
      <path d="M318 361L916 286V574L318 646Z" fill="url(#wall)"/>
      <path d="M353 376L874 312V566L353 627Z" fill="url(#glass)"/>
      <path d="M370 584L849 530V550L370 606Z" fill="#b9aa8d"/><path d="M542 489L744 465V537L542 559Z" fill="#d9d0b3"/>
      <path d="M561 474L720 456L744 465L542 489Z" fill="#ebe2c8"/><path d="M583 548v29m137-45v29" stroke="#4b493d" strokeWidth="6"/>
      <path d="M395 612V373m95 227V362m102 226V349m103 227V335m105 227V322" stroke="#263d36" strokeWidth="10"/>
      <path d="M353 451L874 387M353 376L874 312V566L353 627Z" fill="none" stroke="#233c33" strokeWidth="12"/>
      <path d="M364 387L453 376L364 514ZM500 369L577 359L500 495ZM705 345L782 335L705 471Z" fill="#fff" opacity=".12"/>
      <path d="M100 248L315 349L937 272V301L315 379L100 277Z" fill="#eee9da"/><path d="M100 277L315 379V389L100 287Z" fill="#7a7e6e"/>
      <path d="M144 336L274 402V591L144 517Z" fill="#4b5948"/><path d="M157 355L256 407V567L157 512Z" fill="#82907a"/>
      <path d="M207 382V539" stroke="#2f4237" strokeWidth="8"/>
      <path d="M300 647L929 573L964 593L316 674Z" fill="#a8ac98"/><path d="M316 674L964 593V608L316 690Z" fill="#c1c3b0"/>
      <path d="M48 598Q60 447 83 331M65 466Q0 410 3 333M64 466Q123 402 157 396M78 380Q29 317 45 278" fill="none" stroke="#52664b" strokeWidth="12"/>
      <g fill="#68805c"><ellipse cx="35" cy="324" rx="63" ry="97" transform="rotate(-20 35 324)"/><ellipse cx="105" cy="367" rx="72" ry="79"/><ellipse cx="60" cy="235" rx="68" ry="109"/></g>
      <g fill="#4f694b"><ellipse cx="974" cy="539" rx="82" ry="57"/><ellipse cx="941" cy="576" rx="92" ry="44"/><ellipse cx="90" cy="616" rx="104" ry="41"/></g>
      <path d="M450 790L658 648L731 639L552 790Z" fill="#eeeadb" opacity=".7"/>
    </g>
  </svg>;
}
export function WindowDrawing({ type = "sliding-window", dark = false }: { type?: string; dark?: boolean }) {
  const door = type === "sliding-door";
  if (type === "awning") return <svg viewBox="0 0 260 210" className="window-drawing" role="img" aria-label="Awning concept">
    <path d="M35 65h175v95H35z" fill="#b6ccc5" stroke="currentColor" strokeWidth="6"/>
    <path d="M35 65h175l30 55H15z" fill="#d9dfcb" stroke="currentColor" strokeWidth="6"/>
    <path d="M80 65l-8 55m53-55v55m43-55l13 55M35 120v55m175-55v55" stroke="currentColor" strokeWidth="4"/>
  </svg>;
  if (type === "cabinet") return <svg viewBox="0 0 260 210" className="window-drawing" role="img" aria-label="Aluminum cabinet concept">
    <path d="M40 35h180v140H40z" fill="#d9dfcb" stroke="currentColor" strokeWidth="7"/>
    <path d="M130 38v134M42 70h176M52 178v15m156-15v15" stroke="currentColor" strokeWidth="5"/>
    <path d="M114 104v28m32-28v28M85 52h20m50 0h20" stroke="currentColor" strokeWidth="4"/>
  </svg>;
  return <svg viewBox="0 0 260 210" className={`window-drawing ${dark ? "dark" : ""}`} role="img" aria-label={type.replaceAll("-", " ")}>
    <path d="M37 188L231 169L249 181L55 202Z" fill="#aeb7aa" opacity=".3"/>
    <path d={door ? "M59 21h144v169H59z" : "M30 40h200v137H30z"} fill="#b6ccc5" stroke="currentColor" strokeWidth="7"/>
    <path d={door ? "M131 24v164" : "M130 43v131"} stroke="currentColor" strokeWidth="6"/>
    <path d="M42 52h70L42 131ZM143 52h70l-70 79Z" fill="#e9f1e9" opacity=".55"/>
    {type === "casement-window" && <path d="M39 49l82 20v79l-82 20Zm100 0l82 20v79l-82 20Z" fill="none" stroke="currentColor" strokeWidth="3"/>}
    {type === "glass-partition" && <path d="M96 43v131m68-131v131" stroke="currentColor" strokeWidth="4"/>}
    <path d="M119 105v19m23-19v19" stroke="currentColor" strokeWidth="3"/>
  </svg>;
}
