import re

file_path = r'C:\sovereignX\ai_backend\ollama_client.py'
with open(file_path, 'r') as f:
    content = f.read()

pattern = re.compile(r'    async def generate_response\(.*?(?=    async def close|\Z)', re.DOTALL)

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

        user_message: Dict[str, Any] = {"role": "user", "content": prompt}
        if images and isinstance(images, list):
            cleaned_images = []
            for img in images:
                if img.startswith("data:"):
                    img = img.split(",", 1)[1]
                cleaned_images.append(img)
            user_message["images"] = cleaned_images
        messages.append(user_message)

        payload: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"num_ctx": 2048, "temperature": 0.2}
        }
        if keep_alive is not None:
            payload["keep_alive"] = keep_alive

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
            else:
                logger.warning(f"Ollama {model} failed with status {res.status_code}: {res.text}")
                if fallback_model:
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
