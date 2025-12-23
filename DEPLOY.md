# Hướng dẫn Deploy lên Docker/VPS

## Cách 1: Deploy trên máy local (test)

### Bước 1: Build và chạy
```bash
cd "my wedding front"
docker-compose up --build -d
```

### Bước 2: Xem logs
```bash
docker-compose logs -f
```

### Bước 3: Truy cập
Mở trình duyệt: `http://localhost:9000`

---

## Cách 2: Deploy trên VPS

### Bước 1: Upload code lên VPS
```bash
# Sử dụng scp hoặc git
scp -r "my wedding front" user@your-vps-ip:/path/to/app/
# Hoặc clone từ git repo
```

### Bước 2: SSH vào VPS
```bash
ssh user@your-vps-ip
cd /path/to/app/"my wedding front"
```

### Bước 3: Cài đặt Docker và Docker Compose (nếu chưa có)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Thêm user vào docker group (không cần sudo)
sudo usermod -aG docker $USER
# Logout và login lại
```

### Bước 4: Build và chạy
```bash
docker-compose up --build -d
```

### Bước 5: Kiểm tra
```bash
# Xem logs
docker-compose logs -f

# Kiểm tra container đang chạy
docker-compose ps

# Truy cập từ trình duyệt
# http://your-vps-ip:9000
```

---

## Cập nhật khi có thay đổi code

### Cách nhanh (sử dụng script):
```bash
chmod +x deploy.sh
./deploy.sh
```

### Cách thủ công:
```bash
# 1. Pull code mới (nếu dùng git)
git pull

# 2. Build lại image
docker-compose build --no-cache

# 3. Restart container
docker-compose down
docker-compose up -d

# 4. Xem logs
docker-compose logs -f
```

---

## Các lệnh hữu ích

### Xem logs
```bash
docker-compose logs -f web
```

### Stop container
```bash
docker-compose down
```

### Restart container
```bash
docker-compose restart
```

### Xem trạng thái
```bash
docker-compose ps
```

### Xóa tất cả (cẩn thận!)
```bash
docker-compose down -v  # Xóa cả volumes
docker system prune -a  # Xóa tất cả images không dùng
```

---

## Cấu hình Nginx reverse proxy (tùy chọn)

Nếu muốn chạy trên port 80/443 thay vì 9000, cấu hình Nginx:

```nginx
# /etc/nginx/sites-available/wedding
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Sau đó:
```bash
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Troubleshooting

### Lỗi "No space left on device" khi build
Đây là lỗi thiếu dung lượng trong Docker. Giải quyết:

```bash
# Chạy script cleanup tự động
./cleanup-docker.sh

# Hoặc cleanup thủ công:
docker-compose down
docker system prune -a -f
docker builder prune -a -f
docker volume prune -f

# Kiểm tra dung lượng đã giải phóng
docker system df
```

Sau đó build lại:
```bash
docker-compose build --no-cache
```

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs web

# Kiểm tra port đã được sử dụng chưa
sudo netstat -tulpn | grep 9000
```

### Build fail
```bash
# Xóa cache và build lại
docker-compose build --no-cache

# Xóa tất cả images cũ
docker system prune -a
```

### Permission denied
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER
# Logout và login lại
```

