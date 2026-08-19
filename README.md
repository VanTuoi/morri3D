# Morri 3D — Hệ Thống Quản Lý Đơn Hàng & Kho Nhựa In 3D

Hệ thống frontend quản lý xưởng in 3D hiện đại, tối ưu cho việc theo dõi đơn hàng, quản lý kho cuộn nhựa (filament), báo cáo tài chính và đồng bộ trực tiếp với Google Sheets qua Google Apps Script.

---

## ✨ Tính Năng Chính

- 📦 **Quản lý đơn hàng (Orders)**: Tạo, cập nhật trạng thái đơn (chờ duyệt, đang in, hoàn tất, giao hàng), theo dõi thông số in và giá trị đơn.
- 🧵 **Quản lý kho nhựa (Inventory)**: Quản lý chi tiết từng cuộn nhựa (chất liệu PLA/PETG/ABS/TPU, hãng, màu sắc, khối lượng còn lại, giá vốn).
- 📊 **Dashboard & Báo cáo**: Tổng quan doanh thu, chi phí vật liệu, thời gian in và tỷ suất lợi nhuận.
- ⚡ **Đồng bộ Google Sheets**: Sử dụng Google Apps Script (GAS) làm serverless backend
- 🔐 **Xác thực Google OAuth**: Đăng nhập bảo mật bằng tài khoản Google, phân quyền theo email.
- 🎨 **Giao diện cao cấp**: Hỗ trợ Dark/Light mode, hiệu ứng kính lỏng (Liquid Glass), hoạt ảnh GSAP và tương thích hoàn toàn trên thiết bị di động.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animation**: [GSAP](https://gsap.com/), [Liquid Glass React](https://github.com/...)
- **State & Forms**: [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Backend & Database**: [Google Apps Script (GAS)](https://developers.google.com/apps-script) + Google Sheets

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Cài đặt thư viện

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ mẫu `.env.example`:

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Google Apps Script Web App URL
VITE_GAS_URL=https://script.google.com/macros/s/your-deployment-id/exec

# Bỏ qua đăng nhập Google khi dev local (true / false)
VITE_BYPASS_AUTH=false

# Bật/tắt banner quảng cáo (tùy chọn)
VITE_ENABLE_ADS=false
```

### 3. Khởi chạy ứng dụng

```bash
# Chạy môi trường phát triển (Dev server)
npm run dev

# Xây dựng bản production
npm run build

# Xem thử bản build production
npm run preview
```

---

## 📁 Cấu Trúc Dự Án

```text
manager-order/
├── src/
│   ├── components/       # Các component UI, layout, modal, thanh điều hướng
│   ├── contexts/         # Context quản lý State toàn cục (Auth, App State...)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Các trang chính: Dashboard, Orders, Inventory, Add...
│   ├── services/         # Tương tác API và kết nối Google Apps Script
│   ├── types/            # Khai báo TypeScript types & interfaces
│   └── utils/            # Tiện ích định dạng tiền tệ, ngày tháng, tính toán
├── public/               # Tài nguyên tĩnh (logo, favicon, icons)
├── .env.example          # File mẫu cấu hình môi trường
├── package.json
└── vite.config.ts
```

---

## 📜 Các Lệnh Scripts Hỗ Trợ

| Lệnh                 | Mô tả                                                       |
| :------------------- | :---------------------------------------------------------- |
| `npm run dev`        | Khởi động Vite dev server trên mạng local                   |
| `npm run build`      | Kiểm tra kiểu dữ liệu TypeScript và build production bundle |
| `npm run lint:fix`   | Tự động quét và sửa các lỗi ESLint                          |
| `npm run format:fix` | Định dạng code chuẩn bằng Prettier                          |
