/**
 * 頁腳元件
 * 包含品牌信息、社交媒體連結和導航連結
 */
export function Footer() {
  return (
    <footer className="border-t border-soft px-20 py-10 bg-surface text-ink">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <p className="text-sm font-bold text-ink">NFan Store</p>
          <p className="text-xs text-muted">您的 IP 周邊一站式購物平台</p>
          <div className="flex gap-3">
            <a
              href="#"
              className="h-5 w-5 rounded-full bg-[var(--color-rose)] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
              aria-label="Facebook"
            />
            <a
              href="#"
              className="h-5 w-5 rounded-full bg-[var(--color-sand)] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
              aria-label="Instagram"
            />
            <a
              href="#"
              className="h-5 w-5 rounded-full bg-[var(--color-accent-soft)] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
              aria-label="Twitter / X"
            />
            <a
              href="#"
              className="h-5 w-5 rounded-full bg-[var(--color-primary)] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
              aria-label="YouTube"
            />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 text-sm text-muted">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <p className="font-bold text-ink">
                {i === 0 ? '購物服務' : i === 1 ? '關於我們' : '幫助中心'}
              </p>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="block hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] rounded"
                >
                  {i === 0 ? '訂單查詢' : i === 1 ? '公司簡介' : '聯絡我們'}
                </a>
                <a
                  href="#"
                  className="block hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] rounded"
                >
                  {i === 0 ? '配送說明' : i === 1 ? '招聘信息' : '常見問題'}
                </a>
                <a
                  href="#"
                  className="block hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] rounded"
                >
                  {i === 0 ? '退貨政策' : i === 1 ? '新聞中心' : '會員中心'}
                </a>
                <a
                  href="#"
                  className="block hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)] rounded"
                >
                  {i === 0 ? '售後服務' : i === 1 ? '合作夥伴' : '用戶協議'}
                </a>
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-soft mt-8 pt-8 text-center text-xs text-muted">
        <p>&copy; 2025 NFan Store. 保留所有權利。您值得最好的 IP 周邊體驗。</p>
      </div>
    </footer>
  );
}
