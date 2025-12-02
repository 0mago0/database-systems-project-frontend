import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Header, CartPanel, Footer, Carousel, type CarouselItem } from "~/components";
import { useCart } from "~/context/CartContext";
import { useState } from "react";

// 輪播數據
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: "",
    title: "最新 IP 周邊",
    subtitle: "獨家限量商品現已上市",
    gradient: "bg-[var(--color-accent-soft)]",
  },
  {
    id: 2,
    image: "",
    title: "人氣角色周邊",
    subtitle: "收集你最愛的 IP 形象",
    gradient: "bg-[var(--color-rose)]",
  },
  {
    id: 3,
    image: "",
    title: "限時閃促",
    subtitle: "精選周邊商品 5 折起",
    gradient: "bg-[var(--color-plum)]",
  },
  {
    id: 4,
    image: "",
    title: "會員獨享",
    subtitle: "加入會員得 VIP 購物優惠",
    gradient: "bg-[var(--color-sand)]",
  },
];

// 新上架商品
const arrivals = [
  { id: 1, name: "動漫手辦", desc: "高精度細節刻畫", price: "$34.99", swatch: "bg-[var(--color-rose)]" },
  { id: 2, name: "周邊掛件", desc: "便攜式鑰匙鍊", price: "$12.99", swatch: "bg-[var(--color-sand)]" },
  { id: 3, name: "角色抱枕", desc: "舒適絨面材質", price: "$49.99", swatch: "bg-[var(--color-plum)]" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IP 周邊購物系統 - NFan Store" },
    {
      name: "description",
      content: "發現最新的 IP 周邊商品，收集你最愛的動漫、遊戲、影視周邊。",
    },
  ];
}

// 新上架商品卡片組件
function ArrivalCard({ product }: { product: typeof arrivals[0] }) {
  return (
    <article 
      className="group rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-rose)] focus-within:ring-offset-2 bg-surface"
    >
      <Link
        to="/product"
        className="w-full space-y-3 text-left focus:outline-none block"
        aria-label={`查看 ${product.name} 的詳細資訊，${product.desc}`}
      >
        <div 
          className={`h-52 rounded-md ${product.swatch} transition-transform duration-300 group-hover:scale-105`} 
          aria-hidden="true"
        />
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-ink">{product.name}</p>
          <p className="text-muted">{product.desc}</p>
          <p className="font-bold text-[var(--color-rose)] pt-1">{product.price}</p>
        </div>
      </Link>
    </article>
  );
}

export default function Home() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeItem, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <CartPanel 
        items={cartItems} 
        total={cartTotal} 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Header 覆蓋滿版 */}
      <Header 
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
        currentPage="home"
      />

      {/* 主要內容 */}
      <div className="flex-1">
        {/* 輪播區域 */}
        <Carousel items={carouselItems} autoPlay={true} interval={5000} />

        {/* 新上架商品 */}
        <section className="bg-surface px-10 pb-10 pt-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-ink">最新周邊</h2>
            <p className="text-muted text-sm mt-2">最熱門的 IP 周邊商品</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {arrivals.map((item) => (
                <ArrivalCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer 覆蓋滿版 */}
      <Footer />
    </div>
  );
}
