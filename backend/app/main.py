from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base
from app.api import (
    auth, upload, contracts, parse,
    vectorstore, analyze, reports, playbooks,
    comparison, feedback
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(contracts.router, prefix=settings.API_V1_STR)
app.include_router(parse.router, prefix=settings.API_V1_STR)
app.include_router(vectorstore.router, prefix=settings.API_V1_STR)
app.include_router(analyze.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(playbooks.router, prefix=settings.API_V1_STR)
app.include_router(comparison.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "mode": "Rule-Based Demo Mode" if not settings.OPENAI_API_KEY else "Hybrid LLM Mode"
    }

@app.get("/", tags=["root"])
def root():
    return {
        "message": "Welcome to AI Contract Risk Analyzer API",
        "docs": "/docs",
        "health": "/api/health"
    }
