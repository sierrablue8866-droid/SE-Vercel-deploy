# Placeholder for Vertex AI Tool declarations

save_listing_func = {
    "name": "save_listing",
    "description": "Saves a newly extracted property listing to the Sierra Estates CRM database.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "compound": {"type": "STRING", "description": "The name of the compound or location"},
            "price": {"type": "NUMBER", "description": "The price of the property in EGP"},
            "bedrooms": {"type": "INTEGER", "description": "Number of bedrooms"},
            "type": {"type": "STRING", "description": "Type of property e.g. villa, apartment"},
        },
        "required": ["compound", "price"]
    }
}

send_whatsapp_func = {
    "name": "send_whatsapp_message",
    "description": "Sends a WhatsApp message to a specific phone number or group.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "phone_number": {"type": "STRING", "description": "The destination phone number"},
            "message": {"type": "STRING", "description": "The text message to send"},
        },
        "required": ["phone_number", "message"]
    }
}

# These dicts would be wrapped in vertexai.generative_models.FunctionDeclaration
# and grouped into a Tool object when initializing the model.
