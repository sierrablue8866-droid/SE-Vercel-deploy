from fastapi import FastAPI, Request
from agent_core import get_titan_agent
import logging

app = FastAPI(title="Vertex Omni-Agent (Titan)")
logger = logging.getLogger("uvicorn.error")

@app.post("/webhook/whatsapp")
async def whatsapp_webhook(request: Request):
    """
    Receives incoming WhatsApp messages from the scraper.
    """
    data = await request.json()
    message = data.get("Body", "")
    sender = data.get("from", "")
    is_group = data.get("isGroup", False)
    
    logger.info(f"Received message from {sender} (Group: {is_group})")

    # Initialize Agent
    agent = get_titan_agent()
    
    # In Phase 2, we will inject Memory (ECC/Graphite) here before prompting the agent
    prompt = f"Sender: {sender}\nIs Group: {is_group}\nMessage: {message}\n\nExecute your directives based on your system instructions."
    
    # Let Vertex AI process the message
    try:
        response = agent.generate_content(prompt)
        reply_text = response.text
        
        # If the agent decides it needs to reply (Concierge Mode), it will output text
        # If the agent used a tool (Scraper Mode), reply_text might be empty
        
        return {"status": "processed", "replyMessage": reply_text if not is_group else None}
        
    except Exception as e:
        logger.error(f"Agent processing failed: {e}")
        return {"error": str(e)}, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
