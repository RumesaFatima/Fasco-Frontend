import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CATALOG, findProduct, money } from "../lib/data";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import {
  CardIc,
  CheckIc,
  CompareIc,
  Crumbs,
  EyeIc,
  HelpIc,
  LockIc,
  Qty,
  Reveal,
  ShareIc,
  Stars,
  Countdown,
} from "../components/ui";
import {
  Features,
  Newsletter,
  PeakyBanner,
} from "../components/Sections";
import {
  createReview,
  getProductReviews,
} from "../services/reviewApi";

export default function ProductPage() {
  const { id } = useParams();
  const p = findProduct(id || "");
  const { add, setDrawer, toast } = useStore();

  const [img, setImg] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQtyV] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    setImg(p?.image ?? "");
    setSize(p?.sizes?.[0] ?? "");
    setColor(p?.colors?.[0]?.name ?? "");
    setQtyV(1);
  }, [id, p]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getProductReviews(id);

        if (data?.success) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Reviews load error:", error);
        setReviews([]);
      }
    };

    if (id) {
      loadReviews();
    }
  }, [id]);

  if (!p) {
    return (
      <div className="py-32 text-center">
        <p className="font-serif text-3xl">
          Product not found
        </p>

        <Link
          to="/shop"
          className="btn-dark mt-6 px-8 py-3"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const save = p.oldPrice
    ? Math.round((1 - p.price / p.oldPrice) * 100)
    : 0;

  const fmt = (d) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const d1 = new Date(Date.now() + 10 * 864e5);
  const d2 = new Date(Date.now() + 28 * 864e5);

  const relatedList = [
    ...CATALOG.filter(
      (x) =>
        x.id !== p.id &&
        x.category === p.category
    ),
    ...CATALOG.filter(
      (x) =>
        x.id !== p.id &&
        x.category !== p.category
    ),
  ].slice(0, 4);

  const addToCart = () => {
    add(p.id, size, color, qty);
    setDrawer(true);
    toast(`Added “${p.name}” to cart`);
  };

  const submitReview = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast("Please login to write a review");
      return;
    }

    if (!reviewComment.trim()) {
      toast("Please write your review");
      return;
    }

    try {
      setReviewLoading(true);

      const data = await createReview({
        productId: p.id,
        productName: p.name,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (data?.success) {
        setReviews((current) => [
          data.review,
          ...current,
        ]);

        setReviewComment("");
        setReviewRating(5);

        toast("Review submitted successfully");
      }
    } catch (error) {
      toast(
        error.message ||
        "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-1280px px-5 pt-10">
        <Crumbs
          items={[
            ["Home", "/"],
            ["Shop", "/shop"],
            [p.name],
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {p.gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setImg(g)}
                  className={`overflow-hidden border-2 transition-all ${img === g
                      ? "border-ink"
                      : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={g}
                    alt=""
                    className="h-20 w-16 object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden bg-[#f4f4f6]">
              <img
                key={img}
                src={img}
                alt={p.name}
                className="aspect-3/4 w-full object-cover"
                style={{
                  animation:
                    "heroFade .5s both",
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mute">
              {p.brand}
            </p>

            <h1 className="mt-2 font-serif text-3xl md:text-4xl">
              {p.name}
            </h1>

            <div className="mt-3">
              <Stars
                n={p.rating}
                count={reviews.length || p.reviews}
                className="h-4 w-4"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="font-serif text-2xl">
                {money(p.price)}
              </span>

              {p.oldPrice && (
                <>
                  <s className="text-mute">
                    {money(p.oldPrice)}
                  </s>

                  <span className="rounded-full bg-pop px-3 py-1 text-[10px] font-medium tracking-widest text-white">
                    SAVE {save}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-mute">
              <EyeIc className="h-4 w-4" />
              24 people are viewing this right now
            </p>

            {p.oldPrice && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f3c9c5] bg-[#fdeeee] px-5 py-4">
                <span className="text-sm font-medium text-pop">
                  Hurry up! Sale ends in
                </span>

                <Countdown
                  boxed={false}
                  seconds={
                    5 * 3600 +
                    59 * 60 +
                    47
                  }
                />
              </div>
            )}

            <div className="mt-5">
              <p className="text-sm">
                Only <strong>{p.stock}</strong>{" "}
                item(s) left in stock
              </p>

              <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded bg-line">
                <div
                  className="h-full bg-pop"
                  style={{
                    width: `${Math.min(
                      100,
                      (p.stock / 30) *
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium">
                Size: {size}
              </p>

              <div className="mt-3 flex gap-2.5">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSize(s)
                    }
                    className={`h-11 min-w-11 rounded-lg border px-3 text-sm transition-all ${size === s
                        ? "border-ink bg-ink text-white"
                        : "border-line text-gray-600 hover:border-ink"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-medium">
                Color: {color}
              </p>

              <div className="mt-3 flex gap-3">
                {p.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() =>
                      setColor(c.name)
                    }
                    className={`h-9 w-9 rounded-full transition-transform hover:scale-110 ${color === c.name
                        ? "ring-2 ring-ink ring-offset-3"
                        : "border border-black/10"
                      }`}
                    style={{
                      background: c.hex,
                    }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div>
                <p className="mb-2 text-sm font-medium">
                  Quantity
                </p>

                <Qty
                  value={qty}
                  onChange={setQtyV}
                />
              </div>

              <button
                onClick={addToCart}
                className="btn-outline flex-1 py-[18px] text-sm tracking-[0.12em]"
              >
                Add to Cart
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-b border-line pb-6 text-sm text-gray-600">
              <button
                onClick={() =>
                  toast("Added to compare")
                }
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <CompareIc className="h-4 w-4" />
                Compare
              </button>

              <button
                onClick={() =>
                  toast(
                    "Our team will answer you"
                  )
                }
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <HelpIc className="h-4 w-4" />
                Add a question
              </button>

              <button
                onClick={() =>
                  toast("Share link copied")
                }
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <ShareIc className="h-4 w-4" />
                Share
              </button>
            </div>

            <div className="mt-6 rounded-lg bg-[#f6f6f8] p-5 text-sm">
              <p className="flex flex-wrap gap-2">
                <CardIc className="h-4 w-4" />

                <span>
                  <strong>
                    Estimated Delivery:
                  </strong>{" "}
                  {fmt(d1)} - {fmt(d2)}
                </span>
              </p>

              <p className="mt-2.5 flex flex-wrap gap-2">
                <CheckIc className="h-4 w-4" />

                <span>
                  <strong>
                    Free Shipping & Returns:
                  </strong>{" "}
                  On all orders over $75
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 rounded-lg bg-[#f6f6f8] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <span className="rounded bg-white px-2.5 py-1.5 text-[10px] font-bold italic text-[#1a1f71] shadow-sm">
                  VISA
                </span>

                <span className="grid h-7 w-9 place-items-center rounded bg-white shadow-sm">
                  <span className="relative flex">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#eb001b]" />
                    <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-90" />
                  </span>
                </span>

                <span className="rounded bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#2e77bc] shadow-sm">
                  AMEX
                </span>

                <span className="rounded bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-700 shadow-sm">
                  G Pay
                </span>

                <span className="rounded bg-white px-2.5 py-1.5 text-[10px] font-semibold text-gray-800 shadow-sm">
                  Pay
                </span>
              </div>

              <p className="flex items-center gap-2 text-xs text-mute">
                <LockIc className="h-3.5 w-3.5" />
                Guaranteed safe & secure
                checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <PeakyBanner />
      </div>

      <Features />

      <section className="mx-auto max-w-1280px px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <Reveal>
            <div>
              <h2 className="font-serif text-3xl">
                Customer Reviews
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-mute">
                See what customers think about
                this product.
              </p>

              <div className="mt-6">
                <p className="font-serif text-4xl">
                  {reviews.length}
                </p>

                <p className="mt-1 text-xs text-mute">
                  Verified reviews
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <form
              onSubmit={submitReview}
              className="border border-line p-6"
            >
              <h3 className="font-serif text-xl">
                Write a Review
              </h3>

              <div className="mt-5">
                <p className="text-xs font-medium">
                  Your Rating
                </p>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewRating(
                            star
                          )
                        }
                        className={`text-2xl transition ${star <=
                            reviewRating
                            ? "text-black"
                            : "text-gray-300"
                          }`}
                        aria-label={`${star} star`}
                      >
                        ★
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="review"
                  className="text-xs font-medium"
                >
                  Your Review
                </label>

                <textarea
                  id="review"
                  value={reviewComment}
                  onChange={(event) =>
                    setReviewComment(
                      event.target.value
                    )
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="Share your experience with this product..."
                  className="mt-2 w-full resize-none border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="btn-dark mt-5 px-8 py-3 text-xs tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewLoading
                  ? "SUBMITTING..."
                  : "SUBMIT REVIEW"}
              </button>
            </form>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {reviews.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-serif text-xl">
                    No reviews yet
                  </p>

                  <p className="mt-2 text-sm text-mute">
                    Be the first to review
                    this product.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={
                      review._id ||
                      `${review.userId}-${review.createdAt}`
                    }
                    className="py-6"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <p className="text-sm font-medium">
                          {review.customerName ||
                            review.userName ||
                            "Customer"}
                        </p>

                        <p className="mt-1 text-xs text-mute">
                          {review.createdAt
                            ? new Date(
                              review.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                            : ""}
                        </p>
                      </div>

                      <div className="text-sm tracking-wide">
                        {"★".repeat(
                          Math.min(
                            Number(
                              review.rating
                            ) || 0,
                            5
                          )
                        )}
                        {"☆".repeat(
                          Math.max(
                            0,
                            5 -
                            (Number(
                              review.rating
                            ) || 0)
                          )
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-1280px px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <Reveal>
            <div>
              <h2 className="font-serif text-3xl">
                People Also Loved
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-mute">
                Pieces our customers grabbed while
                they had this one in the bag — you
                might too.
              </p>

              <Link
                to="/shop"
                className="btn-dark mt-6 px-8 py-3"
              >
                Buy Now
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {relatedList.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}