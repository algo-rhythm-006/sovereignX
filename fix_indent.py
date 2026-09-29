import re

file_path = r'C:\sovereignX\ai_backend\ollama_client.py'
with open(file_path, 'r') as f:
    content = f.read()

# I will just write a completely clean version of generate_response using regex substitution.
pattern = re.compile(r'    async def generate_response\(.*?(?=    async def|    def|\Z)', re.DOTALL)

new_func = '''    async def generate_response(
        self,
        model: str,
        prompt: str,
        system_prompt: Optional[str] = None,
        images: Optional[List[str]] = None,
        fallback_model: Optional[str] = None,
        keep_alive: Optional[int] = None,
        history_messages: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        messages: List[Dict[str, Any]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        if history_messages:
            for msg in history_messages:
                messages.append({"role": msg["role"], "content": msg["content"]})

        # If vision model / images present, use /api/generate
        if images and isinstance(images, list):
            cleaned_images = []
            for img in images:
                if img.startswith("data:"):
                    img = img.split(",", 1)[1]
                cleaned_images.append(img)
            
            payload = {
                "model": model,
                "prompt": prompt,
                "images": cleaned_images,
                "stream": False,
                "options": {"num_ctx": 2048, "temperature": 0.2}
            }
            if system_prompt:
                payload["system"] = system_prompt
            if keep_alive is not None:
                payload["keep_alive"] = keep_alive

            try:
                res = await self.client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "success": True,
                        "model_used": model,
                        "response": data.get("response", ""),
                        "simulated": False
                    }
            except Exception as e:
                logger.warning(f"Ollama connection error for model {model}: {e}")
            
            return {
                "success": False,
                "model_used": model,
                "response": f"[SIMULATED - {model}] Visual asset analysis complete.",
                "simulated": True
            }

        # Otherwise, use /api/chat
        user_message: Dict[str, Any] = {"role": "user", "content": prompt}
        messages.append(user_message)

        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"num_ctx": 2048, "temperature": 0.2}
        }
        if keep_alive is not None:
            payload["keep_alive"] = keep_alive
            logger.info(f"[VRAM] keep_alive={keep_alive}s set for model '{model}'")

        try:
            res = await self.client.post(f"{self.base_url}/api/chat", json=payload)
            if res.status_code == 200:
                data = res.json()
                return {
                    "success": True,
                    "model_used": model,
                    "response": data.get("message", {}).get("content", ""),
                    "simulated": False
                }
            elif fallback_model:
                payload["model"] = fallback_model
                res_fb = await self.client.post(f"{self.base_url}/api/chat", json=payload)
                if res_fb.status_code == 200:
                    data = res_fb.json()
                    return {
                        "success": True,
                        "model_used": fallback_model,
                        "response": data.get("message", {}).get("content", ""),
                        "simulated": False
                    }
        except Exception as e:
            logger.warning(f"Ollama connection error for model {model}: {e}")

        return {
            "success": False,
            "model_used": model,
            "response": f"[SIMULATED - {model}] Processing complete.",
            "simulated": True
        }

'''

content = pattern.sub(new_func, content)
with open(file_path, 'w') as f:
    f.write(content)
