import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.tokenfactory.nebius.com/v1/",
    api_key="v1.CmMKHHN0YXRpY2tleS1lMDBxbWZweWY4ZnhqN3I0N3ESIXNlcnZpY2VhY2NvdW50LWUwMGdnODJwbnJzcDd4YWsxbjILCPu1pNUGEJSE7TI6DAj6uLygBxDAxfjtAUACWgNlMDA.AAAAAAAAAAGPXDv5_IhCjp4s7-jgXYH59JmVnynCHOzuGtFDx9oS93e1qqvAh91MW3H8WW8mn1J4z1tLOk_RHu6Eh8TGdzEH"  # <-- Make sure your key is here
)

def test_nemotron_reasoning():
    print("Testing Nemotron 3 Super reasoning loop on Nebius...\n")
    
    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-super-120b-a12b",
            messages=[
                {
                    "role": "system", 
                    "content": "You are GovBid AI, an expert enterprise procurement specialist. Be concise and authoritative."
                },
                {
                    "role": "user", 
                    "content": "List the 3 most critical compliance requirements typically found in government IT RFPs."
                }
            ],
            # Give it enough room to both think AND write the final output
            max_tokens=600,
            temperature=0.2
        )
        
        message = response.choices[0].message
        
        # 1. Extract internal reasoning (Chain of Thought)
        reasoning = getattr(message, "reasoning_content", None) or getattr(message, "model_extra", {}).get("reasoning_content")
        if reasoning:
            print("🧠 Nemotron's Thinking Process:")
            print("-" * 50)
            print(reasoning)
            print("-" * 50 + "\n")
            
        # 2. Extract final response
        print("📋 Final Answer:")
        print(message.content)
        print("\n✅ Verification complete! Tokens used:", response.usage.total_tokens)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_nemotron_reasoning()