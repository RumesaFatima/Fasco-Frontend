import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { findProduct } from "../lib/data";
import { api, clearSession, getSession, saveSession, } from "../lib/api";
const Ctx = createContext(null);
const LINES_KEY = "fasco_cart";
export function StoreProvider({ children }) {
    const [lines, setLines] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(LINES_KEY) || "[]");
        }
        catch {
            return [];
        }
    });
    const [wrap, setWrap] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [user, setUserState] = useState(() => {
        const s = getSession();
        return s ? s.user : null;
    });
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        localStorage.setItem(LINES_KEY, JSON.stringify(lines));
    }, [lines]);
    const toast = useCallback((msg) => {
        const id = Date.now() + Math.random();
        setToasts((t) => [...t, { id, msg }]);
        window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    }, []);
    const add = useCallback((productId, size, color, qty) => {
        setLines((ls) => {
            const found = ls.find((l) => l.productId === productId && l.size === size && l.color === color);
            if (found)
                return ls.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
            return [...ls, { productId, size, color, qty }];
        });
    }, []);
    const setQty = useCallback((productId, size, qty) => {
        setLines((ls) => qty <= 0
            ? ls.filter((l) => !(l.productId === productId && l.size === size))
            : ls.map((l) => l.productId === productId && l.size === size ? { ...l, qty } : l));
    }, []);
    const remove = useCallback((productId, size) => {
        setLines((ls) => ls.filter((l) => !(l.productId === productId && l.size === size)));
    }, []);
    const clear = useCallback(() => setLines([]), []);
    const setUser = useCallback((u, token) => {
        if (u && token)
            saveSession({ token, user: u });
        else if (u)
            saveSession(getSession() || { token: "mock", user: u });
        else
            clearSession();
        setUserState(u);
    }, []);
    const logout = useCallback(() => {
        clearSession();
        setUserState(null);
    }, []);
    const { count, subtotal } = useMemo(() => {
        let c = 0;
        let s = 0;
        for (const l of lines) {
            const p = findProduct(l.productId);
            if (!p)
                continue;
            c += l.qty;
            s += p.price * l.qty;
        }
        return { count: c, subtotal: s };
    }, [lines]);
    const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 40;
    const wrapCost = wrap && subtotal > 0 ? 10 * Math.max(1, lines.length) : 0;
    const total = subtotal + shipping + wrapCost;
    const placeOrder = useCallback(async (address, discount, email) => {
        const ordLines = lines
            .map((l) => {
            const p = findProduct(l.productId);
            if (!p)
                return null;
            return {
                productId: p.id,
                name: p.name,
                image: p.image,
                color: l.color,
                size: l.size,
                qty: l.qty,
                price: p.price,
            };
        })
            .filter(Boolean);
        const order = await api.addOrder(user?.email || email || "guest@fasco.demo", {
            lines: ordLines,
            subtotal,
            discount,
            shipping,
            total: Math.max(0, total - discount),
            address,
        });
        setLines([]);
        setWrap(false);
        return order;
    }, [lines, subtotal, shipping, total, user]);
    const getMyOrders = useCallback(async () => {
        if (!user)
            return [];
        return api.orders(user.email);
    }, [user]);
    const value = {
        lines,
        wrap,
        setWrap,
        add,
        setQty,
        remove,
        clear,
        count,
        subtotal,
        shipping,
        total,
        drawer,
        setDrawer,
        user,
        setUser,
        logout,
        toasts,
        toast,
        placeOrder,
        getMyOrders,
    };
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("useStore must be used inside StoreProvider");
    return ctx;
}
