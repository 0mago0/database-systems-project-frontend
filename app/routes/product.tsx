import { useState } from "react";
import { Header, CartPanel, Footer, type CartItem } from "~/components";
import { useCart } from "~/context/CartContext";

// 相關商品推薦
const related = [
  { id: 1, swatch: "bg-[var(--color-rose)]", name: "同角色手辦", desc: "官方授權", price: "$45.99" },
  { id: 2, swatch: "bg-[var(--color-ash)]", name: "周邊套組", desc: "優惠組合", price: "$69.99" },
  { id: 3, swatch: "bg-[var(--color-sage)]", name: "限量周邊", desc: "僅剩 5 件", price: "$89.99" },
];

// 相關產品卡片組件
function RelatedProductCard({ 
  product, 
  onAddToCart 
}: { 
  product: typeof related[0],
  onAddToCart: () => void 
}) {
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <article 
      className="space-y-2 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--color-rose)] focus-within:ring-offset-2 bg-surface"
    >
      <div 
        className={`h-16 rounded-md ${product.swatch} transition-transform duration-300 hover:scale-105`} 
        aria-hidden="true"
      />
      <div className="space-y-2 px-2">
        <div className="space-y-0.5 text-sm text-ink">
          <h4 className="font-semibold line-clamp-1">{product.name}</h4>
          <p className="text-xs text-muted line-clamp-1">{product.desc}</p>
          <p className="font-bold text-[var(--color-rose)] text-xs">{product.price}</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            onAddToCart();
            setTimeout(() => setIsAdding(false), 500);
          }}
          disabled={isAdding}
          className={`w-full rounded text-xs font-semibold py-1 transition-all duration-300 ${
            isAdding 
              ? 'bg-[var(--color-primary)] text-white scale-95' 
              : 'border border-[var(--color-rose)] text-[var(--color-rose)] hover:bg-[var(--color-canvas)] active:scale-95'
          } disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2`}
          aria-label={`將 ${product.name} 加入購物車`}
        >
          {isAdding ? '加入中...' : '加入'}
        </button>
      </div>
    </article>
  );
}

export default function Product() {
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
        currentPage="product"
      />

      {/* 主要內容 */}
      <div className="flex-1 bg-surface">
        <div className="mx-auto max-w-5xl grid gap-8 px-10 pb-10 pt-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-bold text-[var(--color-rose)] tracking-widest">精選周邊</p>
            <div className="h-72 rounded-lg bg-[var(--color-sage)] shadow-lg" aria-hidden />
            <div className="grid grid-cols-4 gap-2">
              {["bg-[var(--color-plum)]", "bg-[var(--color-ash)]", "bg-[var(--color-sky)]", "bg-[var(--color-rose)]"].map((color, i) => (
                <button
                  key={color}
                  className={`h-16 rounded-md ${color} hover:ring-2 hover:ring-[var(--color-rose)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]`}
                  aria-label={`圖片 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-[var(--color-rose)] tracking-widest">角色周邊</p>
              <h2 className="text-3xl font-bold text-ink mt-2">限量版手辦模型</h2>
              <p className="text-sm text-muted mt-2">高精度細節刻畫，官方授權正版周邊</p>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold text-ink">$34.99</p>
              <div className="flex items-center gap-2">
                <span className="text-sm">★★★★★</span>
                <span className="text-sm text-muted">(256 條評論)</span>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              官方授權的限量版手辦，精細的工藝製作，每一個細節都精心設計。適合收藏愛好者，是你收集 IP 周邊的最佳選擇。
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="size" className="text-sm font-semibold text-ink">
                  規格
                </label>
                <select
                  id="size"
                  className="w-full mt-2 px-4 py-2 border border-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] text-sm bg-white"
                >
                  <option>選擇規格...</option>
                  <option>小型 (10cm)</option>
                  <option>標準型 (15cm)</option>
                  <option>豪華型 (20cm)</option>
                  <option>收藏版 (25cm)</option>
                </select>
              </div>

              <div>
                <label htmlFor="color" className="text-sm font-semibold text-ink">
                  配色
                </label>
                <div className="flex gap-3 mt-2">
                  {['bg-[var(--color-rose)]', 'bg-[var(--color-ash)]', 'bg-[var(--color-sand)]', 'bg-[var(--color-sky)]'].map((color, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} hover:ring-2 hover:ring-[var(--color-rose)] ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2`}
                      aria-label={`配色選項 ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="text-sm font-semibold text-ink">
                  數量
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <button className="px-3 py-2 border border-soft rounded-lg hover:bg-[var(--color-canvas)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]">-</button>
                  <input 
                    id="quantity"
                    type="number" 
                    defaultValue="1" 
                    className="w-12 text-center border border-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] bg-white"
                    min="1"
                  />
                  <button className="px-3 py-2 border border-soft rounded-lg hover:bg-[var(--color-canvas)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]">+</button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                addToCart({ id: 1, name: '限量版手辦模型', price: '$34.99' });
              }}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2"
            >
              加入購物車
            </button>

            <button className="w-full border border-[var(--color-rose)] text-[var(--color-rose)] py-3 rounded-lg font-semibold hover:bg-[var(--color-canvas)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2">
              收藏
            </button>

            <p className="text-xs text-muted pt-2">
              ✓ 免運費 (滿 $50)<br/>
              ✓ 30 天內無條件退貨<br/>
              ✓ 正品保證
            </p>
          </div>
        </div>

        {/* 產品規格 */}
        <div className="mx-auto max-w-5xl border-t border-soft px-10 py-8">
          <h3 className="text-lg font-bold text-ink">產品詳情</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">材質</p>
              <p className="text-sm text-muted">高級 PVC + 布料</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">尺寸</p>
              <p className="text-sm text-muted">10cm - 25cm 多款</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">製造商</p>
              <p className="text-sm text-muted">官方授權正版</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">認證</p>
              <p className="text-sm text-muted">國際正品認證</p>
            </div>
          </div>
        </div>

        {/* 相關推薦 */}
        <div className="mx-auto max-w-5xl border-t border-soft px-10 py-8">
          <h3 className="text-lg font-bold text-ink">完美搭配</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <RelatedProductCard 
                key={item.id} 
                product={item}
                onAddToCart={() => addToCart(item)}
              />
            ))}
          </div>
        </div>

        {/* 評論區 */}
        <div className="mx-auto max-w-5xl border-t border-soft px-10 py-8">
          <h3 className="text-lg font-bold text-ink">客戶評論</h3>
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-soft rounded-lg p-4 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">客戶 {i + 1}</p>
                    <p className="text-xs text-muted">已購買</p>
                  </div>
                  <span className="text-sm">★★★★★</span>
                </div>
                <p className="text-sm text-muted">非常滿意這個周邊，質感很好，細節精美。強烈推薦！</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer 覆蓋滿版 */}
      <Footer />
    </div>
  );
}
