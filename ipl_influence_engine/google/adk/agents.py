class Agent:
    """Mock Agent class for local Google ADK shim."""
    def __init__(self, name, instruction, tools=None, model="gemini-flash-latest", description=None):
        self.name = name
        self.instruction = instruction
        self.tools = tools or []
        self.model = model
        self.description = description

    def run(self, query):
        """Mock run method that routes to the correct tool."""
        if self.tools:
            try:
                # Find the debate tool or use the first one
                tool = next((t for t in self.tools if t.__name__ in ('debate_tool', 'estimate_sponsor_roi')), self.tools[0])
                
                # Execute tool
                result = tool(query)
                import json
                return type('Response', (), {'output': json.dumps(result)})
            except Exception as e:
                import json
                return type('Response', (), {'output': json.dumps({"error": str(e)})})
        return type('Response', (), {'output': '{"message": "No tools available"}'})
