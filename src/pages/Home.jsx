import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATALOG, CATEGORIES, HERO_SLIDES } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { ArrowLIc, ArrowRIc, Reveal, } from "../components/ui";
import { Brands, Deals, Features, Instagram, Newsletter, PeakyBanner, Testimonials, } from "../components/Sections";
export default function Home() {
    return (<>
      <Hero />
      <Brands />
      <Deals />
      <NewArrivals />
      <PeakyBanner />
      <Features />
      <Instagram />
      <Testimonials />
      <Newsletter />
    </>);
}
const AVATARS = [
    "https://images.pexels.com/photos/30590775/pexels-photo-30590775.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=200",
    "https://images.pexels.com/photos/2854430/pexels-photo-2854430.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=200",
    "https://images.pexels.com/photos/31046837/pexels-photo-31046837.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=200",
];
function Hero() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const iv = window.setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 6000);
        return () => window.clearInterval(iv);
    }, []);
    const s = HERO_SLIDES[i];
    const prev = () => setI((x) => (x - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    const next = () => setI((x) => (x + 1) % HERO_SLIDES.length);
    return (<section className="relative">
      <style>{`@keyframes heroFade{from{opacity:0}to{opacity:1}}`}</style>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-3">
        <div key={`l${i}`} className="relative hidden h-[560px] overflow-hidden md:block" style={{ animation: "heroFade .8s both" }}>
          <img src={s.left} alt="" className="h-full w-full object-cover"/>
        </div>
        <div key={`c${i}`} className="relative flex flex-col items-center justify-center bg-[#f7f3ee] px-8 py-20 text-center" style={{ animation: "heroFade .8s .12s both" }}>
          <p className="text-xs uppercase tracking-[0.35em] text-mute">
            {s.kicker}
          </p>
          <h1 className="mt-5 font-serif text-6xl font-semibold leading-none md:text-7xl">
            {s.title}{" "}
            <span className="text-transparent" style={{ WebkitTextStroke: "1.6px #17181c" }}>
              {s.accent}
            </span>
          </h1>
          <p className="mt-5 text-xl font-light tracking-wide">{s.off}</p>
          <Link to="/shop" className="btn-dark mt-9 px-10 py-3.5">
            shop now
          </Link>
          <div className="float-slow mt-11 flex -space-x-3">
            {AVATARS.map((a, x) => (<img key={x} src={a} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover"/>))}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[10px] text-white">
              +2k
            </span>
          </div>
        </div>
        <div key={`r${i}`} className="relative hidden h-[560px] overflow-hidden md:block" style={{ animation: "heroFade .8s both" }}>
          <img src={s.right} alt="" className="h-full w-full object-cover"/>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((_, d) => (<button key={d} onClick={() => setI(d)} className={`h-2 rounded-full transition-all duration-300 ${d === i ? "w-7 bg-ink" : "w-2 bg-gray-300"}`} aria-label={`slide ${d + 1}`}/>))}
      </div>
      <button onClick={prev} className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-line bg-white/70 p-2.5 backdrop-blur transition-all hover:bg-white md:block" aria-label="previous slide">
        <ArrowLIc className="h-4 w-4"/>
      </button>
      <button onClick={next} className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-line bg-white/70 p-2.5 backdrop-blur transition-all hover:bg-white md:block" aria-label="next slide">
        <ArrowRIc className="h-4 w-4"/>
      </button>
    </section>);
}
function NewArrivals() {
    const [cat, setCat] = useState("All");
    const [page, setPage] = useState(1);
    useEffect(() => setPage(1), [cat]);
    const list = CATALOG.filter((p) => cat === "All" || p.category === cat);
    const perPage = 6;
    const pages = Math.max(1, Math.ceil(list.length / perPage));
    const safe = Math.min(page, pages);
    const shown = list.slice((safe - 1) * perPage, safe * perPage);
    return (<section className="bg-white py-24">
      <div className="mx-auto max-w-1280px px-5">
        <Reveal>
          <h2 className="text-center font-serif text-3xl md:text-4xl">
            New Arrivals
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-mute">
            Just landed in the studio. First look before the rest of the feed
            finds out.
          </p>
        </Reveal>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((c) => (<button key={c} onClick={() => setCat(c)} className={`rounded-md px-5 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 ${cat === c
                ? "bg-ink text-white"
                : "border border-line text-gray-500 hover:border-ink hover:text-ink"}`}>
              {c}
            </button>))}
        </div>

        <div key={cat} className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" style={{ animation: "heroFade .5s both" }}>
          {shown.map((p) => (<ProductCard key={p.id} p={p}/>))}
        </div>

        {pages > 1 && (<div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, d) => (<button key={d} onClick={() => setPage(d + 1)} className={`h-9 w-9 rounded-md text-sm transition-all ${safe === d + 1
                    ? "bg-ink text-white"
                    : "border border-line text-gray-500 hover:border-ink"}`}>
                {d + 1}
              </button>))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="grid h-9 w-9 place-items-center rounded-md border border-line text-gray-500 transition-all hover:border-ink" aria-label="next page">
              <ArrowRIc className="h-4 w-4"/>
            </button>
          </div>)}
      </div>
    </section>);
}
