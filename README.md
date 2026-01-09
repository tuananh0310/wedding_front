# Website Đám Cưới - Tuấn Anh & Thu Phương

Website đám cưới được xây dựng bằng Vue.js 2, với các tính năng hiện đại và tối ưu cho mobile.

## ✨ Tính Năng

- ⏰ **Countdown Timer** - Đếm ngược đến ngày cưới
- 📝 **RSVP Form** - Form xác nhận tham dự với API integration
- 🖼️ **Gallery với Lightbox** - Xem ảnh với lightbox, hỗ trợ keyboard navigation
- 🎵 **Music Player** - Phát nhạc nền tự động
- 💬 **Wedding Messages Ticker** - Hiển thị lời chúc từ bạn bè
- 💝 **Gift Box** - QR codes và thông tin ngân hàng
- 📅 **Schedule** - Lịch trình ngày cưới
- 📱 **PWA Support** - Có thể cài đặt như app
- ♿ **Accessibility** - Hỗ trợ ARIA labels và keyboard navigation
- 🔍 **SEO Optimized** - Meta tags, Open Graph, Structured Data

## 🚀 Setup & Development

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn

### Cài đặt

```bash
# Cài đặt dependencies
npm install

# Cài đặt Bower dependencies (nếu chưa có)
bower install

# Chạy development server
npx gulp serve

# Build production
npx gulp build

# Serve production build
npx gulp serve:dist
```

## 📁 Cấu Trúc Project

```
app/
├── scripts/
│   ├── config.js          # Configuration (API endpoints, settings)
│   ├── utils.js            # Utility functions
│   ├── countdown.js        # Countdown timer logic
│   ├── music.js            # Music player module
│   ├── lightbox.js         # Gallery lightbox
│   ├── rsvp.js             # RSVP form handling
│   ├── messages.js         # Wedding messages ticker
│   ├── lazy-loading.js     # Image lazy loading
│   ├── navigation.js      # Navigation & slide management
│   ├── main.js             # Main Vue app
│   └── ...
├── styles/                 # SCSS styles
├── images/                 # Images
├── music/                  # Music files
├── manifest.json           # PWA manifest
└── sw.js                   # Service Worker
```

## ⚙️ Configuration

Cấu hình được quản lý trong `app/scripts/config.js`:

- API endpoints
- Wedding date & location
- Music settings
- Image loading settings

## 🔧 Build Process

Project sử dụng Gulp để build:

- **SCSS** → CSS với autoprefixer
- **JavaScript** → Transpiled với Babel
- **Images** → Optimized với imagemin
- **HTML** → Minified

## 📦 Deployment

### GitHub Pages

```bash
npx gulp deploy
```

### Manual Deployment

1. Build project: `npx gulp build`
2. Upload thư mục `dist/` lên server
3. Đảm bảo server hỗ trợ Service Worker (HTTPS required)

## 🧪 Testing

Basic test files được tạo trong thư mục `test/`. Để setup testing đầy đủ:

```bash
npm install --save-dev jest mocha
```

## 📝 Code Quality

- ESLint được cấu hình trong `package.json`
- Code được tách thành modules nhỏ (< 150 lines)
- Tuân thủ best practices

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Private project - All rights reserved

## 👥 Credits

- Vue.js 2
- Bootstrap 3
- jQuery
- Gulp

---

**Ngày cưới:** 29 tháng 1 năm 2026  
**Địa điểm:** NHÀ VĂN HOÁ XÓM 8, Yên Thành, Nghệ An
