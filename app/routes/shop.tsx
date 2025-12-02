import type { Route } from "./+types/shop";
import { useState } from "react";
import { Header, CartPanel, Footer, type CartItem } from "~/components";
import { useCart } from "~/context/CartContext";

// 購物頻道商品
const gridProducts = [
  { id: 1, color: "bg-[var(--color-ash)]", name: "動漫手辦", desc: "精美收藏品", price: "$34.99" },
  { id: 2, color: "bg-[var(--color-sand)]", name: "角色抱枕", desc: "舒適質感", price: "$49.99" },
  { id: 3, color: "bg-[var(--color-rose)]", name: "周邊掛件", desc: "便攜鑰匙鍊", price: "$12.99" },
  { id: 4, color: "bg-[var(--color-plum)]", name: "周邊襯衫", desc: "角色印花", price: "$29.99" },
  { id: 5, color: "bg-[var(--color-accent-soft)]", name: "收藏盒", desc: "精緻禮盒", price: "$19.99" },
  { id: 6, color: "bg-[var(--color-sky)]", name: "簽名版周邊", desc: "限量簽名", price: "$99.99" },
  { id: 7, color: "bg-[var(--color-sage)]", name: "海報版畫", desc: "高品質印刷", price: "$15.99" },
  { id: 8, color: "bg-[var(--color-ash)]", name: "周邊徽章", desc: "繽紛多款", price: "$8.99" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "周邊商城 - NFan Store" },
    {
      name: "description",
      content: "瀏覽我們的 IP 周邊商品，精選動漫、遊戲、影視周邊，享受便利購物。",
    },
  ];
}

// 產品卡片組件
function ProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: typeof gridProducts[0], 
  onAddToCart: () => void 
}) {
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <article 
      className="group space-y-3 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 focus-within:ring-2 focus-within:ring-[var(--color-rose)] focus-within:ring-offset-2 bg-surface"
    >
      <div 
        className={`h-36 ${product.color} transition-colors duration-300 bg-cover bg-center`} 
        aria-hidden="true"
      />
      <div className="space-y-2 px-3 pb-3">
        <div className="space-y-1 text-sm text-ink">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted line-clamp-2">{product.desc}</p>
          <p className="font-bold text-[var(--color-rose)]">{product.price}</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            onAddToCart();
            setTimeout(() => setIsAdding(false), 500);
          }}
          disabled={isAdding}
          className={`w-full rounded-md px-3 py-2 text-xs font-semibold text-white transition-all duration-300 ${
            isAdding 
              ? 'bg-[var(--color-primary)] scale-95' 
              : 'bg-[var(--color-primary)] hover:opacity-90 active:scale-95'
          } disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2`}
          aria-label={`將 ${product.name} 加入購物車`}
        >
          {isAdding ? '加入中...' : '加入購物車'}
        </button>
      </div>
    </article>
  );
}

export default function Shop() {
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
        currentPage="shop"
      />

      {/* 主要內容 */}
      <div className="flex-1">
        <div className="w-full bg-[var(--color-accent-soft)] px-10 py-12 text-center text-white">
          <div className="mx-auto max-w-5xl space-y-2">
            <h2 className="text-3xl font-bold">周邊商城</h2>
            <p className="text-sm text-white/90">
              發現最新的 IP 周邊，收集你最愛的角色商品
            </p>
          </div>
        </div>

        <div className="bg-surface px-10 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-4">
              {gridProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer 覆蓋滿版 */}
      <Footer />
    </div>
  );
}
