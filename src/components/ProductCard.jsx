import { Link } from "react-router-dom";
import { money } from "../lib/data";
import { useStore } from "../context/StoreContext";
import { Stars } from "./ui";
export default function ProductCard({ p, list = false }) {
    const { add, setDrawer, toast } = useStore();
    const quickAdd = () => {
        add(p.id, p.sizes[0], p.colors[0].name, 1);
        setDrawer(true);
        toast(`Added “${p.name}” to cart`);
    };
    if (list) {
        return (<Link to={`/product/${p.id}`} className="group flex gap-5 border border-line bg-white p-4 transition-all duration-300 hover:shadow-lg">
        <div className="w-32 shrink-0 overflow-hidden bg-[#f4f4f6]">
          <img src={p.image} alt={p.name} className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="font-serif text-lg">{p.name}</h3>
          <div className="mt-1 flex items-center gap-3">
            <p>
              <span className="font-medium">{money(p.price)}</span>{" "}
              {p.oldPrice && (<s className="text-sm text-mute">{money(p.oldPrice)}</s>)}
            </p>
            <Stars n={p.rating}/>
          </div>
          <div className="mt-2 flex gap-1.5">
            {p.colors.map((c) => (<span key={c.name} className="h-3 w-3 rounded-full border border-black/10" style={{ background: c.hex }}/>))}
          </div>
          <button onClick={(e) => {
                e.preventDefault();
                quickAdd();
            }} className="btn-outline mt-auto self-start px-5 py-2 text-xs tracking-[0.15em]">
            ADD TO CART
          </button>
        </div>
      </Link>);
    }
    return (<Link to={`/product/${p.id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f4f4f6]">
        <img src={p.image} alt={p.name} className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        {p.oldPrice && (<span className="absolute left-3 top-3 rounded-full bg-pop px-3 py-1 text-[10px] font-medium tracking-widest text-white">
            SALE
          </span>)}
        <button onClick={(e) => {
            e.preventDefault();
            quickAdd();
        }} className="absolute inset-x-4 bottom-4 translate-y-3 rounded-lg bg-ink/95 py-3 text-[11px] font-medium tracking-[0.18em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          ADD TO CART
        </button>
      </div>
      <div className="pt-4">
        <h3 className="font-serif text-[17px] leading-snug transition-colors group-hover:text-ink/70">
          {p.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <p>
            <span className="text-[15px] font-medium">{money(p.price)}</span>{" "}
            {p.oldPrice && (<s className="text-sm text-mute">{money(p.oldPrice)}</s>)}
          </p>
          <Stars n={p.rating} className="h-3 w-3"/>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {p.colors.map((c) => (<span key={c.name} className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: c.hex }} title={c.name}/>))}
        </div>
      </div>
    </Link>);
}
