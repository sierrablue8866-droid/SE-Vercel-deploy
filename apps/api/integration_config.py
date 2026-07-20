"""
i:Sierra 2027 — Backend Integration Configuration
Python-side config for Firestore sync, Property Finder API, analytics, and Vercel hooks.
ALL SECRETS VIA ENVIRONMENT VARIABLES — never hardcode keys.
"""

import os
from dataclasses import dataclass, field
from typing import Optional


# ═══════════════════════════════════════════════════════════
#  BUSINESS LOGIC CONSTANTS (hardcoded per Sierra Estates spec)
# ═══════════════════════════════════════════════════════════

CURRENCY_THRESHOLD = 10_000  # < 10k = USD, >= 10k = EGP
VALUE_HUNTER_RATIO = 0.70    # <= 70% of compound mean = "High Value"

# Master compound coordinates (New Cairo)
COMPOUND_COORDS = {
    "MIV": {"name": "Mivida", "lat": 30.0104, "lng": 31.5165},
    "EST": {"name": "Eastown", "lat": 30.0152, "lng": 31.4984},
    "MDT": {"name": "Madinaty", "lat": 30.1071, "lng": 31.6404},
    "MNT": {"name": "Mountain View", "lat": 30.0220, "lng": 31.4730},
    "HYD": {"name": "Hyde Park", "lat": 30.0085, "lng": 31.4924},
    "LKV": {"name": "Lake View", "lat": 30.0198, "lng": 31.4886},
    "PAL": {"name": "Palm Hills", "lat": 30.0312, "lng": 31.4601},
    "VGN": {"name": "Villette", "lat": 30.0076, "lng": 31.5089},
    "UPT": {"name": "Uptown Cairo", "lat": 30.0568, "lng": 31.4113},
    "SRK": {"name": "El Shorouk", "lat": 30.1282, "lng": 31.6088},
}

# Furnishing codes for SBR ticker
FURNISHING_CODES = {
    "furnished": "F",
    "semi-furnished": "S",
    "unfurnished": "U",
}

# CRM pipeline stages
CRM_STAGES = [
    "S1_Intake", "S2_Qualification", "S3_Matching", "S4_Proposal",
    "S5_Viewing", "S6_Negotiation", "S7_Offer", "S8_Contract",
    "S9_Payment", "S10_Closing",
]


# ═══════════════════════════════════════════════════════════
#  CONFIG DATACLASSES
# ═══════════════════════════════════════════════════════════

@dataclass
class FirestoreConfig:
    """Firebase / Firestore connection settings."""
    project_id: str = os.getenv("FIREBASE_PROJECT_ID", "sierra-blu-realty")
    credentials_path: Optional[str] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    database_url: str = os.getenv(
        "FIREBASE_DATABASE_URL",
        "https://sierra-blu-realty.firebaseio.com"
    )
    collections: dict = field(default_factory=lambda: {
        "properties": "properties",
        "leads": "leads",
        "advisors": "advisors",
        "transactions": "transactions",
        "analytics": "analytics",
        "scraped_records": "scraped_records",
    })


@dataclass
class PropertyFinderConfig:
    """Property Finder API integration."""
    api_key: Optional[str] = os.getenv("PROPERTY_FINDER_API_KEY")
    base_url: str = os.getenv(
        "PROPERTY_FINDER_API_URL",
        "https://api.propertyfinder.eg"
    )
    xml_feed_url: str = os.getenv(
        "XML_FEED_URL",
        "https://www.sierra-blu.com/api/xml-feed"
    )
    listings_url: str = "https://www.sierra-blu.com/listings"


@dataclass
class VercelConfig:
    """Vercel deployment configuration."""
    team_id: Optional[str] = os.getenv("VERCEL_TEAM_ID")
    project_id: Optional[str] = os.getenv("VERCEL_PROJECT_ID")
    token: Optional[str] = os.getenv("VERCEL_TOKEN")
    production_url: str = os.getenv("VERCEL_URL", "sierra-estates.vercel.app")
    framework: str = "nextjs"
    build_command: str = "npm run build"


@dataclass
class SierraOS:
    """Intelligence engine thresholds."""
    version: str = "4.0.0"
    matching_score_threshold: float = 0.75
    high_intensity_lead: float = 0.85
    price_deviation_alert: float = 0.15
    enabled_engines: dict = field(default_factory=lambda: {
        "gemini_nlp": True,
        "matching_neural_net": True,
        "marketing_automation": True,
        "orchestration_ledger": True,
    })


@dataclass
class APIConfig:
    """External API endpoints — ALL from env vars."""
    gemini_api_key: Optional[str] = os.getenv("GEMINI_API_KEY")
    telegram_bot_token: Optional[str] = os.getenv("TELEGRAM_BOT_TOKEN")
    arize_space_key: Optional[str] = os.getenv("ARIZE_SPACE_KEY")
    arize_api_key: Optional[str] = os.getenv("ARIZE_API_KEY")
    kuula_api_key: Optional[str] = os.getenv("KUULA_API_KEY")


@dataclass
class IntegrationConfig:
    """Master config — single import for all backend services."""
    firestore: FirestoreConfig = field(default_factory=FirestoreConfig)
    property_finder: PropertyFinderConfig = field(default_factory=PropertyFinderConfig)
    vercel: VercelConfig = field(default_factory=VercelConfig)
    os_engine: SierraOS = field(default_factory=SierraOS)
    api: APIConfig = field(default_factory=APIConfig)

    branding = {
        "name": "Sierra Estates",
        "former_name": "Sierra Blu",
        "tagline": "Best-in-Class Design. AI-Driven Excellence.",
        "palette": {
            "navy": "#0A1628",
            "gold": "#C9A24D",
            "ivory": "#F4F0E8",
        },
    }

    def validate(self) -> list[str]:
        """Return list of missing critical env vars."""
        issues: list[str] = []
        if not self.firestore.project_id:
            issues.append("FIREBASE_PROJECT_ID not set")
        if not self.property_finder.api_key:
            issues.append("PROPERTY_FINDER_API_KEY not set")
        if not self.api.gemini_api_key:
            issues.append("GEMINI_API_KEY not set")
        if not self.vercel.token:
            issues.append("VERCEL_TOKEN not set (deploy will fail)")
        return issues


# ═══════════════════════════════════════════════════════════
#  UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════

def format_price(amount: float) -> str:
    """Apply Sierra Estates currency threshold rule."""
    if amount < CURRENCY_THRESHOLD:
        return f"${amount:,.0f}"
    return f"{amount:,.0f} EGP"


def generate_sbr_code(compound: str, rooms: int, furnishing: str, price: float) -> str:
    """Generate SBR property ticker code.
    Example: MIV-3F-1.6K for Mivida, 3BR, Furnished, $1,600
    """
    furn_code = FURNISHING_CODES.get(furnishing.lower(), "U")
    if price < CURRENCY_THRESHOLD:
        price_code = f"{price / 1000:.1f}K"
    else:
        price_code = f"{price / 1_000_000:.1f}M"
    return f"{compound}-{rooms}{furn_code}-{price_code}"


def is_value_hunter_deal(price: float, compound_mean: float) -> bool:
    """Check if property qualifies for High Value gold badge."""
    if compound_mean <= 0:
        return False
    return price <= (compound_mean * VALUE_HUNTER_RATIO)


# Singleton
config = IntegrationConfig()
