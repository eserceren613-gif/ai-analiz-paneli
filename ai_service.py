def summarize_text(text):
    if not text:
        return "Özetlenecek metin bulunamadı."
    
    # Şimdilik test amaçlı metnin baş kısmını döndürüyoruz
    return f"AI Özeti (Simülasyon): {text[:400]}..."