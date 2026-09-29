from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_service import summarize_text

try:
    import fitz  # PyMuPDF (PDF okumak için)
except ImportError:
    fitz = None

app = Flask(__name__)
CORS(app)  # JavaScript'ten gelen isteklere izin verir

# 1. Metin Analiz Uç Noktası (Endpoint)
@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"success": False, "message": "Metin bulunamadı!"}), 400

        text = data['text']
        if not text.strip():
            return jsonify({"success": False, "message": "Metin boş olamaz!"}), 400

        # Yapay zeka ile özetle
        summary = summarize_text(text)
        
        return jsonify({
            "success": True,
            "summary": summary,
            "data_count": len(text)
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# 2. PDF Analiz Uç Noktası (Endpoint)
@app.route('/api/analyze-pdf', methods=['POST'])
def analyze_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "message": "PDF dosyası yüklenmedi!"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "message": "Dosya seçilmedi!"}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"success": False, "message": "Lütfen geçerli bir PDF dosyası yükleyin!"}), 400

        if fitz is None:
            return jsonify({"success": False, "message": "Sunucuda PyMuPDF kütüphanesi yüklü değil!"}), 500

        # PDF içeriğini oku
        file_bytes = file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        if not text.strip():
            return jsonify({"success": False, "message": "PDF dosyası okunabilir metin içermiyor!"}), 400

        # Yapay zeka ile özetle
        summary = summarize_text(text)

        return jsonify({
            "success": True,
            "summary": summary,
            "data_count": len(text),
            "filename": file.filename
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    print("==================================================")
    print("Python Flask API Çalışıyor: http://127.0.0.1:5000")
    print("==================================================")
    app.run(debug=True, port=5000)