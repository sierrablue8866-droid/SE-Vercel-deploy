<<<<<<< HEAD
"""Sierra Estates API main module."""
=======
>>>>>>> origin/client
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from property_finder_sync import PropertyFinderSyncHub

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sierra Estates API",
    description="Consolidated Python backend for Sierra Estates integrations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sync_hub = PropertyFinderSyncHub()


class PortfolioAsset(BaseModel):
<<<<<<< HEAD
    """Represents a single portfolio asset for synchronization."""
=======
>>>>>>> origin/client
    id: str = Field(..., description="Internal Sierra Estates asset identifier")
    title_en: str | None = None
    title_ar: str | None = None
    price: int | float | None = None
    location: str | None = None


class SyncRequest(BaseModel):
<<<<<<< HEAD
    """Request model containing a batch of assets to synchronize."""
=======
>>>>>>> origin/client
    assets: List[PortfolioAsset]


@app.get("/health")
def health() -> Dict[str, str]:
<<<<<<< HEAD
    """Health check endpoint."""
=======
>>>>>>> origin/client
    return {"status": "ok", "service": "apps/api"}


@app.post("/property-finder/format")
def format_asset(asset: PortfolioAsset) -> Dict[str, Any]:
<<<<<<< HEAD
    """Format a single asset for Property Finder."""
=======
>>>>>>> origin/client
    return sync_hub.format_portfolio_asset(asset.model_dump())


@app.post("/property-finder/sync")
def sync_assets(body: SyncRequest) -> Dict[str, Any]:
<<<<<<< HEAD
    """Trigger a batch synchronization to Property Finder."""
=======
>>>>>>> origin/client
    return sync_hub.trigger_batch_sync([asset.model_dump() for asset in body.assets])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
