// 購物車項目類型
export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface CartPanelProps {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemoveItem?: (id: number) => void;
  onCheckout?: () => void;
}

/**
 * 購物車面板元件
 * 顯示購物車內容、數量調整、移除項目和結帳
 */
export function CartPanel({ 
  items, 
  total, 
  isOpen, 
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
        role="presentation"
      />
      {/* 購物車面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface shadow-lg z-50 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-soft">
          <h2 className="text-lg font-semibold text-ink">購物車</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--color-canvas)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
            aria-label="關閉購物車"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted py-8">購物車是空的</p>
          ) : (
            items.map((item) => {
              const price = parseFloat(item.price.replace('$', ''));
              const itemTotal = (price * item.quantity).toFixed(2);
              
              return (
                <div
                  key={item.id}
                  className="pb-4 border-b border-soft space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-ink">{item.name}</p>
                      <p className="text-xs text-muted">{item.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem?.(item.id)}
                      className="text-muted hover:text-[var(--color-rose)] transition-colors text-sm font-semibold"
                      aria-label={`移除 ${item.name}`}
                    >
                      移除
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border border-soft rounded hover:bg-[var(--color-canvas)] transition-colors text-sm"
                        aria-label="減少數量"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-soft rounded hover:bg-[var(--color-canvas)] transition-colors text-sm"
                        aria-label="增加數量"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-sm">${itemTotal}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="border-t border-soft px-6 py-4 space-y-4 bg-[var(--color-canvas)]">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>合計:</span>
            <span className="text-[var(--color-rose)]">${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            結帳
          </button>
        </footer>
      </div>
    </>
  );
}
