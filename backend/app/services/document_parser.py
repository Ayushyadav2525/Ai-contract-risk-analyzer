import os
import pymupdf as fitz  # PyMuPDF
import docx
from typing import Dict, Any, List

def parse_pdf(file_path: str) -> Dict[str, Any]:
    doc = fitz.open(file_path)
    pages = []
    full_text = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        pages.append({
            "page_number": page_num + 1,
            "text": text
        })
        full_text.append(text)
        
    doc.close()
    combined_text = "\n\n".join(full_text)
    
    return {
        "full_text": combined_text,
        "page_count": len(pages),
        "pages": pages
    }

def parse_docx(file_path: str) -> Dict[str, Any]:
    doc = docx.Document(file_path)
    paragraphs = []
    full_text = []
    
    for idx, p in enumerate(doc.paragraphs):
        if p.text.strip():
            paragraphs.append({
                "page_number": 1,
                "text": p.text
            })
            full_text.append(p.text)
            
    combined_text = "\n\n".join(full_text)
    
    return {
        "full_text": combined_text,
        "page_count": 1,
        "pages": [{"page_number": 1, "text": combined_text}]
    }

def extract_document_text(file_path: str) -> Dict[str, Any]:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return parse_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return parse_docx(file_path)
    elif ext in [".txt"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return {
            "full_text": content,
            "page_count": 1,
            "pages": [{"page_number": 1, "text": content}]
        }
    else:
        raise ValueError(f"Unsupported file format: {ext}")
