import pymupdf as fitz  # Bu satırı buraya, dosyanın içine yazıyorsunuz!

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text