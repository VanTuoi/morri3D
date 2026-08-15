# Dự án Vite với Tailwind CSS

Dự án frontend được xây dựng bằng Vite, React, TypeScript và Tailwind CSS. Dự án tích hợp mock API sử dụng `axios-mock-adapter` để mô phỏng tương tác với backend, bao gồm xác thực, danh mục và khóa học.

## Mục lục

- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [Cấu hình Mock API](#cấu-hình-mock-api)
- [Tài khoản đăng nhập mặc định](#tài-khoản-đăng-nhập-mặc-định)
- [Scripts](#scripts)
- [Thư viện phụ thuộc](#thư-viện-phụ-thuộc)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Biến môi trường](#biến-môi-trường)

## Yêu cầu

Cần cài đặt các phần mềm sau:

- **Node.js** (khuyến nghị v18 trở lên)
- Trình duyệt web hiện đại để phát triển và kiểm thử

## Cài đặt

1. **Sao chép và giải nén kho mã nguồn**:

   ```bash
   cd vite-project-tailwind
   ```

2. **Cài đặt thư viện phụ thuộc**:

   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường**:
   Tạo file `.env` trong thư mục gốc và thêm nội dung sau:
   ```bash
   VITE_BACKEND_URL="http://localhost:8000/api"
   VITE_USE_MOCK_API="true"
   ```
   - `VITE_BACKEND_URL`: URL của API backend (dùng khi `VITE_USE_MOCK_API` là `false`).
   - `VITE_USE_MOCK_API`: Kích hoạt mock API khi đặt là `true`.

## Chạy dự án

Khởi động server:

```bash
npm run dev
```

Server được cấu hình chạy tại `http://localhost:3000`. (Thay đổi tại vite.config.ts)

Xây dựng dự án cho production:

```bash
npm run build
```

## Cấu hình Mock API

Dự án sử dụng `axios-mock-adapter` để mô phỏng các phản hồi từ backend cho xác thực, danh mục và khóa học. Mock API được kích hoạt khi `VITE_USE_MOCK_API` là `true` trong file `.env`.

### Tính năng Mock API

- **Xác thực**:
  - Đăng nhập (`POST /login`): Mô phỏng đăng nhập với tài khoản mặc định.
  - Đăng ký (`POST /register`): Mô phỏng đăng ký người dùng.
  - Đăng xuất (`POST /logout`): Mô phỏng đăng xuất.
- **Danh mục**:
  - Lấy danh sách danh mục (`GET /categories`): Trả về danh sách danh mục.
  - Tạo danh mục (`POST /categories`): Thêm danh mục mới.
  - Cập nhật danh mục (`PUT /categories/:id`): Cập nhật danh mục.
  - Xóa danh mục (`DELETE /categories/:id`): Xóa danh mục.
- **Khóa học**:
  - Lấy danh sách khóa học (`GET /courses`): Trả về danh sách khóa học phân trang, hỗ trợ tìm kiếm và sắp xếp.
  - Lấy khóa học theo ID (`GET /courses/:id`): Lấy thông tin một khóa học.
  - Tạo khóa học (`POST /courses`): Thêm khóa học mới.
  - Cập nhật khóa học (`PUT /courses/:id`): Cập nhật khóa học.
  - Xóa khóa học (`DELETE /courses/:id`): Xóa khóa học.

### Kích hoạt Mock API

1. Đảm bảo `VITE_USE_MOCK_API="true"` trong file `.env`.
2. Mock API tự động được cấu hình khi ứng dụng khởi động, sử dụng các adapter trong các file như `auth.ts`, `categories.ts`, `courses.ts`.
3. Không cần server backend khi sử dụng mock API.

### Tắt Mock API

Để sử dụng backend thật:

1. Đặt `VITE_USE_MOCK_API="false"` trong file `.env`.
2. Đảm bảo server backend đang chạy tại `VITE_BACKEND_URL` (ví dụ: `http://localhost:8000/api`).

## Tài khoản đăng nhập mặc định

Mock API cung cấp hai tài khoản mặc định để kiểm tra đăng nhập:

- **jone@example.com**: Vai trò `admin`
- **jone2@example.com**: Vai trò `user`

Sử dụng các email trên với endpoint `POST /login` để kiểm tra. Mock API sẽ trả về token JWT giả lập và thông tin người dùng khi đăng nhập thành công.

## Scripts

Các lệnh npm có sẵn:

- `npm run dev`: Khởi động server phát triển.
- `npm run build`: Xây dựng dự án cho production.
- `npm run lint`: Chạy ESLint trên các file TypeScript và cấu hình.
- `npm run lint:fix`: Chạy ESLint và tự động sửa lỗi.
- `npm run format`: Kiểm tra định dạng mã với Prettier.
- `npm run format:fix`: Định dạng lại mã với Prettier.

## Thư viện phụ thuộc

Các thư viện chính:

- **React**: Xây dựng giao diện người dùng.
- **TypeScript**: JavaScript với kiểm tra kiểu.
- **Tailwind CSS**: CSS theo kiểu utility-first.
- **axios** và **axios-mock-adapter**: Gửi yêu cầu HTTP và mock API.
- **@tanstack/react-query**: Quản lý dữ liệu và trạng thái.
- **react-router-dom**: Điều hướng phía client.
- **@radix-ui/\***: Các thành phần giao diện.
- **zod**: Xác thực schema.
- **react-hook-form**: Quản lý biểu mẫu.
- Xem `package.json` để biết danh sách đầy đủ.

## Cấu trúc dự án

```
vite-project-tailwind/
├── src/
│   ├── types/              # Định nghĩa kiểu TypeScript
│   ├── mocks/              # Cấu hình mock API (auth.ts, categories.ts, courses.ts)
│   ├── components/         # Các thành phần React tái sử dụng
│   ├── pages/              # Các thành phần trang
│   └── ...                 # Các file mã nguồn khác
├── public/                 # Tài nguyên tĩnh (ví dụ: hình ảnh)
├── .env                    # Biến môi trường
├── package.json            # Metadata và phụ thuộc của dự án
├── vite.config.ts          # Cấu hình Vite
├── tailwind.config.ts      # Cấu hình Tailwind CSS
└── README.md               # Tài liệu này
```

## Biến môi trường

- `VITE_BACKEND_URL`: URL của API backend (ví dụ: `http://localhost:8000/api`).
- `VITE_USE_MOCK_API`: Đặt `true` để dùng mock API, `false` để dùng backend thật.
