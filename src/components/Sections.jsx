import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  DEAL_IMAGES,
  INSTA_IMAGES,
  NEWS_MAN,
  NEWS_WOMAN,
  PEAKY_IMG,
} from "../lib/data";
import { useStore } from "../context/StoreContext";
import {
  BoxIc,
  Countdown,
  HeadsetIc,
  Reveal,
  SectionHead,
  ShieldIc,
  StarIc,
  TruckIc,
} from "./ui";

const BRANDS = ["CHANEL", "HUGO BOSS", "PRADA", "CALVIN KLEIN", "DENIM"];

export function Brands() {
  return (
    <div className="border-y border-line bg-white">
      <div className="mx-auto flex max-w-1280px flex-wrap items-center justify-center gap-x-12 gap-y-4 px-5 py-7">
        {BRANDS.map((b) => (
          <span
            key={b}
            className={`text-gray-300 transition-colors duration-300 hover:text-gray-500 ${b === "CHANEL" || b === "PRADA"
              ? "font-serif text-lg tracking-[0.3em]"
              : "text-sm font-semibold tracking-[0.25em]"
              }`}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Deals() {
  return (
    <section className="mx-auto max-w-1280px px-5 py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-5xl">
            Deals Of The Month
          </h2>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-mute">
            A curated drop of season-defining pieces at their lowest prices of
            the year. When the timer hits zero, the prices go back — the
            pieces, hopefully, don't.
          </p>

          <Link to="/shop" className="btn-dark mt-8 px-10 py-3.5">
            Shop Now
          </Link>

          <p className="mt-12 text-[15px] font-medium">
            Hurry! Before It's Too Late!
          </p>

          <Countdown className="mt-4" />
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-4">
            {DEAL_IMAGES.map((img, i) => (
              <Link
                key={i}
                to="/shop"
                className="group relative block overflow-hidden bg-[#f4f4f6]"
              >
                <img
                  src={img}
                  alt="deal product"
                  className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {i === 0 && (
                  <span className="absolute left-3 top-3 bg-white px-3 py-1.5 text-[11px] font-medium tracking-wide">
                    Sale 30% OFF
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CALLOUTS = [
  { t: "Fed Caps", cls: "right-6 top-10" },
  { t: "Suspenders", cls: "-left-2 top-1/3 hidden md:block" },
  { t: "Hugo Boss", cls: "left-1/3 top-[54%]" },
  { t: "Sartorial", cls: "right-10 bottom-8" },
];

export function PeakyBanner() {
  return (
    <section className="relative overflow-hidden bg-[#f2f2f5]">
      <div className="mx-auto grid max-w-1280px items-center lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto w-full max-w-md px-10 py-14 lg:px-14">
            <span className="absolute left-1/4 top-6 h-16 w-10 bg-ink/90" />
            <span className="absolute left-1/2 top-1/2 h-44 w-14 -translate-x-1/2 bg-ink/90" />

            <img
              src={PEAKY_IMG}
              alt="Peaky Blinders collection"
              className="relative mx-auto aspect-3/4 w-full object-cover grayscale-30"
            />

            {CALLOUTS.map((c) => (
              <span
                key={c.t}
                className={`absolute ${c.cls} border border-line bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm`}
              >
                {c.t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="px-8 py-16 lg:pl-4 lg:pr-16">
            <p className="text-sm text-mute">Women Collection</p>

            <h2 className="mt-2 font-serif text-4xl md:text-5xl">
              Peaky Blinders
            </h2>

            <p className="mt-7 text-[11px] font-medium tracking-[0.25em] text-mute">
              DESCRIPTION
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
              A nod to the street: structured coats, flat caps and tailored
              trousers cut for the modern commutant. Wool-blend fabric, matte
              buttons, and a silhouette that has survived a century of rain.
            </p>

            <p className="mt-7 flex items-center gap-3 text-sm">
              Size:
              <span className="border border-line bg-white px-3.5 py-1.5">
                M
              </span>
            </p>

            <p className="mt-4 font-serif text-3xl">$100.00</p>

            <Link to="/shop" className="btn-dark mt-7 px-10 py-3.5">
              Buy Now
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FEATS = [
  { Icon: BoxIc, t: "High Quality", d: "Crafted from top materials" },
  { Icon: ShieldIc, t: "Warranty Protection", d: "Over 2 years" },
  { Icon: TruckIc, t: "Free Shipping", d: "Orders over $50" },
  { Icon: HeadsetIc, t: "24 / 7 Support", d: "Dedicated support" },
];

export function Features() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-1280px gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {FEATS.map(({ Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 90}>
            <div className="group flex items-center gap-4">
              <span className="text-ink transition-transform duration-300 group-hover:-translate-y-1">
                <Icon className="h-7 w-7" />
              </span>

              <div>
                <p className="text-[15px] font-medium">{t}</p>
                <p className="text-xs text-mute">{d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Instagram() {
  return (
    <section className="bg-white">
      <SectionHead
        title="Follow Us On Instagram"
        sub="A daily feed of fits, drops and behind-the-scenes — @fasco on the gram."
        className="px-5 pt-20"
      />

      <Reveal delay={150}>
        <div className="mt-10 flex justify-center gap-1.5 overflow-hidden px-2 pb-4">
          {INSTA_IMAGES.map((src, i) => (
            <a
              key={i}
              href="#/shop"
              className="group relative block h-64 w-40 shrink-0 overflow-hidden"
            >
              <img
                src={src}
                alt="instagram"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/20" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const QUOTES = [
  {
    name: "Emma K.",
    img: "https://images.pexels.com/photos/30590775/pexels-photo-30590775.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    stars: 5,
    text: "The quality honestly surprised me. The blazer arrived in two days, the stitching is immaculate, and the fit is exactly like the photos. FASCO is my first stop now.",
  },
  {
    name: "Daniel R.",
    img: "https://images.pexels.com/photos/15265381/pexels-photo-15265381.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    stars: 5,
    text: "Ordered the trench on Tuesday, wore it to a wedding on Friday. Support replied to my sizing question in under ten minutes. This is how e-commerce should feel.",
  },
  {
    name: "Priya S.",
    img: "https://images.pexels.com/photos/2854430/pexels-photo-2854430.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    stars: 4,
    text: "Beautiful packaging, fair prices, and the exchange process took one click. My only complaint? The sale ends too fast — I keep missing out on things I want.",
  },
];

export function Testimonials() {
  const [dot, setDot] = useState(0);

  return (
    <section className="bg-[#fafafc]">
      <div className="mx-auto max-w-1280px px-5 py-20">
        <SectionHead
          title="This Is What Our Customers Say"
          sub="Real reviews from real wardrobes — unedited, mostly."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 110}>
              <figure
                className={`h-full border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${dot === i % 3
                  ? "border-ink shadow-lg"
                  : "border-line"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={q.img}
                    alt={q.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <figcaption className="text-[15px] font-medium">
                      {q.name}
                    </figcaption>

                    <span className="flex gap-0.5 text-[#e8a33d]">
                      {Array.from({ length: q.stars }).map((_, s) => (
                        <StarIc key={s} className="h-3.5 w-3.5" />
                      ))}
                    </span>
                  </div>
                </div>

                <blockquote className="mt-4 text-sm leading-relaxed text-gray-600">
                  “{q.text}”
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setDot(i)}
              className={`h-2 rounded-full transition-all duration-300 ${dot === i ? "w-6 bg-ink" : "w-2 bg-gray-300"
                }`}
              aria-label={`testimonial group ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useStore();

  const submit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast("Please enter a valid email");
      return;
    }

    try {
      setBusy(true);
      await api.subscribe(cleanEmail);
      setEmail("");
      toast("Subscribed! Welcome to the list ✦");
    } catch (error) {
      toast(error?.message || "Subscription failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-1280px items-stretch md:grid-cols-3">
        <div className="hidden h-[430px] md:block">
          <img
            src={NEWS_MAN}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl">
            Subscribe To Our Newsletter
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
            New drops, private sales and styling notes — once a week, no spam,
            unsubscribe whenever.
          </p>

          <form onSubmit={submit} className="mt-8 w-full max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="michael@ymail.com"
              disabled={busy}
              className="w-full bg-[#f4f4f6] px-5 py-4 text-sm outline-none transition-shadow placeholder:text-mute focus:shadow-md disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={busy}
              className="btn-dark mt-6 px-9 py-3.5 disabled:opacity-60"
            >
              {busy ? "SUBSCRIBING..." : "Subscribe Now"}
            </button>
          </form>
        </div>

        <div className="hidden h-[430px] md:block">
          <img
            src={NEWS_WOMAN}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
