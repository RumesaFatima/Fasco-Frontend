import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { findProduct } from "../lib/data";
import {
    api,
    clearSession,
    getSession,
    saveSession,
} from "../lib/api";

const Ctx = createContext(null);
const LINES_KEY = "fasco_cart";

export function StoreProvider({ children }) {
    const [lines, setLines] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem(LINES_KEY) || "[]"
            );
        } catch {
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
        localStorage.setItem(
            LINES_KEY,
            JSON.stringify(lines)
        );
    }, [lines]);

    const toast = useCallback((msg, type = "error", closeId = null) => {
        if (type === "close" && closeId) {
            setToasts((current) =>
                current.filter((item) => item.id !== closeId)
            );
            return;
        }

        const id = Date.now() + Math.random();

        setToasts((current) => [
            ...current,
            {
                id,
                msg,
                type,
            },
        ]);
    }, []);

    const add = useCallback(
        (productId, size, color, qty) => {
            if (!user) {
                toast(
                    "Please login to add products to your cart.",
                    "error"
                );

                return false;
            }

            setLines((currentLines) => {
                const found = currentLines.find(
                    (line) =>
                        line.productId === productId &&
                        line.size === size &&
                        line.color === color
                );

                if (found) {
                    return currentLines.map((line) =>
                        line === found
                            ? {
                                ...line,
                                qty: line.qty + qty,
                            }
                            : line
                    );
                }

                return [
                    ...currentLines,
                    {
                        productId,
                        size,
                        color,
                        qty,
                    },
                ];
            });

            toast(
                "Product added to your cart.",
                "success"
            );

            return true;
        },
        [user, toast]
    );

    const setQty = useCallback(
        (productId, size, qty) => {
            setLines((currentLines) =>
                qty <= 0
                    ? currentLines.filter(
                        (line) =>
                            !(
                                line.productId === productId &&
                                line.size === size
                            )
                    )
                    : currentLines.map((line) =>
                        line.productId === productId &&
                            line.size === size
                            ? {
                                ...line,
                                qty,
                            }
                            : line
                    )
            );
        },
        []
    );

    const remove = useCallback(
        (productId, size) => {
            setLines((currentLines) =>
                currentLines.filter(
                    (line) =>
                        !(
                            line.productId === productId &&
                            line.size === size
                        )
                )
            );
        },
        []
    );


    const clear = useCallback(() => {
        setLines([]);
    }, []);


    const setUser = useCallback((u, token) => {
        if (u && token) {
            saveSession({
                token,
                user: u,
            });
        } else if (u) {
            saveSession(
                getSession() || {
                    token: "mock",
                    user: u,
                }
            );
        } else {
            clearSession();
        }

        setUserState(u);
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setUserState(null);
    }, []);


    const { count, subtotal } = useMemo(() => {
        let c = 0;
        let s = 0;

        for (const line of lines) {
            const product = findProduct(
                line.productId
            );

            if (!product) continue;

            c += line.qty;
            s += product.price * line.qty;
        }

        return {
            count: c,
            subtotal: s,
        };
    }, [lines]);

    const shipping =
        subtotal === 0
            ? 0
            : subtotal >= 75
                ? 0
                : 40;

    const wrapCost =
        wrap && subtotal > 0
            ? 10 * Math.max(1, lines.length)
            : 0;

    const total =
        subtotal +
        shipping +
        wrapCost;



    const placeOrder = useCallback(
        async (address, discount, email) => {
            // NEVER allow guest checkout
            if (!user) {
                toast(
                    "Please login to continue to checkout.",
                    "error"
                );

                return null;
            }

            const ordLines = lines
                .map((line) => {
                    const product = findProduct(
                        line.productId
                    );

                    if (!product) return null;

                    return {
                        productId: product.id,
                        name: product.name,
                        image: product.image,
                        color: line.color,
                        size: line.size,
                        qty: line.qty,
                        price: product.price,
                    };
                })
                .filter(Boolean);

            const order = await api.addOrder(
                user.email ||
                email ||
                "guest@fasco.demo",
                {
                    lines: ordLines,
                    subtotal,
                    discount,
                    shipping,
                    total: Math.max(
                        0,
                        total - discount
                    ),
                    address,
                }
            );

            setLines([]);
            setWrap(false);

            return order;
        },
        [
            user,
            lines,
            subtotal,
            shipping,
            total,
            toast,
        ]
    );

    const getMyOrders = useCallback(async () => {
        if (!user) return [];

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

    return (
        <Ctx.Provider value={value}>
            {children}
        </Ctx.Provider>
    );
}

export function useStore() {
    const ctx = useContext(Ctx);

    if (!ctx) {
        throw new Error(
            "useStore must be used inside StoreProvider"
        );
    }

    return ctx;
}