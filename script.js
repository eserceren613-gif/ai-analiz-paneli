document.addEventListener("DOMContentLoaded", () => {
    // 1. Sol Menü (Sidebar) Sekme Geçişleri
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("pageTitle");
    const pageDesc = document.getElementById("pageDesc");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active"));

            item.classList.add("active");
            const target = item.getAttribute("data-target");
            document.getElementById(`section-${target}`).classList.add("active");

            if (target === "dashboard") {
                pageTitle.textContent = "Dashboard";
                pageDesc.textContent = "Yapay zeka tabanlı metin ve dosya analiz paneline hoş geldiniz.";
            } else if (target === "text-analysis") {
                pageTitle.textContent = "Metin ve PDF Analiz";
                pageDesc.textContent = "İstediğiniz metni yapıştırın veya PDF dosyanızı yükleyin.";
            } else if (target === "ai-summary") {
                pageTitle.textContent = "AI Özet Modülü";
                pageDesc.textContent = "Oluşturulan son yapay zeka özetleri.";
            } else if (target === "data-analytics") {
                pageTitle.textContent = "Veri Analizi";
                pageDesc.textContent = "İstatistikler ve analiz geçmişi.";
            }
        });
    });

    // 2. Metin / PDF Sekme Değiştirme Butonları
    const tabBtns = document.querySelectorAll(".tab-btn");
    const pasteTab = document.getElementById("paste-tab");
    const pdfTab = document.getElementById("pdf-tab");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.getAttribute("data-tab") === "paste-tab") {
                pasteTab.style.display = "block";
                pdfTab.style.display = "none";
            } else {
                pasteTab.style.display = "none";
                pdfTab.style.display = "block";
            }
        });
    });

    // PDF Seçim Göstergesi
    const pdfFileInput = document.getElementById("pdfFileInput");
    const selectedFileName = document.getElementById("selectedFileName");

    pdfFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            selectedFileName.textContent = e.target.files[0].name;
        } else {
            selectedFileName.textContent = "Dosya seçilmedi";
        }
    });

    // Sonuç Alanları ve Durum Mesajları
    const summaryResult = document.getElementById("summaryResult");
    const summaryOnlyView = document.getElementById("summaryOnlyView");
    const dataCount = document.getElementById("dataCount");
    const analyticsCountDisplay = document.getElementById("analyticsCountDisplay");
    const statusMessage = document.getElementById("statusMessage");

    // ==========================================
    // 3. PYTHON API BAĞLANTISI: METİN ANALİZİ
    // ==========================================
    const textInput = document.getElementById("textInput");
    const analyzeTextBtn = document.getElementById("analyzeTextBtn");

    analyzeTextBtn.addEventListener("click", async () => {
        const text = textInput.value.trim();
        if (!text) {
            alert("Lütfen analiz edilecek bir metin girin!");
            return;
        }

        statusMessage.textContent = "⏳ Metin Python API'sine gönderiliyor ve analiz ediliyor...";
        summaryResult.textContent = "Yapay zeka özetliyor...";

        try {
            // PYTHON BAĞLANTISI BURADA: http://127.0.0.1:5000/api/analyze
            const response = await fetch("http://127.0.0.1:5000/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });
            const result = await response.json();

            if (response.ok && result.success) {
                statusMessage.textContent = "✅ Metin analizi başarıyla tamamlandı!";
                summaryResult.textContent = result.summary;
                summaryOnlyView.textContent = result.summary;
                dataCount.textContent = result.data_count;
                analyticsCountDisplay.textContent = `Toplam İşlenen Veri: ${result.data_count} Karakter`;
            } else {
                statusMessage.textContent = "❌ Hata oluştu.";
                summaryResult.textContent = result.message;
            }
        } catch (err) {
            console.error("Python Bağlantı Hatası:", err);
            statusMessage.textContent = "❌ Python sunucusuna (app.py) bağlanılamadı! Sunucunun çalıştığından emin olun.";
        }
    });

    // ==========================================
    // 4. PYTHON API BAĞLANTISI: PDF ANALİZİ
    // ==========================================
    const analyzePdfBtn = document.getElementById("analyzePdfBtn");

    analyzePdfBtn.addEventListener("click", async () => {
        const file = pdfFileInput.files[0];
        if (!file) {
            alert("Lütfen bir PDF dosyası seçin!");
            return;
        }

        statusMessage.textContent = "⏳ PDF Python API'sine yükleniyor ve okunuyor...";
        summaryResult.textContent = "Yapay zeka PDF'i özetliyor...";

        const formData = new FormData();
        formData.append("file", file);

        try {
            // PYTHON BAĞLANTISI BURADA: http://127.0.0.1:5000/api/analyze-pdf
            const response = await fetch("http://127.0.0.1:5000/api/analyze-pdf", {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            if (response.ok && result.success) {
                statusMessage.textContent = "✅ PDF analizi başarıyla tamamlandı!";
                summaryResult.textContent = result.summary;
                summaryOnlyView.textContent = result.summary;
                dataCount.textContent = result.data_count;
                analyticsCountDisplay.textContent = `Toplam İşlenen Veri: ${result.data_count} Karakter`;
            } else {
                statusMessage.textContent = "❌ Hata oluştu.";
                summaryResult.textContent = result.message;
            }
        } catch (err) {
            console.error("Python Bağlantı Hatası:", err);
            statusMessage.textContent = "❌ Python sunucusuna (app.py) bağlanılamadı!";
        }
    });
});