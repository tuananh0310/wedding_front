
# 🎨 Đề Xuất Cải Tiến Giao Diện & Trải Nghiệm (Modernization Proposal)

Để biến trang web đám cưới trở nên hiện đại, sang trọng và ấn tượng hơn ("WOW" factor), dưới đây là các đề xuất cụ thể tập trung vào Giao diện (UI) và Trải nghiệm người dùng (UX).

## 1. Phong Cách Thiết Kế (Design Language)

### ✨ Glassmorphism (Hiệu ứng Kính mờ)
Thay vì các ô màu đặc (solid colors), sử dụng hiệu ứng kính mờ cho các thành phần như:
- **Thanh menu**: Navbar trong suốt với hiệu ứng làm mờ nền.
- **Form RSVP & Giftbox**: Card trắng mờ (opacity 80-90%) với `backdrop-filter: blur(10px)`.
- **Countdown**: Các ô số đếm ngược trong suốt tinh tế.

### 🎨 Bảng Màu (Color Palette) Sang Trọng
Chuyển từ màu xanh sáng truyền thống sang các tông màu Pastel hoặc Earth-tone đang là xu hướng:
- **Option 1 (Lãng mạn - Pastel):**
  - Primary: `Dusty Pink` (#ddb8c1) hoặc `Sage Green` (#b2c5b2)
  - Background: `Cream/Beige` (#fdfbf7)
  - Text: `Charcoal` (#2c3e50) - thay vì đen tuyền.
- **Option 2 (Modern Luxury):**
  - Primary: `Gold` (#d4af37)
  - Background: `Dark Navy` (#0a192f) hoặc `Deep Emerald`.

### ✒️ Typography (Phông chữ)
- **Tiêu đề (Headings):** Sử dụng phông Serif hiện đại như **"Playfair Display"** hoặc **"Cormorant Garamond"** để tạo cảm giác trang trọng, cổ điển.
- **Nội dung (Body):** Sử dụng phông Sans-serif sạch sẽ như **"Montserrat"**, **"Inter"** hoặc **"Lato"** để dễ đọc.

## 2. Hiệu Ứng & Chuyển Động (Animation)

- **Scroll Animations:** Sử dụng thư viện như AOS (Animate On Scroll) để các phần tử "trượt" nhẹ nhàng vào màn hình khi cuộn xuống.
- **Parallax Effect:** Hiệu ứng cuộn lệch giữa nền và nội dung để tạo chiều sâu (đặc biệt cho phần "Clouds" hoặc ảnh Gallery).
- **Micro-interactions:**
  - Nút bấm (Button) có hiệu ứng hover mượt mà (scale nhẹ, glow).
  - Hình ảnh trong Gallery có hiệu ứng zoom nhẹ khi hover.

## 3. Cải Tiến Các Phần Cụ Thể

### 🏠 Hero Section (Phần mở đầu)
- Thay đổi bố cục: Tên Cô dâu & Chú rể đặt trọng tâm với phông chữ lớn, nghệ thuật.
- Background: Có thể sử dụng video ngắn (loop) hoặc slideshow ảnh mờ ảo thay vì chỉ mây bay.

### 💌 RSVP Form
- Thiết kế lại form dưới dạng "Postcard" hoặc "Letter" điện tử.
- Input fields chỉ hiển thị đường kẻ dưới (border-bottom) thay vì khung bao quanh để trông nhẹ nhàng hơn.

### 🎁 Gift Box (Mừng cưới)
- Thay vì hiển thị mã QR trực tiếp, sử dụng thiết kế "Lì xì điện tử" (người dùng bấm vào bao lì xì để mở ra mã QR).
- Thêm nút "Copy STK" tiện lợi.

## 4. Kế Hoạch Thực Hiện Ngay

Tôi có thể bắt đầu thực hiện ngay các thay đổi sau trong file `main.scss`:
1.  **Cập nhật Fonts**: Thêm `Playfair Display` và `Montserrat`.
2.  **Refine Colors**: Cập nhật bộ biến màu sắc sang trọng hơn.
3.  **Thêm Glassmorphism**: Tạo class `.glass-card` và áp dụng cho các khối nội dung.
4.  **Tối ưu Navbar**: Làm thanh điều hướng hiện đại hơn.

Bạn có đồng ý với các định hướng trên không? Nếu có, tôi sẽ bắt đầu chỉnh sửa CSS ngay lập tức.
