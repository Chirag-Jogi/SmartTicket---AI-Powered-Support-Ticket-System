import os
from google import genai
from google.genai import types
import json
from typing import Dict, Optional


class LLMService:
    """
    Service for interacting with Google Gemini API for ticket classification
    """
    
    def __init__(self):
        """Initialize Gemini client"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize Client with API version
        self.client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(api_version='v1')
        )
        
        self.model = 'gemini-2.5-flash'
    
    def classify_ticket(self, description: str) -> Optional[Dict[str, str]]:
        """
        Classify a ticket description into category and priority
        
        Args:
            description: The ticket description text
            
        Returns:
            Dict with 'category' and 'priority' keys, or None if classification fails
        """
        
        if not description or not description.strip():
            return None
        
        # Construct the prompt
        prompt = self._build_classification_prompt(description)
        
        try:
            # Call Gemini API
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            
            # Extract response text
            response_text = response.text.strip()
            
            # Parse JSON response
            result = self._parse_response(response_text)
            
            return result
            
        except Exception as e:
            print(f"LLM classification error: {e}")
            return None
    
    def _build_classification_prompt(self, description: str) -> str:
        """
        Build the classification prompt for Gemini
        """
        prompt = f"""You are a support ticket classification assistant. Analyze the following support ticket description and classify it into a category and priority level.

**Ticket Description:**
{description}

**Categories:**
- billing: Issues related to payments, charges, refunds, subscriptions
- technical: Technical problems, bugs, app crashes, performance issues
- account: Account access, login issues, password resets, profile settings
- general: Questions, feature requests, feedback, or anything else

**Priority Levels:**
- low: Minor issues, questions, feature requests, no urgency
- medium: Normal issues that need attention but aren't urgent
- high: Important issues affecting user experience, time-sensitive
- critical: Severe issues, service outages, data loss, payment problems

**Instructions:**
1. Analyze the description carefully
2. Consider urgency indicators (words like "urgent", "immediately", "can't access", "not working")
3. Consider impact (affects work, payments, security)
4. Respond ONLY with valid JSON in this exact format:

{{"category": "billing", "priority": "high"}}

Do not include any explanation, markdown formatting, or additional text. Only output the JSON object."""

        return prompt
    
    def _parse_response(self, response_text: str) -> Optional[Dict[str, str]]:
        """
        Parse Gemini's response and extract category and priority
        """
        try:
            # Remove any markdown code blocks if present
            response_text = response_text.replace('```json', '').replace('```', '').strip()
            
            # Parse JSON
            data = json.loads(response_text)
            
            # Validate structure
            if 'category' not in data or 'priority' not in data:
                return None
            
            # Validate values
            valid_categories = ['billing', 'technical', 'account', 'general']
            valid_priorities = ['low', 'medium', 'high', 'critical']
            
            category = data['category'].lower()
            priority = data['priority'].lower()
            
            if category not in valid_categories or priority not in valid_priorities:
                return None
            
            return {
                'category': category,
                'priority': priority
            }
            
        except json.JSONDecodeError:
            return None
        except Exception:
            return None