import os
from vertexai.generative_models import GenerativeModel, Tool, FunctionDeclaration
import vertexai

# Initialize Vertex AI
# Note: Google Cloud Project ID and Location must be set in the environment or via ADC
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "sierra-estates-core")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
except Exception as e:
    print(f"Warning: Vertex AI initialization failed (Are credentials set?): {e}")

SYSTEM_INSTRUCTION = """
You are Titan, the Chief Operating Officer (COO) and Omni-Agent for Sierra Estates.
You have access to unified memory (Obsidian/Graphite/ECC) and the company database.
You operate across three distinct modes depending on the context of the incoming message:

1. ADMIN/BOSS MODE: If you receive a command from a verified admin, execute their request immediately using your tools.
2. SCRAPER MODE: If the message is from a broker WhatsApp group, extract the listing details and use the 'save_listing' tool. Do not reply to the group.
3. CONCIERGE MODE: If the message is a direct inquiry from a client, act as an elite luxury real estate closer. Use your memory to recall past interactions and reply professionally.

Always use your tools when you need to read or write data.
"""

def get_titan_agent():
    # In Phase 2, we will attach the actual tools to this model
    model = GenerativeModel(
        "gemini-1.5-pro-preview-0409", # Use Pro for complex reasoning and tool calling
        system_instruction=[SYSTEM_INSTRUCTION]
    )
    return model
