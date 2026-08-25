import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATALOG } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { Crumbs, GridIc, ListIc } from "../components/ui";
import { Newsletter } from "../components/Sections";
const PALETTE = [
    { name: "Red", hex: "#d8232a" },
    { name: "Orange", hex: "#e07b39" },
    { name: "Yellow", hex: "#e8c14a" },
    { name: "Green", hex: "#5a9e6f" },
    { name: "Aqua", hex: "#49b8b0" },
    { name: "Blue", hex: "#3f6fa8" },
    { name: "Navy", hex: "#23334d" },
    { name: "Pink", hex: "#e9b8c4" },
    { name: "Beige", hex: "#d9c6a5" },
    { name: "Black", hex: "#17181c" },
];
const PRICE_RANGES = [
    { l: "$0 – $30", min: 0, max: 30 },
    { l: "$30 – $60", min: 30, max: 60 },
    { l: "$60 – $90", min: 60, max: 90 },
    { l: "$90 – $150", min: 90, max: 150 },
];
const BRANDS = ["FASCO", "Hugo Boss"];
const COLLECTIONS = ["All Products", "New Arrivals", "For Female", "For Males"];
const TAGS = [
    "Dress",
    "Tank",
    "Flannel",
    "Suit",
    "T Shirt",
    "Jacket",
    "Coat",
    "Denim",
    "Leather",
    "Jeanswear",
    "Hat",
];
function Group({ title, children }) {
    return (<div className="border-b border-line py-5">
      <p className="mb-4 text-sm font-medium">{title}</p>
      {children}
    </div>);
}
export default function Shop() {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [price, setPrice] = useState(null);
    const [brand, setBrand] = useState(null);
    const [collection, setCollection] = useState("All Products");
    const [tag, setTag] = useState(null);
    const [sort, setSort] = useState("featured");
    const [view, setView] = useState("grid");
    const [page, setPage] = useState(1);
    useEffect(() => setPage(1), [sizes, colors, price, brand, collection, tag, q]);
    const toggle = (arr, v, set) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    const list = useMemo(() => {
        let l = [...CATALOG];
        if (q) {
            const s = q.toLowerCase();
            l = l.filter((p) => p.name.toLowerCase().includes(s) ||
                p.category.toLowerCase().includes(s) ||
                p.tags.some((t) => t.toLowerCase().includes(s)));
        }
        if (sizes.length)
            l = l.filter((p) => sizes.some((s) => p.sizes.includes(s)));
        if (colors.length)
            l = l.filter((p) => p.colors.some((c) => colors.includes(c.name)));
        if (price !== null)
            l = l.filter((p) => p.price >= PRICE_RANGES[price].min && p.price < PRICE_RANGES[price].max);
        if (brand)
            l = l.filter((p) => p.brand === brand);
        if (collection === "New Arrivals")
            l = l.filter((p) => p.oldPrice);
        if (collection === "For Female")
            l = l.filter((p) => p.category === "Dresses");
        if (collection === "For Males")
            l = l.filter((p) => p.category !== "Dresses");
        if (tag)
            l = l.filter((p) => p.tags.includes(tag));
        if (sort === "price-asc")
            l.sort((a, b) => a.price - b.price);
        if (sort === "price-desc")
            l.sort((a, b) => b.price - a.price);
        if (sort === "rating")
            l.sort((a, b) => b.rating - a.rating);
        return l;
    }, [q, sizes, colors, price, brand, collection, tag, sort]);
    const perPage = 6;
    const pages = Math.max(1, Math.ceil(list.length / perPage));
    const safe = Math.min(page, pages);
    const shown = list.slice((safe - 1) * perPage, safe * perPage);
    return (<div>
      <div className="py-14 text-center">
        <h1 className="font-serif text-4xl">Fashion</h1>
        <Crumbs items={[["Home", "/"], ["Fashion"]]}/>
      </div>

      <div className="mx-auto grid max-w-1280px gap-10 px-5 pb-24 lg:grid-cols-[250px_1fr]">
        <aside>
          <h2 className="pb-2 font-serif text-2xl">Filters</h2>
          <Group title="Size">
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((s) => (<button key={s} onClick={() => toggle(sizes, s, setSizes)} className={`h-9 w-9 rounded text-xs transition-all ${sizes.includes(s)
                ? "bg-ink text-white"
                : "border border-line text-gray-500 hover:border-ink"}`}>
                  {s}
                </button>))}
            </div>
          </Group>
          <Group title="Colors">
            <div className="grid grid-cols-5 gap-2.5">
              {PALETTE.map((c) => (<button key={c.name} title={c.name} onClick={() => toggle(colors, c.name, setColors)} className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${colors.includes(c.name)
                ? "ring-2 ring-ink ring-offset-2"
                : "border border-black/10"}`} style={{ background: c.hex }} aria-label={c.name}/>))}
            </div>
          </Group>
          <Group title="Price">
            <ul className="space-y-2.5">
              {PRICE_RANGES.map((r, i) => (<li key={r.l}>
                  <button onClick={() => setPrice(price === i ? null : i)} className={`text-sm transition-colors ${price === i ? "text-ink underline underline-offset-4" : "text-mute hover:text-ink"}`}>
                    {r.l}
                  </button>
                </li>))}
            </ul>
          </Group>
          <Group title="Brand">
            <ul className="space-y-2.5">
              {BRANDS.map((b) => (<li key={b}>
                  <button onClick={() => setBrand(brand === b ? null : b)} className={`text-sm transition-colors ${brand === b ? "text-ink underline underline-offset-4" : "text-mute hover:text-ink"}`}>
                    {b}
                  </button>
                </li>))}
            </ul>
          </Group>
          <Group title="Collections">
            <ul className="space-y-2.5">
              {COLLECTIONS.map((c) => (<li key={c}>
                  <button onClick={() => setCollection(c)} className={`text-sm transition-colors ${collection === c
                ? "text-ink underline underline-offset-4"
                : "text-mute hover:text-ink"}`}>
                    {c}
                  </button>
                </li>))}
            </ul>
          </Group>
          <Group title="Tags">
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (<button key={t} onClick={() => setTag(tag === t ? null : t)} className={`rounded-full px-3 py-1.5 text-xs transition-all ${tag === t
                ? "bg-ink text-white"
                : "border border-line text-gray-500 hover:border-ink"}`}>
                  {t}
                </button>))}
            </div>
          </Group>
        </aside>

        <div>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <label className="flex items-center gap-3 text-sm text-mute">
              Sorting:
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer border-b border-line bg-transparent py-1 text-sm text-ink outline-none">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </label>
            <div className="flex gap-1">
              <button onClick={() => setView("grid")} className={`rounded p-2 transition-colors ${view === "grid" ? "bg-ink text-white" : "text-mute hover:text-ink"}`} aria-label="grid view">
                <GridIc className="h-4 w-4"/>
              </button>
              <button onClick={() => setView("list")} className={`rounded p-2 transition-colors ${view === "list" ? "bg-ink text-white" : "text-mute hover:text-ink"}`} aria-label="list view">
                <ListIc className="h-4 w-4"/>
              </button>
            </div>
          </div>

          {q && (<p className="mt-4 text-sm text-mute">
              Results for <strong className="text-ink">“{q}”</strong> —{" "}
              {list.length} found
            </p>)}

          {shown.length === 0 ? (<div className="py-24 text-center">
              <p className="font-serif text-2xl">No products match those filters</p>
              <p className="mt-2 text-sm text-mute">
                Try removing a filter or two — the wardrobe is deep.
              </p>
            </div>) : view === "grid" ? (<div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (<ProductCard key={p.id} p={p}/>))}
            </div>) : (<div className="mt-8 grid gap-5">
              {shown.map((p) => (<ProductCard key={p.id} p={p} list/>))}
            </div>)}

          {pages > 1 && (<div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, d) => (<button key={d} onClick={() => setPage(d + 1)} className={`h-9 w-9 rounded-md text-sm transition-all ${safe === d + 1
                    ? "bg-ink text-white"
                    : "border border-line text-gray-500 hover:border-ink"}`}>
                  {d + 1}
                </button>))}
            </div>)}
        </div>
      </div>

      <Newsletter />
    </div>);
}
