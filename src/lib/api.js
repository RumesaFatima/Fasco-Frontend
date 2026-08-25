import { CATALOG } from "./data";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
function readLS(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch {
        return fallback;
    }
}
function writeLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
const USERS_KEY = "fasco_users";
const SESSION_KEY = "fasco_session";
const ORDERS_KEY = "fasco_orders";
const NEWS_KEY = "fasco_newsletter";
function seedUsers() {
    const users = readLS(USERS_KEY, []);
    if (!users.some((u) => u.email === "demo@fasco.com")) {
        users.push({
            firstName: "Demo",
            lastName: "Shopper",
            email: "demo@fasco.com",
            password: "demo123",
        });
        writeLS(USERS_KEY, users);
    }
    return users;
}
function mockSignup(b) {
    const { firstName, lastName, email, password, phone } = b;
    const users = seedUsers();
    if (!email || !password)
        throw new Error("Email and password are required.");
    if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase()))
        throw new Error("An account with this email already exists.");
    const user = {
        firstName: String(firstName || "New"),
        lastName: String(lastName || "User"),
        email: String(email),
        phone: phone ? String(phone) : undefined,
        password: String(password),
    };
    users.push(user);
    writeLS(USERS_KEY, users);
    const res = {
        token: "mock." + btoa(user.email),
        user: { ...user },
    };
    writeLS(SESSION_KEY, res);
    return res;
}
function mockLogin(b) {
    const users = seedUsers();
    const email = String(b.email || "").toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === email);
    if (!user || user.password !== String(b.password || ""))
        throw new Error("Incorrect email or password.");
    const res = {
        token: "mock." + btoa(user.email),
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        },
    };
    writeLS(SESSION_KEY, res);
    return res;
}
function mockForgot(b) {
    const users = seedUsers();
    const email = String(b.email || "").toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === email ||
        (b.firstName &&
            u.firstName.toLowerCase() === String(b.firstName).toLowerCase()));
    if (!user)
        throw new Error("No account found with those details.");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.code = code;
    user.codeExp = Date.now() + 10 * 60 * 1000;
    writeLS(USERS_KEY, users);
    return { code };
}
function mockVerify(b) {
    const users = seedUsers();
    const user = users.find((u) => u.email.toLowerCase() === String(b.email || "").toLowerCase());
    if (!user || !user.code || user.code !== String(b.code || ""))
        throw new Error("Invalid confirmation code.");
    if (user.codeExp && Date.now() > user.codeExp)
        throw new Error("Code expired. Please resend.");
    return { ok: true };
}
function mockReset(b) {
    const users = seedUsers();
    const user = users.find((u) => u.email.toLowerCase() === String(b.email || "").toLowerCase());
    if (!user || !user.code || user.code !== String(b.code || ""))
        throw new Error("Invalid confirmation code.");
    const pw = String(b.password || "");
    if (pw.length < 6)
        throw new Error("Password must be at least 6 characters.");
    user.password = pw;
    delete user.code;
    delete user.codeExp;
    writeLS(USERS_KEY, users);
    return { ok: true };
}
function mockProducts(q) {
    let list = [...CATALOG];
    const s = q?.search?.trim().toLowerCase();
    if (s)
        list = list.filter((p) => p.name.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s) ||
            p.tags.some((t) => t.toLowerCase().includes(s)));
    if (q?.category && q.category !== "All")
        list = list.filter((p) => p.category === q.category);
    switch (q?.sort) {
        case "price-asc":
            list.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            list.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            list.sort((a, b) => b.rating - a.rating);
            break;
        default:
            break;
    }
    return list;
}
function mockAddOrder(email, order) {
    const orders = readLS(ORDERS_KEY, []);
    const full = {
        ...order,
        email,
        id: "FS-" + String(Math.floor(100000 + Math.random() * 900000)),
        status: "Processing",
        createdAt: Date.now(),
    };
    orders.push(full);
    writeLS(ORDERS_KEY, orders);
    return full;
}
function mockOrders(email) {
    return readLS(ORDERS_KEY, [])
        .filter((o) => o.email.toLowerCase() === email.toLowerCase())
        .sort((a, b) => b.createdAt - a.createdAt);
}
function mockSubscribe(email) {
    const list = readLS(NEWS_KEY, []);
    if (!list.includes(email))
        list.push(email);
    writeLS(NEWS_KEY, list);
    return { ok: true };
}
async function call(path, init, fallback) {
    let body;
    if (init?.body) {
        try {
            body = JSON.parse(init.body);
        }
        catch {
            body = undefined;
        }
    }
    try {
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 1600);
        const token = localStorage.getItem("token");
        const res = await fetch(API_BASE + path, {
            ...init,
            signal: ctrl.signal,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(init?.headers || {}),
            },
        });
        window.clearTimeout(timer);
        const data = (await res.json().catch(() => ({})));
        if (!res.ok)
            throw new Error(data.message || "Request failed");
        return data;
    }
    catch {
        await delay(380);
        return fallback(body ?? {});
    }
}
const json = (b) => ({
    method: "POST",
    body: JSON.stringify(b),
});
export const api = {
    signup: (b) => call("/auth/signup", json(b), mockSignup),
    login: (b) => call("/auth/login", json(b), mockLogin),
    forgot: (b) => call("/auth/forgot", json(b), mockForgot),
    verify: (b) => call("/auth/verify", json(b), mockVerify),
    reset: (b) => call("/auth/reset", json(b), mockReset),
    products: (q) => call("/products" +
        (q?.search ? `?search=${encodeURIComponent(q.search)}` : ""), undefined, (b) => mockProducts(b)),
    addOrder: (email, order) => call("/orders", json({ ...order, email }), (b) => mockAddOrder(String(b?.email || email), b)),
    orders: (email) => call(`/orders?email=${encodeURIComponent(email)}`, undefined, () => mockOrders(email)),
    subscribe: (email) => call("/newsletter", json({ email }), () => mockSubscribe(email)),
};
export function getSession() {
    const session = readLS(SESSION_KEY, null);
    if (session) return session;
    try {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        if (!token || !rawUser) return null;
        return { token, user: JSON.parse(rawUser) };
    } catch {
        return null;
    }
}
export function saveSession(res) {
    writeLS(SESSION_KEY, res);
}
export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
