import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Header, Footer } from "~/components";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "請輸入電子郵件";
    }

    if (!formData.password.trim()) {
      newErrors.password = "請輸入密碼";
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
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setErrors({ password: "郵件或密碼錯誤" });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
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
            <h1 className="text-3xl font-bold text-slate-900">登入帳戶</h1>
            <p className="text-slate-600">歡迎回到 NFan Store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "登入中..." : "登入"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            還沒有帳戶？{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              立即註冊
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
