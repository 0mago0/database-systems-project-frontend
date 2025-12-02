import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  currentPage: "home" | "shop" | "product" | "register" | "login" | "orders" | "wishlist";
}

/**
 * 主導航欄元件
 * 包含品牌 logo、導航連結、用戶菜單和購物車按鈕
 */
export function Header({ cartCount, onCartOpen, currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      try {
        setUser(JSON.parse(currentUserData));
      } catch (err) {
        console.error("無法解析用戶數據", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setShowUserMenu(false);
    navigate("/");
  };

  const isActive = (page: string) =>
    currentPage === page
      ? "text-sm font-semibold text-indigo-600"
      : "text-sm text-slate-700 hover:text-slate-900 transition-colors";

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex items-center justify-between px-20 py-6">
        <Link
          to="/"
          className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-2 py-1"
          aria-label="NFan Store 首頁 - IP 周邊購物系統"
        >
          NFan Store
        </Link>
        <nav className="flex items-center gap-7">
          <Link
            to="/"
            className={`${isActive("home")} focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-2 py-1`}
          >
            首頁
          </Link>
          <Link
            to="/shop"
            className={`${isActive("shop")} focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-2 py-1`}
          >
            商城
          </Link>
          <Link
            to="/product"
            className={`${isActive("product")} focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-2 py-1`}
          >
            周邊
          </Link>

          {/* 用戶菜單 */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-sm text-slate-700 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-2 py-1"
              aria-label="用戶菜單"
              aria-expanded={showUserMenu}
            >
              {user ? user.username : "帳戶"}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-slate-600">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的訂單
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      我的收藏
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors border-t border-slate-200"
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      登入
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors border-t border-slate-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      註冊
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onCartOpen}
            className="relative rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
            aria-label={`購物車，共 ${cartCount} 件商品`}
          >
            購物車
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
