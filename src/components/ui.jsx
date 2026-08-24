import { useEffect, useRef, useState, } from "react";
import { Link } from "react-router-dom";
/* ------------------------------- icons ------------------------------- */
function icon(children) {
    return function Icon({ className = "h-5 w-5" }) {
        return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {children}
      </svg>);
    };
}
export const SearchIc = icon(<>
    <circle cx="11" cy="11" r="7"/>
    <path d="m20.5 20.5-4-4"/>
  </>);
export const UserIc = icon(<>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
  </>);
export const BagIc = icon(<>
    <path d="M6 8h12l-1 13H7L6 8Z"/>
    <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
  </>);
export const XIcon = icon(<path d="M6 6l12 12M18 6 6 18"/>);
export const MinusIc = icon(<path d="M5 12h14"/>);
export const PlusIc = icon(<path d="M12 5v14M5 12h14"/>);
export const ChevronIc = icon(<path d="m6 9 6 6 6-6"/>);
export const ArrowLIc = icon(<path d="M15 5l-7 7 7 7"/>);
export const ArrowRIc = icon(<path d="m9 5 7 7-7 7"/>);
export const CheckIc = icon(<path d="m4 12.5 5 5L20 6.5"/>);
export const EyeIc = icon(<>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"/>
    <circle cx="12" cy="12" r="2.8"/>
  </>);
export const TruckIc = icon(<>
    <path d="M2 7h12v9H2z"/>
    <path d="M14 10h4l3 3v3h-7"/>
    <circle cx="6" cy="18" r="1.8"/>
    <circle cx="17.5" cy="18" r="1.8"/>
  </>);
export const ShieldIc = icon(<path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.3 7.5 10 4.3-1.7 7.5-5 7.5-10v-6L12 2.5Z"/>);
export const BoxIc = icon(<>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/>
    <path d="m3 8 9 5 9-5"/>
    <path d="M12 13v8"/>
  </>);
export const HeadsetIc = icon(<>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2"/>
    <rect x="3" y="14" width="4" height="6" rx="1.5"/>
    <rect x="17" y="14" width="4" height="6" rx="1.5"/>
  </>);
export const LockIc = icon(<>
    <rect x="5" y="11" width="14" height="9" rx="2"/>
    <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </>);
export const CardIc = icon(<>
    <rect x="2.5" y="5" width="19" height="14" rx="2"/>
    <path d="M2.5 10h19"/>
  </>);
export const MailIc = icon(<>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="m3 7 9 6 9-6"/>
  </>);
export const GridIc = icon(<>
    <rect x="4" y="4" width="7" height="7"/>
    <rect x="13" y="4" width="7" height="7"/>
    <rect x="4" y="13" width="7" height="7"/>
    <rect x="13" y="13" width="7" height="7"/>
  </>);
export const ListIc = icon(<path d="M4 6h16M4 12h16M4 18h16"/>);
export const ShareIc = icon(<>
    <circle cx="6" cy="12" r="2.5"/>
    <circle cx="18" cy="6" r="2.5"/>
    <circle cx="18" cy="18" r="2.5"/>
    <path d="m8.3 10.8 7.4-3.6M8.3 13.2l7.4 3.6"/>
  </>);
export const HelpIc = icon(<>
    <circle cx="12" cy="12" r="9"/>
    <path d="M9.5 9.2a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 1.9"/>
    <path d="M12 17h.01"/>
  </>);
export const CompareIc = icon(<>
    <path d="M8 3 4 7l4 4"/>
    <path d="M4 7h16"/>
    <path d="m16 21 4-4-4-4"/>
    <path d="M20 17H4"/>
  </>);
export const ReturnIc = icon(<>
    <path d="M9 14 4 9l5-5"/>
    <path d="M4 9h10a6 6 0 0 1 0 12h-3"/>
  </>);
export const TagIc = icon(<>
    <path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/>
    <circle cx="7" cy="7" r="1.5"/>
  </>);
export function StarIc({ className = "h-4 w-4", filled = true, }) {
    return (<svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>
    </svg>);
}
export const GoogleG = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.8-.2-2.6H12v4.9h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-9Z"/>
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8H1.2v3.1A12 12 0 0 0 12 24Z"/>
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2a12 12 0 0 0 0 10.8l4.1-3.1Z"/>
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8L20.1 3A12 12 0 0 0 1.2 6.6l4.1 3.1A7.2 7.2 0 0 1 12 4.8Z"/>
  </svg>);
export const MailM = () => (<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="#EA4335" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/>
  </svg>);
/* ------------------------------- stars ------------------------------- */
export function Stars({ n, className = "h-3.5 w-3.5", count, }) {
    return (<span className="inline-flex items-center gap-0.5 text-[#e8a33d]">
      {[1, 2, 3, 4, 5].map((i) => (<StarIc key={i} className={`${className} ${i <= n ? "" : "text-gray-300"}`} filled={i <= n}/>))}
      {count !== undefined && (<span className="ml-1 text-xs font-normal text-mute">({count})</span>)}
    </span>);
}
/* ------------------------------- reveal ------------------------------- */
export function Reveal({ children, delay = 0, className = "", }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVis(true);
            return;
        }
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVis(true);
                io.disconnect();
            }
        }, { threshold: 0.12 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (<div ref={ref} className={`reveal-base ${vis ? "reveal-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>);
}
/* ------------------------------ countdown ------------------------------ */
export function Countdown({ seconds = 2 * 86400 + 8 * 3600 + 5 * 60 + 30, boxed = true, className = "", }) {
    const [left, setLeft] = useState(seconds * 1000);
    useEffect(() => {
        const iv = window.setInterval(() => setLeft((l) => (l > 100 ? l - 100 : 0)), 100);
        return () => window.clearInterval(iv);
    }, []);
    const s = Math.ceil(left / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const cs = Math.floor((left % 1000) / 10);
    const pad = (x) => String(x).padStart(2, "0");
    if (!boxed)
        return (<span className={`tick inline-flex items-center gap-1 font-medium text-pop ${className}`}>
        {pad(h)}
        <span>:</span>
        {pad(m)}
        <span>:</span>
        {pad(sec)}
        <span>:</span>
        {pad(cs)}
      </span>);
    const cells = [
        [d, "Days"],
        [h, "Hr"],
        [m, "Mins"],
        [sec, "Sec"],
    ];
    return (<div className={`flex gap-2.5 ${className}`}>
      {cells.map(([v, l]) => (<div key={l} className="flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-white font-serif text-xl">
            {pad(v)}
          </span>
          <span className="mt-1.5 text-[10px] uppercase tracking-widest text-mute">
            {l}
          </span>
        </div>))}
    </div>);
}
/* ------------------------------- qty ------------------------------- */
export function Qty({ value, onChange, small = false, }) {
    return (<div className={`inline-flex items-center rounded-lg border border-line ${small ? "h-9" : "h-12"}`}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="px-3.5 text-lg leading-none text-mute transition-colors hover:text-ink" aria-label="decrease">
        −
      </button>
      <span className={`w-8 text-center tabular-nums ${small ? "text-sm" : "text-base"}`}>
        {String(value).padStart(2, "0")}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} className="px-3.5 text-lg leading-none text-mute transition-colors hover:text-ink" aria-label="increase">
        +
      </button>
    </div>);
}
/* ----------------------------- breadcrumbs ----------------------------- */
export function Crumbs({ items }) {
    return (<div className="mt-3 flex items-center justify-center gap-2 text-xs text-mute">
      {items.map(([label, to], i) => (<span key={label} className="flex items-center gap-2">
          {i > 0 && <span className="text-[10px]">›</span>}
          {to ? (<Link to={to} className="transition-colors hover:text-ink">
              {label}
            </Link>) : (<span className="text-ink/70">{label}</span>)}
        </span>))}
    </div>);
}
/* ------------------------------ section head ------------------------------ */
export function SectionHead({ title, sub, className = "", }) {
    return (<div className={`text-center ${className}`}>
      <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
      {sub && (<p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
          {sub}
        </p>)}
    </div>);
}
