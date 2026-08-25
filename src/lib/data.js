
const IMG = {
   
    h1: "/images/fasco img 1.jpg",
    h2: "/images/fasco img 2.jpg",
    h3: "/images/fasco img 3.jpg",
    h4: "/images/fasco img 4.jpg",
    h5: "/images/fasco img 5.jpg",
    h6: "/images/fasco img 6.jpg",
    h7: "/images/fasco img 7.jpg",
    h8: "/images/fasco img 8.jpg",
    h9: "/images/fasco img 9.jpg",
    h10: "/images/fasco img 10.jpg",
    h11: "/images/fasco img 11.jpg",
    h12: "/images/fasco img 12.jpg",
    h13: "/images/fasco img 13.jpg",
    h14: "/images/fasco img 14.jpg",
    h15: "/images/fasco img 15.jpg",
    h16: "/images/fasco img 16.jpg",
    h17: "/images/fasco img 17.jpg",
    h18: "/images/fasco img 18.jpg",

    w1: "/images/fasco img 1.jpg",
    w2: "/images/fasco img 4.jpg",
    w3: "/images/fasco img 2.jpg",
    w4: "/images/fasco img 12.jpg",
    w5: "/images/fasco img 8.jpg",
    w6: "/images/fasco img 3.jpg",
    w7: "/images/fasco img 5.jpg",
    w8: "/images/fasco img 9.jpg",
    w9: "/images/fasco img 2.jpg",
    w10: "/images/fasco img 6.jpg",

    m1: "/images/fasco img 7.jpg",
    m2: "/images/fasco img 5.jpg",
    m3: "/images/fasco img 11.jpg",
    m4: "/images/fasco img 12.jpg",
    m5: "/images/fasco img 11.jpg",
    m6: "/images/fasco img 4.jpg",
    m7: "/images/fasco img 13.jpg",
    m8: "/images/fasco img 5.jpg",

    c1: "/images/fasco img 10.jpg",
    c2: "/images/fasco img 12.jpg",
    c3: "/images/fasco img 12.jpg",
    c4: "/images/fasco img 13.jpg",
    c5: "/images/fasco img 12.jpg",
};

export const AUTH_IMAGE = IMG.c4;

export const NEWS_MAN = IMG.m6;

export const NEWS_WOMAN = IMG.h8;

export const PEAKY_IMG = IMG.m5;

export const HERO_SLIDES = [
    {
        kicker: "New Season Collection",
        title: "ULTIMATE",
        accent: "SALE",
        off: "30% OFF",
        left: IMG.m6,
        right: IMG.w8,
    },

    {
        kicker: "Fall / Winter Drop",
        title: "CITY",
        accent: "EDIT",
        off: "UP TO 40% OFF",
        left: IMG.m5,
        right: IMG.w9,
    },

    {
        kicker: "Limited Run",
        title: "STUDIO",
        accent: "SERIES",
        off: "20% OFF",
        left: IMG.m7,
        right: IMG.w6,
    },
];

export const DEAL_IMAGES = [
    IMG.w4,
    IMG.h4,
    IMG.w10,
    IMG.c3,
];

export const INSTA_IMAGES = [
    IMG.c1,
    IMG.c2,
    IMG.c5,
    IMG.w8,
    IMG.m7,
    IMG.h5,
    IMG.w3,
];

export const CATALOG = [

    {
        id: "p01",
        name: "Denim Jacket",
        category: "Jackets",
        brand: "FASCO",
        price: 39.0,
        oldPrice: 59.0,
        rating: 4,
        reviews: 3,
        colors: [
            { name: "Blue", hex: "#9db6c9" },
            { name: "Black", hex: "#1c1d22" },
            { name: "Pink", hex: "#e9b8c4" },
        ],
        sizes: ["M", "L", "XL", "XXL"],
        stock: 9,
        image: IMG.h4,
        gallery: [
            IMG.h10,
            IMG.h3,
            IMG.h4,
        ],
        description:
            "A washed, soft-structured denim jacket with a relaxed cut. Pre-faded finish, metal hardware and two chest flaps. Layers cleanly over knits and tees alike.",
        tags: ["Jacket", "Denim"],
    },

    {
        id: "p02",
        name: "Mini Dress With Ruffled Straps",
        category: "Dresses",
        brand: "FASCO",
        price: 14.9,
        oldPrice: 29.99,
        rating: 5,
        reviews: 21,
        colors: [
            { name: "Red", hex: "#d8232a" },
        ],
        sizes: ["S", "M", "L"],
        stock: 14,
        image: IMG.h5,
        gallery: [
            IMG.h9,
            IMG.h2,
            IMG.h3,
        ],
        description:
            "A flirty mini with ruffled straps and a bias cut that moves with you. Light stretch fabric, lined bodice, back zip closure.",
        tags: ["Dress"],
    },

    {
        id: "p03",
        name: "Ruffled Tank Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 32.0,
        rating: 4,
        reviews: 8,
        colors: [
            { name: "Aqua", hex: "#bfe3e0" },
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 11,
        image: IMG.h6,
        gallery: [
            IMG.h2,
            IMG.h1,
            IMG.h3,
        ],
        description:
            "Clean-lined tank dress with sculpted ruffles at the shoulders. Holds its shape, drapes well, easy to dress up or down.",
        tags: ["Dress", "Tank"],
    },

    {
        id: "p04",
        name: "Women Casual Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 32.0,
        oldPrice: 45.0,
        rating: 4,
        reviews: 12,
        colors: [
            { name: "Beige", hex: "#d9c6a5" },
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L"],
        stock: 18,
        image: IMG.h1,
        gallery: [
            IMG.h5,
            IMG.h13,
            IMG.h4,
        ],
        description:
            "The everyday dress: mid-length, soft drape, side pockets. Breathable viscose blend that survives the wash and keeps the line.",
        tags: ["Dress", "Casual"],
    },

    {
        id: "p05",
        name: "Long Sleeve Coat",
        category: "Jackets",
        brand: "Hugo Boss",
        price: 89.0,
        oldPrice: 120.0,
        rating: 5,
        reviews: 17,
        colors: [
            { name: "Tan", hex: "#c8a878" },
            { name: "Grey", hex: "#8f9299" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 7,
        image: IMG.h7,
        gallery: [
            IMG.h7,
            IMG.h11,
            IMG.h5,
        ],
        description:
            "A full-length city coat with a clean shoulder and hidden placket. Brushed lining, deep pockets, made to be lived in.",
        tags: ["Jacket", "Coat"],
    },

    {
        id: "p06",
        name: "Black Flap Top",
        category: "T-Shirts",
        brand: "FASCO",
        price: 28.0,
        oldPrice: 45.0,
        rating: 3,
        reviews: 5,
        colors: [
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L"],
        stock: 22,
        image: IMG.h8,
        gallery: [
            IMG.h6,
            IMG.h1,
            IMG.h10,
        ],
        description:
            "Boxy flap top in a matte black knit. Relaxed fit, dropped shoulder, ribbed trims. Pairs with everything you own.",
        tags: ["T Shirt"],
    },

    {
        id: "p07",
        name: "Checked T-Shirt",
        category: "T-Shirts",
        brand: "FASCO",
        price: 19.9,
        oldPrice: 25.0,
        rating: 4,
        reviews: 9,
        colors: [
            { name: "Navy", hex: "#2c3a55" },
            { name: "Pink", hex: "#e9b8c4" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 26,
        image: IMG.h16,
        gallery: [
            IMG.h4,
            IMG.h13,
            IMG.h5,
        ],
        description:
            "Classic flannel-check tee in a crisp cotton poplin. Pre-shrunk, reinforced collar, available in two season-proof colorways.",
        tags: ["T Shirt", "Flannel"],
    },

    {
        id: "p08",
        name: "Plaided Singlet",
        category: "T-Shirts",
        brand: "FASCO",
        price: 15.0,
        oldPrice: 17.0,
        rating: 4,
        reviews: 6,
        colors: [
            { name: "Multi", hex: "#d8705a" },
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L"],
        stock: 31,
        image: IMG.h17,
        gallery: [
            IMG.h13,
            IMG.h5,
            IMG.h4,
        ],
        description:
            "A light summer singlet with a playful plaid print. Soft jersey, wide armholes, easy layering piece for warm days.",
        tags: ["Tank"],
    },

    {
        id: "p09",
        name: "Modern Black Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 46.0,
        oldPrice: 60.0,
        rating: 5,
        reviews: 14,
        colors: [
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 10,
        image: IMG.h18,
        gallery: [
            IMG.h1,
            IMG.h8,
            IMG.h6,
        ],
        description:
            "An architectural black dress with a sharp neckline and fluid hem. The piece you reach for when the night has plans.",
        tags: ["Dress"],
    },

    {
        id: "p10",
        name: "Suede Black Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 50.0,
        oldPrice: 62.0,
        rating: 4,
        reviews: 7,
        colors: [
            { name: "Black", hex: "#26272c" },
        ],
        sizes: ["S", "M", "L"],
        stock: 8,
        image: IMG.h13,
        gallery: [
            IMG.h8,
            IMG.h1,
            IMG.h11,
        ],
        description:
            "Nubuck-touch black dress with a soft, matte finish. Fitted waist, side slit, fully lined.",
        tags: ["Dress"],
    },

    {
        id: "p11",
        name: "Blue Bodycon Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 42.0,
        rating: 4,
        reviews: 11,
        colors: [
            { name: "Blue", hex: "#3f6fa8" },
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L"],
        stock: 13,
        image: IMG.h12,
        gallery: [
            IMG.h2,
            IMG.h3,
            IMG.h4,
        ],
        description:
            "Second-skin bodycon in a saturated sapphire. Four-way stretch, invisible zip, scuba-weight fabric that recovers.",
        tags: ["Dress"],
    },

    {
        id: "p12",
        name: "Green Velvet Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 38.0,
        oldPrice: 52.0,
        rating: 5,
        reviews: 9,
        colors: [
            { name: "Green", hex: "#3d7a5a" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 6,
        image: IMG.h11,
        gallery: [
            IMG.h3,
            IMG.h2,
            IMG.h9,
        ],
        description:
            "Velour-drape dress in deep emerald. Moves like silk, holds like a sheath. A quiet loud piece.",
        tags: ["Dress"],
    },

    {
        id: "p13",
        name: "Classic Leather Jacket",
        category: "Jackets",
        brand: "Hugo Boss",
        price: 120.0,
        oldPrice: 150.0,
        rating: 5,
        reviews: 24,
        colors: [
            { name: "Black", hex: "#17181c" },
            { name: "Brown", hex: "#6b4a33" },
        ],
        sizes: ["M", "L", "XL"],
        stock: 5,
        image: IMG.h14,
        gallery: [
            IMG.h11,
            IMG.h8,
            IMG.h1,
        ],
        description:
            "Full-grain leather biker with brushed copper hardware. Broken-in feel from day one; gets better for decades.",
        tags: ["Jacket", "Leather"],
    },

    {
        id: "p14",
        name: "Wide Leg Trousers",
        category: "Pants",
        brand: "FASCO",
        price: 36.0,
        rating: 4,
        reviews: 8,
        colors: [
            { name: "Grey", hex: "#9a9da4" },
            { name: "Black", hex: "#1c1d22" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 19,
        image: IMG.h15,
        gallery: [
            IMG.h6,
            IMG.h13,
            IMG.h10,
        ],
        description:
            "High-rise wide legs with a pressed crease that survives a day of movement. Elasticated back waist, side seam pockets.",
        tags: ["Jeanswear"],
    },

    {
        id: "p15",
        name: "City Trench Coat",
        category: "Jackets",
        brand: "Hugo Boss",
        price: 95.0,
        oldPrice: 130.0,
        rating: 4,
        reviews: 13,
        colors: [
            { name: "Camel", hex: "#b98d5f" },
            { name: "Black", hex: "#17181c" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 9,
        image: IMG.h2,
        gallery: [
            IMG.h5,
            IMG.h4,
            IMG.h13,
        ],
        description:
            "The trench, updated: water-repellent cotton twill, storm flap, double vent, detachable belt. Commute-proof.",
        tags: ["Jacket", "Coat"],
    },

    {
        id: "p16",
        name: "Pastel Suit Set",
        category: "Jackets",
        brand: "FASCO",
        price: 68.0,
        oldPrice: 85.0,
        rating: 4,
        reviews: 6,
        colors: [
            { name: "Pink", hex: "#e9b8c4" },
            { name: "Mint", hex: "#bfe3d0" },
        ],
        sizes: ["S", "M", "L"],
        stock: 7,
        image: IMG.h10,
        gallery: [
            IMG.h4,
            IMG.h5,
            IMG.h13,
        ],
        description:
            "Two-piece pastel set — blazer and trousers in a matte suiting wool. Soft shoulder, nipped waist, straight leg.",
        tags: ["Suit"],
    },

    {
        id: "p17",
        name: "Straw Wide Brim Hat",
        category: "Accessories",
        brand: "FASCO",
        price: 22.0,
        rating: 5,
        reviews: 10,
        colors: [
            { name: "Straw", hex: "#cbb389" },
            { name: "Black", hex: "#17181c" },
        ],
        sizes: ["OS"],
        stock: 16,
        image: IMG.h9,
        gallery: [
            IMG.h13,
            IMG.h5,
            IMG.h4,
        ],
        description:
            "Hand-woven straw with a deep brim and a grosgrain band. Packable, foldable, and the best sun tax you'll pay.",
        tags: ["Hat"],
    },

    {
        id: "p18",
        name: "Marine Blazer",
        category: "Jackets",
        brand: "FASCO",
        price: 74.0,
        oldPrice: 90.0,
        rating: 4,
        reviews: 5,
        colors: [
            { name: "Navy", hex: "#23334d" },
            { name: "Grey", hex: "#8f9299" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 12,
        image: IMG.h3,
        gallery: [
            IMG.h12,
            IMG.h4,
            IMG.h5,
        ],
        description:
            "A nautical blazer with a peaked lapel and horn buttons. Fully canvassed, half-lined, cut to be worn open.",
        tags: ["Jacket", "Suit"],
    },
    {
        id: "p19",
        name: "Classic Black Leather Jacket",
        category: "Jackets",
        brand: "FASCO",
        price: 110.0,
        oldPrice: 145.0,
        rating: 5,
        reviews: 12,
        colors: [
            { name: "Black", hex: "#171717" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 10,
        image: IMG.h14,
        gallery: [
            IMG.h14,
            IMG.h11,
            IMG.h8,
        ],
        description:
            "A clean black leather-look jacket with a sharp collar, front zip closure and relaxed structured fit. An easy layering piece for everyday city styling.",
        tags: ["Jacket", "Leather"],
    },

    {
        id: "p20",
        name: "Grey Wide Leg Trousers",
        category: "Pants",
        brand: "FASCO",
        price: 42.0,
        oldPrice: 55.0,
        rating: 5,
        reviews: 15,
        colors: [
            { name: "Grey", hex: "#777980" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 18,
        image: IMG.h15,
        gallery: [
            IMG.h15,
            IMG.h6,
            IMG.h10,
        ],
        description:
            "Tailored grey wide-leg trousers with a clean front, pressed detailing and relaxed silhouette. Designed for polished everyday looks.",
        tags: ["Pants", "Trousers"],
    },

    {
        id: "p21",
        name: "Navy Checked Overshirt",
        category: "T-Shirts",
        brand: "FASCO",
        price: 35.0,
        oldPrice: 48.0,
        rating: 4,
        reviews: 10,
        colors: [
            { name: "Navy", hex: "#26354d" },
            { name: "White", hex: "#f5f5f2" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 16,
        image: IMG.h16,
        gallery: [
            IMG.h16,
            IMG.h4,
            IMG.h13,
        ],
        description:
            "A relaxed navy checked overshirt with short sleeves and button closure. Wear it open over a basic tee or button it up for a clean casual look.",
        tags: ["Shirt", "Checked"],
    },

    {
        id: "p22",
        name: "Urban Layered Casual Set",
        category: "T-Shirts",
        brand: "FASCO",
        price: 49.0,
        oldPrice: 65.0,
        rating: 5,
        reviews: 8,
        colors: [
            { name: "Navy", hex: "#1f2d46" },
            { name: "Denim", hex: "#6e8197" },
        ],
        sizes: ["S", "M", "L"],
        stock: 14,
        image: IMG.h17,
        gallery: [
            IMG.h17,
            IMG.h16,
            IMG.h4,
        ],
        description:
            "A relaxed urban outfit featuring a fitted navy tank, oversized plaid layer and loose denim. Casual proportions designed for effortless street styling.",
        tags: ["Casual", "Denim", "Layering"],
    },

    {
        id: "p23",
        name: "Black Halter Midi Dress",
        category: "Dresses",
        brand: "FASCO",
        price: 58.0,
        oldPrice: 75.0,
        rating: 5,
        reviews: 18,
        colors: [
            { name: "Black", hex: "#111111" },
        ],
        sizes: ["S", "M", "L", "XL"],
        stock: 11,
        image: IMG.h18,
        gallery: [
            IMG.h18,
            IMG.h1,
            IMG.h8,
        ],
        description:
            "A sleek black halter midi dress with a fitted silhouette and elegant neckline. Minimal, timeless and easy to style for evening occasions.",
        tags: ["Dress", "Midi", "Halter"],
    },
];

export const CATEGORIES = [
    "All",
    "Jackets",
    "Dresses",
    "T-Shirts",
    "Pants",
    "Accessories",
];


export const findProduct = (id) =>
    CATALOG.find((product) => product.id === id);

export const related = (id, n = 4) =>
    CATALOG
        .filter((product) => product.id !== id)
        .slice(0, n);