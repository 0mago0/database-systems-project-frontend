import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shop", "routes/shop.tsx"),
  route("product", "routes/product.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  route("orders", "routes/orders.tsx"),
  route("wishlist", "routes/wishlist.tsx"),
] satisfies RouteConfig;
