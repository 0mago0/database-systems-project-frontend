# Shop Website Project
Demo Video: https://youtu.be/ETT7GuwoKHw
這是一個基於 Vue 3 和 Express 的全端電商網站專案。

## 專案結構

本專案分為前端與後端兩個部分：

- **前端 (Frontend)**: 位於專案根目錄，使用 Vue 3 + Vite 建置。
- **後端 (Backend)**: 位於 `backend/` 目錄，使用 Node.js + Express 建置。

## 技術棧 (Tech Stack)

### 前端 (Frontend)
- **框架**: Vue 3
- **建置工具**: Vite
- **UI 庫**: Vuetify, Tailwind CSS
- **路由**: Vue Router
- **HTTP 客戶端**: Axios
- **其他**: Swiper (輪播圖), Vue3-cookies, JWT Decode

### 後端 (Backend)
- **執行環境**: Node.js
- **框架**: Express.js
- **資料庫**: PostgreSQL
- **驗證**: JSON Web Token (JWT)
- **工具**: Nodemon (開發環境), Dotenv (環境變數)

## 安裝與設定 (Installation & Setup)

### 前置需求
- Node.js (建議 v16 或以上)
- PostgreSQL 資料庫

### 1. 資料庫設定
請確保您已安裝 PostgreSQL 並建立資料庫。
您可以使用 `backend/db/` 或 `database/` 目錄下的 SQL 檔案來初始化資料庫結構。

### 2. 後端設定 (Backend Setup)

進入後端目錄並安裝依賴：

```bash
cd backend
npm install
```

設定環境變數：
在 `backend/` 目錄下建立 `.env` 檔案，並填入以下設定 (請依實際情況修改)：

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

啟動後端伺服器：

```bash
# 開發模式 (使用 nodemon)
npm run dev

# 生產模式
npm start
```

後端預設運行於 `http://localhost:3000`。

### 3. 前端設定 (Frontend Setup)

回到專案根目錄並安裝依賴：

```bash
# 如果您還在 backend 目錄
cd ..

npm install
```

啟動前端開發伺服器：

```bash
npm run dev
```

前端預設運行於 `http://localhost:5173` (Vite 預設埠號)。

## 腳本說明 (Scripts)

### 前端 (Root Directory)
- `npm run dev`: 啟動開發伺服器
- `npm run build`: 建置生產環境版本
- `npm run preview`: 預覽建置後的版本
- `npm run lint`: 執行 ESLint 程式碼檢查

### 後端 (Backend Directory)
- `npm run dev`: 使用 Nodemon 啟動開發伺服器 (支援熱重載)
- `npm start`: 啟動伺服器

## 目錄結構說明

```
shopwebsite/
├── backend/                # 後端程式碼
│   ├── db/                 # 資料庫備份/腳本
│   ├── middleware/         # Express 中介軟體
│   ├── routes/             # API 路由
│   ├── util/               # 工具函式 (如資料庫連線)
│   └── app.js              # 後端進入點
├── src/                    # 前端原始碼
│   ├── assets/             # 靜態資源 (圖片等)
│   ├── components/         # Vue 元件
│   ├── router/             # Vue Router 設定
│   ├── views/              # 頁面元件
│   ├── App.vue             # 主應用元件
│   └── main.js             # 前端進入點
├── public/                 # 公開靜態檔案
├── index.html              # 前端 HTML 入口
└── ...設定檔 (vite.config.js, tailwind.config.js 等)
```
