import os
import re

replacements = {
    # lang.js translations block keys
    '"vi"': '"id"',
    "'vi'": "'id'",
    "vi:": "id:",
    
    # Common UI texts
    "Cài Đặt Trang Web": "Pengaturan Website",
    "Cài Đặt Âm Thanh": "Pengaturan Suara",
    "Nhạc Nền:": "Musik Latar:",
    "Cài Đặt Thời Gian": "Pengaturan Waktu",
    "Thời Gian Đếm Ngược:": "Waktu Hitung Mundur:",
    "Cài Đặt Hiệu Ứng Mưa Chữ": "Pengaturan Efek Hujan Teks",
    "chữ chính mưa chữ:": "Teks utama hujan:",
    "Màu mưa chữ 1:": "Warna hujan teks 1:",
    "Màu mưa chữ 2:": "Warna hujan teks 2:",
    "Cài Đặt chữ chính": "Pengaturan Teks Utama",
    "Nội Dung chữ chính:": "Konten Teks Utama:",
    "Màu chữ chính:": "Warna Teks Utama:",
    "Cài Đặt Hình Động": "Pengaturan Animasi",
    "Hình Động (tùy chọn):": "Animasi (Opsional):",
    "Hiển thị sách:": "Tampilkan buku:",
    "Cài Đặt Trang Sách": "Pengaturan Halaman Buku",
    "Hiển thị hiệu ứng trái tim:": "Tampilkan efek hati:",
    "Lưu ý:": "Catatan:",
    "Hạn sử dụng chỉ có": "Masa berlaku hanya",
    "ngày, vậy nên đừng tạo trước quá sớm nhé!": "hari, jadi jangan buat terlalu awal!",
    "Hãy follow mình để cập nhật những website mới nhất, nhanh nhất nhé!": "Ikuti saya untuk update website terbaru dan tercepat!",
    "Áp Dụng Cài Đặt": "Terapkan Pengaturan",
    "Website được tạo bởi tiktoker:": "Website dibuat oleh tiktoker:",
    "Toàn màn hình": "Layar Penuh",
    "Bảng Giá Dịch Vụ": "Daftar Harga Layanan",
    "Voucher giảm giá:": "Voucher diskon:",
    "Tip cho tác giả:": "Tip untuk pembuat:",
    "Tổng cộng:": "Total:",
    "Tạo Website": "Buat Website",
    "Thanh toán & Tạo Website": "Bayar & Buat Website",
    "Sử dụng cấu hình mặc định - MIỄN PHÍ!": "Gunakan konfigurasi default - GRATIS!",
    "Nhạc nền tùy chỉnh": "Musik latar kustom",
    "Sách kỷ niệm": "Buku kenangan",
    "Trang thêm": "Halaman ekstra",
    "Hiệu ứng trái tim (trong sách)": "Efek hati (dalam buku)",
    "Tip cho tác giả": "Tip untuk pembuat",
    "Đã áp dụng voucher:": "Voucher berhasil digunakan:",
    "Đang tải voucher...": "Memuat voucher...",
    "Bạn không có voucher nào cả!": "Anda tidak memiliki voucher sama sekali!",
    "Bạn cần đăng nhập để xem voucher!": "Anda perlu login untuk melihat voucher!",
    "Không thể tải voucher!": "Gagal memuat voucher!",
    "Copy Link": "Salin Tautan",
    "Xem Website": "Lihat Website",
    "Đóng": "Tutup",
    "Tạo website thành công!": "Website berhasil dibuat!",
    "Giá:": "Harga:",
    "Link chia sẻ:": "Tautan berbagi:",
    "Đã copy link sản phẩm!": "Tautan produk disalin!",
    "Bạn cần đăng nhập để tạo website! Nút đăng nhập trên góc trái nhé": "Anda perlu login untuk membuat website! Tombol login ada di sudut kiri atas",
    "Số tiền thanh toán tối thiểu là": "Jumlah pembayaran minimum adalah",
    "Có lỗi xảy ra!": "Terjadi kesalahan!",
    "Cấu trúc trang không hợp lệ! Hiện tại có": "Struktur halaman tidak valid! Saat ini ada",
    "trang. Vui lòng thêm hoặc xóa 1 trang để tạo cấu trúc hợp lệ.": "halaman. Silakan tambah atau hapus 1 halaman agar struktur valid.",
    "Đang upload ảnh trang sách...": "Mengunggah gambar halaman buku...",
    "Đang tạo website...": "Membuat website...",
    "Đang tạo sản phẩm...": "Membuat produk...",
    "Đang áp dụng voucher...": "Menerapkan voucher...",
    "Áp dụng voucher thành công!": "Voucher berhasil diterapkan!",
    "Lỗi áp dụng voucher, tiếp tục thanh toán với giá gốc": "Gagal menerapkan voucher, lanjut bayar dengan harga asli",
    "Không thể tạo website": "Gagal membuat website",
    "Lỗi khi tạo sản phẩm": "Gagal membuat produk",
    "Áp dụng voucher thất bại!": "Gagal menerapkan voucher!",
    "Lỗi xử lý thanh toán: ": "Kesalahan pemrosesan pembayaran: ",
    "Đang chuyển đến trang thanh toán...": "Mengalihkan ke halaman pembayaran...",
    "MIỄN PHÍ": "GRATIS",
    "Cảm ơn bạn rất nhiều! Nếu thích sản phẩm này, hãy follow kênh TikTok": "Terima kasih banyak! Jika Anda menyukai produk ini, silakan ikuti channel TikTok",
    "để mình có động lực ra nhiều sản phẩm hơn nhé!": "agar saya lebih termotivasi membuat produk lainnya!",
    "xem kênh TikTok": "lihat channel TikTok",
    "Tạo QR trái tim": "Buat QR hati",
    "Đã copy link QR trái tim!": "Tautan QR hati disalin!",
    "Sao chép link": "Salin tautan",
    "Đã sao chép!": "Tersalin!",
    "Đã sao chép link vào clipboard!": "Tautan disalin ke clipboard!",
    "Không thể sao chép link!": "Gagal menyalin tautan!",
    "Hợp lệ (chỉ có bìa)": "Valid (hanya sampul)",
    "Hợp lệ (bìa + các cặp trang)": "Valid (sampul + pasangan halaman)",
    "Không hợp lệ (thiếu 1 trang để tạo cặp)": "Tidak valid (kurang 1 halaman untuk membuat pasangan)",
    "Thông tin trang sách:": "Info halaman buku:",
    "Tổng số trang": "Total halaman",
    "Trạng thái": "Status",
    "Cấu trúc": "Struktur",
    "Chỉ có bìa": "Hanya sampul",
    "Bìa (1) + ": "Sampul (1) + ",
    " cặp trang": " pasangan halaman",
    " + 1 trang lẻ": " + 1 halaman ekstra",
    "Trang {num} (Bìa)": "Halaman {num} (Sampul)",
    "Trang {num}": "Halaman {num}",
    "Hình ảnh:": "Gambar:",
    "Bìa Sách": "Sampul Buku",
    "Chưa có ảnh - ": "Belum ada gambar - ",
    "Nội dung:": "Konten:",
    "Nhập nội dung cho trang ": "Masukkan konten untuk halaman ",
    "Thêm Trang Mới": "Tambah Halaman Baru",
    "Trang trống": "Halaman kosong",
    "Hết sách": "Akhir buku",
    "Cấu trúc trang không hợp lệ!": "Struktur halaman tidak valid!",
    "Hiện tại có ": "Saat ini ada ",
    "Cấu trúc sách cần:\\n- Trang 1: Bìa\\n- Từ trang 2 trở đi: Các cặp trang (2-3, 4-5, 6-7...)": "Struktur buku membutuhkan:\\n- Halaman 1: Sampul\\n- Mulai halaman 2: Pasangan halaman (2-3, 4-5, 6-7...)",
    "Vui lòng thêm thêm 1 trang hoặc xóa bớt 1 trang để tạo cấu trúc hợp lệ.": "Silakan tambah 1 halaman atau hapus 1 halaman agar struktur valid.",
    "Trình duyệt của bạn không hỗ trợ chế độ toàn màn hình!": "Browser Anda tidak mendukung mode layar penuh!",
    "lưu ý: hãy ngăn cách bằng dấu | để tách từ, không nên để một dòng quá dài": "Catatan: gunakan tanda | untuk memisahkan kata, jangan buat baris terlalu panjang",
    "Bật": "Nyala",
    "Tắt": "Mati",
    "3 giây": "3 detik",
    "5 giây": "5 detik",
    "10 giây": "10 detik",
    "Không có": "Tidak ada",
    "Nếu gặp vấn đề hãy nhắn tin qua TikTok": "Jika ada masalah, hubungi lewat TikTok",
    "để được hỗ trợ.": "untuk bantuan.",
    "Lưu QR vĩnh viễn:": "Simpan QR permanen:",
    "vĩnh viễn": "permanen",
    "Thêm": "Tambah",
    "30 ngày": "30 hari",
    "Hạn sử dụng là": "Masa berlaku:",
    "Chọn màu:": "Pilih warna:",
    "ấn vào đây để setting theo ý muốn": "klik di sini untuk mengatur sesuai keinginan",
    "Hồng ngọt ngào": "Merah muda manis",
    "Xanh dương mát mẻ": "Biru laut keren",
    "Tím mộng mơ": "Ungu impian",
    "Tùy chỉnh màu": "Warna kustom",
    "Phương thức thanh toán": "Metode Pembayaran",
    "Ngân hàng": "Transfer Bank",
    "Chỉ dành cho người dùng Việt Nam": "Hanya untuk pengguna Vietnam",
    "Ví PayPal": "Dompet PayPal",
    "Dành cho người dùng quốc tế": "Untuk pengguna internasional",
    "Đăng xuất": "Keluar",
    "Một món quà đầy yêu thương đang chờ bạn khám phá! Nhấn để xem lời chúc đặc biệt!": "Hadiah penuh cinta menunggumu untuk ditemukan! Klik untuk melihat pesan spesial!",
    "Đăng nhập bằng Google": "Masuk dengan Google",
    
    # index.html specifics
    "Đang tải danh sách nhạc...": "Memuat daftar musik...",
    "Nghe thử": "Coba dengarkan",
    "Chọn bài nhạc rồi nhấn \"Nghe thử\"": "Pilih musik lalu klik \"Coba dengarkan\"",
    "Nhập chữ cho hiệu ứng mưa chữ": "Masukkan teks untuk efek hujan",
    "Ví dụ: CHÚC|MỪNG|SINH|NHẬT|...": "Contoh: SELAMAT|ULANG|TAHUN|...",
    "Nếu bạn không phải người Việt Nam, bạn sẽ không thanh toán được qua website này, hãy nhắn tin qua TikTok": "Jika Anda bukan dari Vietnam, Anda tidak bisa membayar lewat website ini, silakan hubungi via TikTok",
    "để được hỗ trợ thanh toán sản phẩm này.": "untuk bantuan pembayaran produk ini.",
    
    # main.js pricing calculator specifics
    "VNĐ": "Rp",
    "đ": "Rp",
    "Đang đăng nhập...": "Sedang masuk...",
    "Đăng xuất thất bại:": "Keluar gagal:",
    "Đăng nhập thất bại:": "Masuk gagal:",
    "Tổng tiền thanh toán:": "Total pembayaran:",
    "đã áp dụng voucher": "voucher digunakan",
    "Giảm:": "Diskon:"
}

def translate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Sort replacements by length to prevent partial replacements (e.g. "Cài Đặt" before "Cài Đặt Âm Thanh")
    sorted_replacements = sorted(replacements.items(), key=lambda x: len(x[0]), reverse=True)
    
    for vi, id_trans in sorted_replacements:
        new_content = new_content.replace(vi, id_trans)
        
    # Extra fix for lang.js EN/VI switch
    if 'EN/VI' in new_content:
        new_content = new_content.replace('EN/VI', 'EN/ID')

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Translated {filepath}")

# Walk through project dir
project_dir = r"c:\Users\MML\Documents\projek2\projek2"
for root, dirs, files in os.walk(project_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.js') or file.endswith('.html'):
            translate_file(os.path.join(root, file))

print("Translation script completed.")
