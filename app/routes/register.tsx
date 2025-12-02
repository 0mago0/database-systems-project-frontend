import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Header, Footer } from "~/components";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "請輸入用戶名稱";
    } else if (formData.username.length < 3) {
      newErrors.username = "用戶名稱至少 3 個字符";
    }

    if (!formData.email.trim()) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件";
    }

    if (!formData.password.trim()) {
      newErrors.password = "請輸入密碼";
    } else if (formData.password.length < 6) {
      newErrors.password = "密碼至少 6 個字符";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "密碼不相符";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // 模擬 API 調用
    setTimeout(() => {
      // 保存到 localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (u: any) => u.email === formData.email || u.username === formData.username
      );

      if (existingUser) {
        setErrors({ email: "該用戶名或郵件已被註冊" });
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <Header cartCount={0} onCartOpen={() => {}} currentPage="home" />

      <div className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-10 py-12">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-slate-900">建立帳戶</h1>
            <p className="text-slate-600">加入 NFan Store 開始購物</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-semibold text-slate-900">
                用戶名稱
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  errors.username ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="輸入用戶名稱"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-slate-900">
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="輸入郵件地址"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-slate-900">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  errors.password ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="輸入密碼"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  errors.confirmPassword ? "border-red-500" : "border-slate-300"
                }`}
                placeholder="確認密碼"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "註冊中..." : "註冊"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            已有帳戶？{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              立即登入
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
