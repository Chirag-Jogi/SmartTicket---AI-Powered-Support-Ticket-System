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
        prompt = f"""You are a support ticket classification assistant. Analyze the support ticket and classify it accurately.

**Ticket Description:**
{description}

---

**CATEGORIES (with examples):**

**billing** - Payment and money-related issues ONLY
Examples: "charged twice", "refund not received", "subscription cancelled but still charged", "payment method declined"
NOT billing: profile pictures, upload errors, slow loading

**technical** - Software bugs, errors, crashes, performance issues
Examples: "app crashes", "error message appears", "can't upload files", "feature not working", "page won't load", "slow performance"
Key indicators: error messages, crashes, upload failures, technical malfunctions

**account** - Login, password, email changes, account settings (NOT technical errors)
Examples: "forgot password", "can't log in", "want to change email", "delete my account", "update profile information"
NOT account: upload errors (that's technical), anything with error messages

**general** - Everything else: questions, feedback, feature requests, how-to inquiries
Examples: "how do I...", "can you add...", "suggestion for improvement", "when will X be available"

---

**PRIORITY LEVELS (be conservative - when in doubt, go lower):**

**critical** - ONLY for: complete service outage, data loss, security breach, account locked out entirely
Examples: "entire app is down", "lost all my data", "account hacked", "can't access anything"
NOT critical: payment issues (they get resolved), single feature broken, slow performance

**high** - Significantly impacts user's main workflow or involves money actively blocked
Examples: "can't complete purchase for urgent need", "payment failed for time-sensitive transaction", "main feature completely broken preventing work"
Important: money issues are high ONLY if time-sensitive or actively blocking work

**medium** - Normal issues that need fixing but user can work around or aren't time-sensitive
Examples: "one feature not working but others work", "slow performance", "payment failed but can retry", "error in non-critical feature"
Default for most technical issues and payment problems that can be retried

**low** - Minor inconveniences, questions, feature requests, cosmetic issues
Examples: "small visual bug", "feature request", "how-to question", "typo in text"

---

**DISAMBIGUATION RULES:**
1. File upload errors = technical (NOT account), even if it's profile pictures
2. Payment failures = billing + high ONLY if time-critical, otherwise medium
3. Slow performance = technical + medium (NOT high unless completely unusable)
4. "Can't access" + error = technical (NOT account unless it's login/password specifically)
5. When unsure about priority: choose the LOWER option

---

**OUTPUT FORMAT:**
Respond ONLY with valid JSON (no markdown, no explanation):

{{"category": "technical", "priority": "medium"}}

Analyze the description above and classify it now."""


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