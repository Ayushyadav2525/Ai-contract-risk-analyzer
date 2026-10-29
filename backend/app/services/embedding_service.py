import os
from typing import List, Dict, Any
from app.core.config import settings

class VectorStoreService:
    def __init__(self):
        self.chroma_client = None
        self.collection = None
        self.in_memory_docs = []
        self.initialized = False
        self._init_chroma()

    def _init_chroma(self):
        try:
            import chromadb
            self.chroma_client = chromadb.PersistentClient(path=settings.VECTOR_DB_DIR)
            self.collection = self.chroma_client.get_or_create_collection(name="contract_clauses")
            self.initialized = True
        except Exception as e:
            print(f"[VectorStoreService] ChromaDB initialization fallback: {e}")
            self.initialized = False

    def add_chunks(self, contract_id: int, chunks: List[Dict[str, Any]]):
        if not chunks:
            return

        documents = [c["original_text"] for c in chunks]
        metadatas = [
            {
                "contract_id": str(contract_id),
                "category": c.get("category", "General"),
                "section": c.get("section", "1"),
                "page_number": c.get("page_number", 1)
            }
            for c in chunks
        ]
        ids = [f"doc_{contract_id}_chunk_{i}" for i in range(len(chunks))]

        if self.initialized and self.collection:
            try:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                return
            except Exception as e:
                print(f"[VectorStoreService] Failed to insert into ChromaDB: {e}")

        # In-memory store fallback
        for doc, meta, cid in zip(documents, metadatas, ids):
            self.in_memory_docs.append({
                "id": cid,
                "text": doc,
                "metadata": meta
            })

    def search_similar(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if self.initialized and self.collection:
            try:
                results = self.collection.query(
                    query_texts=[query],
                    n_results=min(top_k, self.collection.count() or 1)
                )
                output = []
                if results and "documents" in results and results["documents"]:
                    docs = results["documents"][0]
                    metas = results["metadatas"][0] if "metadatas" in results else [{}]*len(docs)
                    for doc, meta in zip(docs, metas):
                        output.append({"text": doc, "metadata": meta})
                return output
            except Exception as e:
                print(f"[VectorStoreService] Search failed in ChromaDB: {e}")

        # Keyword match fallback
        query_words = set(query.lower().split())
        scored = []
        for d in self.in_memory_docs:
            overlap = len(query_words.intersection(set(d["text"].lower().split())))
            scored.append((overlap, d))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [{"text": item[1]["text"], "metadata": item[1]["metadata"]} for item in scored[:top_k]]

vector_store_service = VectorStoreService()
