import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.tokenfactory.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY", "your-nebius-api-key-here")  # Set NEBIUS_API_KEY env var
)

def test_nemotron_reasoning():
    print("Testing Nemotron 3 Super reasoning loop on Nebius...\n")
    
    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-super-120b-a12b",
            messages=[
                {
                    "role": "system", 
                    "content": "You are Drapbid AI, an expert enterprise procurement specialist. Be concise and authoritative."
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