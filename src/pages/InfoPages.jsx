import { useState } from "react";
import { Link } from "react-router-dom";
import { NEWS_MAN, NEWS_WOMAN } from "../lib/data";
import { BoxIc, Crumbs, HeadsetIc, LockIc, Reveal, ReturnIc, ShieldIc, TagIc, TruckIc, ChevronIc, } from "../components/ui";
import { Newsletter } from "../components/Sections";
/* ------------------------------- about ------------------------------- */
const STATS = [
    { n: "120K+", l: "Happy Customers" },
    { n: "3.5K", l: "Products Shipped Weekly" },
    { n: "42", l: "Countries Served" },
    { n: "24/7", l: "Human Support" },
];
const VALUES = [
    {
        Icon: BoxIc,
        t: "Quality First",
        d: "Every fabric passes a 40-point check before it earns the FASCO label. If it wouldn't survive a season, it doesn't ship.",
    },
    {
        Icon: TagIc,
        t: "Fair Prices",
        d: "We buy directly from mills and cut out the middlemen. What you pay covers the garment, not the markup theatre.",
    },
    {
        Icon: ShieldIc,
        t: "Sustainable Fabrics",
        d: "Recycled polyesters, OEKO-TEX certified dyes, and repair guides with every order. Fashion shouldn't cost the planet.",
    },
];
export function About() {
    return (<div>
      <div className="py-14 text-center">
        <h1 className="font-serif text-4xl">About FASCO</h1>
        <Crumbs items={[["Home", "/"], ["About"]]}/>
      </div>

      <section className="mx-auto grid max-w-1280px items-center gap-12 px-5 pb-20 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-mute">Our Story</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Dress the confident, <em>not</em> the trend.
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-mute">
              FASCO started in 2019 in a tiny studio above a tailor's shop,
              with one rule: sell only what we'd actually wear ourselves. The
              first collection was twelve pieces. Nine of those twelve are
              still on the site today.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mute">
              Today we ship to 42 countries, work with a dozen family-run
              mills, and keep the same rule — plus one more: if a customer
              has to call to understand something, we wrote it wrong.
            </p>
            <Link to="/shop" className="btn-dark mt-8 px-10 py-3.5">
              Shop The Collection
            </Link>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="grid grid-cols-2 gap-4">
            <img src={NEWS_MAN} alt="" className="aspect-3/4 w-full object-cover"/>
            <img src={NEWS_WOMAN} alt="" className="mt-10 aspect-3/4 w-full object-cover"/>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#f7f7f9]">
        <div className="mx-auto grid max-w-1280px grid-cols-2 gap-8 px-5 py-16 lg:grid-cols-4">
          {STATS.map((s, i) => (<Reveal key={s.l} delay={i * 100}>
              <div className="text-center">
                <p className="font-serif text-4xl md:text-5xl">{s.n}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-mute">
                  {s.l}
                </p>
              </div>
            </Reveal>))}
        </div>
      </section>

      <section className="mx-auto max-w-1280px px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map(({ Icon, t, d }, i) => (<Reveal key={t} delay={i * 110}>
              <div className="group h-full border border-line p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-8 w-8"/>
                </span>
                <h3 className="mt-5 font-serif text-xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{d}</p>
              </div>
            </Reveal>))}
        </div>
      </section>

      <Newsletter />
    </div>);
}
/* ------------------------------ services ------------------------------ */
const SERVICES = [
    { Icon: TruckIc, t: "Free Shipping", d: "On all orders over $50 — flat 2–4 day delivery, no surprises at the door." },
    { Icon: ReturnIc, t: "30-Day Returns", d: "Changed your mind? Send it back within 30 days for a full refund. No forms, no friction." },
    { Icon: ShieldIc, t: "2-Year Warranty", d: "Every garment is covered for two full seasons against stitching and fabric faults." },
    { Icon: LockIc, t: "Secure Checkout", d: "256-bit encryption and card-grade payment processors on every single transaction." },
    { Icon: HeadsetIc, t: "24 / 7 Support", d: "Humans, not bots. Median first reply under ten minutes, day or night." },
    { Icon: BoxIc, t: "Order Tracking", d: "Live tracking from our warehouse to your doorstep, with honest delivery windows." },
];
const STEPS = [
    { n: "01", t: "Browse & pick", d: "Filter by size, colour, price or mood. Save favourites for later." },
    { n: "02", t: "Secure checkout", d: "One form, card-grade encryption, gift wrap if you like." },
    { n: "03", t: "Track to your door", d: "Live updates the whole way. 30 days to change your mind." },
];
const FAQ = [
    {
        q: "How long does shipping take?",
        a: "2–4 business days within the US and UK, 5–9 days internationally. Every order ships with live tracking from our warehouse the moment it's packed.",
    },
    {
        q: "Do you ship internationally?",
        a: "Yes — to 42 countries at this point. Duties are calculated at checkout, so the price you see is the price you pay.",
    },
    {
        q: "How do returns work?",
        a: "You have 30 days from delivery. Start a return from your account, drop the parcel at any carrier point, and the refund hits your card within 5 business days of scanning.",
    },
    {
        q: "Is my payment information safe?",
        a: "We never store your full card number. Payments run through PCI-DSS compliant processors, and the site is end-to-end encrypted.",
    },
];
function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (<div className="border-b border-line">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="text-[15px] font-medium">{q}</span>
        <ChevronIc className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}/>
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-mute">{a}</p>
        </div>
      </div>
    </div>);
}
export function Services() {
    return (<div>
      <div className="py-14 text-center">
        <h1 className="font-serif text-4xl">Our Services</h1>
        <Crumbs items={[["Home", "/"], ["Services"]]}/>
        <p className="mx-auto mt-4 max-w-md text-sm text-mute">
          The boring promises we make on purpose — and keep.
        </p>
      </div>

      <section className="mx-auto grid max-w-1280px gap-5 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ Icon, t, d }, i) => (<Reveal key={t} delay={i * 90}>
            <div className="group h-full border border-line p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
                <Icon className="h-8 w-8"/>
              </span>
              <h3 className="mt-5 font-serif text-xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{d}</p>
            </div>
          </Reveal>))}
      </section>

      <section className="bg-[#f7f7f9]">
        <div className="mx-auto max-w-1280px px-5 py-20">
          <h2 className="text-center font-serif text-3xl">How It Works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (<Reveal key={s.n} delay={i * 120}>
                <div className="text-center">
                  <p className="font-serif text-5xl text-gray-300">{s.n}</p>
                  <h3 className="mt-4 font-serif text-xl">{s.t}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-mute">
                    {s.d}
                  </p>
                </div>
              </Reveal>))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center font-serif text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 border-t border-line">
          {FAQ.map((f) => (<FaqItem key={f.q} q={f.q} a={f.a}/>))}
        </div>
        <p className="mt-8 text-center text-sm text-mute">
          Something else on your mind? Our team replies in under ten minutes —{" "}
          <span className="text-royal">24 / 7</span>.
        </p>
      </section>

      <Newsletter />
    </div>);
}
