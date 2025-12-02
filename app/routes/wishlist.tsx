import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header, CartPanel, Footer } from "~/components";
import { useCart } from "~/context/CartContext";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  desc: string;
  color: string;
}

/**
 * 收藏／願望清單頁面
 */
export default function Wishlist() {
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cartItems, addToCart, updateQuantity, removeItem, cartTotal, cartCount } = useCart();

  useEffect(() => {
    // 檢查登入狀態
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // 加載願望清單數據
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (err) {
        console.error("無法加載願望清單", err);
      }
    }

    // 示例願望清單項目
    if (!savedWishlist) {
      const defaultWishlist: WishlistItem[] = [
        {
          id: 1,
          name: "限量版手辦模型",
          price: "$34.99",
          desc: "高精度細節刻畫",
          color: "bg-purple-400",
        },
        {
          id: 2,
          name: "角色抱枕",
          price: "$49.99",
          desc: "舒適絨面材質",
          color: "bg-indigo-400",
        },
        {
          id: 3,
          name: "周邊掛件",
          price: "$12.99",
          desc: "便攜式鑰匙鍊",
          color: "bg-violet-400",
        },
      ];
      setWishlist(defaultWishlist);
    }

    setIsLoading(false);
  }, [navigate]);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">加載中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <CartPanel
        items={cartItems}
        total={cartTotal}
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      <Header
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
        currentPage="wishlist"
      />

      <div className="flex-1">
        <div className="bg-white px-20 py-12 text-center border-b border-slate-200">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold text-slate-900">我的收藏</h1>
            <p className="text-slate-600 text-sm mt-2">保存你最喜歡的周邊商品</p>
          </div>
        </div>

        <div className="bg-slate-100 px-20 py-8 flex-1">
          <div className="mx-auto max-w-5xl">
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center space-y-4">
                <p className="text-slate-600">願望清單是空的</p>
                <Link
                  to="/shop"
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                >
                  瀏覽商品
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {wishlist.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-lg overflow-hidden shadow transition-all duration-300 hover:shadow-lg"
                  >
                    <div
                      className={`h-40 ${item.color} transition-transform duration-300 group-hover:scale-105`}
                      aria-hidden="true"
                    />
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {item.desc}
                        </p>
                        <p className="font-bold text-indigo-600 text-sm pt-1">
                          {item.price}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                        >
                          加入購物車
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="w-full border border-slate-300 text-slate-600 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
