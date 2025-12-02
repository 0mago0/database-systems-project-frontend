import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header, CartPanel, Footer, type CartItem } from "~/components";

interface Order {
  id: string;
  date: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: CartItem[];
}

const statusLabels: Record<Order["status"], { label: string; color: string }> = {
  pending: { label: "待處理", color: "bg-[var(--color-sand)] text-ink" },
  shipped: { label: "已出貨", color: "bg-[var(--color-sage)] text-white" },
  delivered: { label: "已送達", color: "bg-[var(--color-sky)] text-ink" },
  cancelled: { label: "已取消", color: "bg-[var(--color-rose)] text-white" },
};

/**
 * 訂單狀況查詢頁面
 */
export default function Orders() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查登入狀態
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // 加載訂單數據
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (err) {
        console.error("無法加載訂單", err);
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-muted">加載中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <CartPanel
        items={cartItems}
        total={cartTotal}
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <Header
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
        currentPage="orders"
      />

      <div className="flex-1">
        <div className="bg-surface px-20 py-12 text-center border-b border-soft">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold text-ink">我的訂單</h1>
            <p className="text-muted text-sm mt-2">查看和管理你的訂單</p>
          </div>
        </div>

        <div className="bg-canvas px-20 py-8 flex-1">
          <div className="mx-auto max-w-5xl">
            {orders.length === 0 ? (
              <div className="bg-surface rounded-lg shadow p-12 text-center space-y-4">
                <p className="text-muted">尚無訂單</p>
                <Link
                  to="/shop"
                  className="inline-block bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2"
                >
                  繼續購物
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-surface rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="border-b border-soft px-6 py-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-ink">
                          訂單號：{order.id}
                        </p>
                        <p className="text-xs text-muted">{order.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusLabels[order.status].color
                        }`}
                      >
                        {statusLabels[order.status].label}
                      </span>
                    </div>

                    <div className="px-6 py-4 space-y-3">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-ink">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted">
                                數量：{item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-ink">
                              {item.price}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-soft pt-3 flex justify-between items-center text-sm">
                        <span className="font-semibold text-ink">合計：</span>
                        <span className="text-lg font-bold text-[var(--color-rose)]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-soft px-6 py-3 bg-[var(--color-canvas)] flex gap-2">
                      <button className="flex-1 px-4 py-2 border border-[var(--color-rose)] text-[var(--color-rose)] rounded-lg text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]">
                        查看詳情
                      </button>
                      {order.status !== "cancelled" && (
                        <button className="flex-1 px-4 py-2 border border-soft text-ink rounded-lg text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]">
                          追蹤物流
                        </button>
                      )}
                    </div>
                  </div>
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
