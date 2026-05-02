export const MOCK_INTERVIEW_DATA = {
  questions: {
    easy: [
      "What is the difference between a prompt and a completion in the context of LLMs?",
      "Can you explain what 'temperature' does when generating text with an AI model?",
      "What are the basic steps to build a simple RAG (Retrieval-Augmented Generation) system?",
      "How do you handle basic error cases when calling an LLM API?"
    ],
    medium: [
      "Explain the tradeoff between using fine-tuning vs. few-shot prompting for a domain-specific task.",
      "How would you implement a basic vector search using a tool like Pinecone or ChromaDB?",
      "Describe the concept of 'Chains' in frameworks like LangChain or AI SDK.",
      "What are the primary considerations for implementing safety guardrails in a customer-facing LLM app?"
    ],
    hard: [
      "How would you optimize a RAG pipeline for a 10M document corpus with sub-second latency requirements?",
      "Describe your approach to implementing a multi-agent system using LangGraph for complex task decomposition.",
      "How do you handle multi-hop reasoning in a GraphRAG architecture using Vertex AI and Neo4j?",
      "What is your strategy for implementing semantic caching to reduce costs and latency in high-traffic applications?",
      "How do you handle 'hallucination' in a production MLOps pipeline using automated evaluation metrics like ROUGE or BERTScore?"
    ]
  },
  evaluations: [
    {
      score: 8.5,
      critique: "FEEDBACK: Your explanation was technically sound and demonstrated a strong grasp of Agentic workflows. You correctly identified the need for multi-step reasoning. However, mentioning specific orchestration layers like LangGraph would have shown more depth.",
      perfectAnswer: "NEXT QUESTION: Building on that, how would you implement an automated evaluation loop to measure the faithfulness of the agent's reasoning?"
    },
    {
      score: 6.2,
      critique: "FEEDBACK: You have a good high-level understanding, but your answer lacked technical specificity regarding index optimization. Communication was a bit hesitant with several filler words.",
      perfectAnswer: "NEXT QUESTION: Let's pivot to memory. How would you implement a persistent 'Long-term Memory' for an agent using a vector database?"
    },
    {
      score: 9.5,
      critique: "FEEDBACK: Exceptional depth. Your analysis of KV-caching and inference efficiency aligns perfectly with modern AI standards. Extremely clear communication.",
      perfectAnswer: "NEXT QUESTION: Excellent. How would you design a multi-agent system where a smaller 'drafter' model is verified by a larger 'judge' model?"
    }
  ]
};

export const MOCK_STRATEGIES = [
  {
    skillGap: [
      { skill: "Vector Databases", current: "Conceptual", required: "Professional", gap: 8 },
      { skill: "Prompt Engineering", current: "Basic", required: "Expert", gap: 6 },
      { skill: "MLOps Pipelines", current: "None", required: "Intermediate", gap: 9 },
      { skill: "Vertex AI SDK", current: "Beginner", required: "Advanced", gap: 7 }
    ],
    radarData: [
      { skill: "Python/TS", current: 9, required: 10 },
      { skill: "GenAI Models", current: 3, required: 9 },
      { skill: "Cloud Arch", current: 5, required: 8 },
      { skill: "Vector Search", current: 2, required: 8 },
      { skill: "Data Eng", current: 6, required: 7 },
      { skill: "MLOps", current: 1, required: 7 }
    ],
    mermaidDiagram: "graph TD\n  User((User)) --> FE[Next.js Frontend]\n  FE --> BE[Cloud Run Backend]\n  BE --> Embed[Vertex AI Embeddings]\n  Embed --> Vector[(AlloyDB Vector Search)]\n  Vector --> Context[Context Retrieval]\n  Context --> LLM[Gemini 1.5 Pro]\n  LLM --> Response[Final Answer]",
    roadmap: [
      { 
        milestone: "Month 1: Foundation & Embeddings", 
        duration: "4 Weeks", 
        details: ["Master Vertex AI SDK for Node.js", "Implement RAG with Pinecone/AlloyDB", "Learn Vector Embeddings fundamentals"] 
      },
      { 
        milestone: "Month 2: LLM Orchestration", 
        duration: "4 Weeks", 
        details: ["Build agentic workflows with LangGraph", "Implement Tool Calling & Function Calling", "Optimize system prompts for Gemini"] 
      }
    ],
    cloudStack: [
      { service: "Vertex AI", role: "Model Orchestration", useCase: "Serving Gemini and custom embedding models" },
      { service: "AlloyDB", role: "Vector Storage", useCase: "Storing and searching technical embeddings" }
    ]
  },
  {
    skillGap: [
      { skill: "LangGraph", current: "None", required: "Advanced", gap: 10 },
      { skill: "BigQuery ML", current: "Intermediate", required: "Expert", gap: 5 },
      { skill: "System Prompts", current: "Basic", required: "Advanced", gap: 7 }
    ],
    radarData: [
      { skill: "Python/TS", current: 7, required: 9 },
      { skill: "GenAI Models", current: 4, required: 10 },
      { skill: "Cloud Arch", current: 6, required: 9 },
      { skill: "Vector Search", current: 3, required: 8 },
      { skill: "Data Eng", current: 8, required: 9 },
      { skill: "MLOps", current: 2, required: 8 }
    ],
    mermaidDiagram: "graph LR\n  Data[BigQuery Data] --> Pipe[Dataflow]\n  Pipe --> Vector[(Vector Index)]\n  User[User Query] --> Agent[LangGraph Agent]\n  Agent --> Vector\n  Vector --> RAG[RAG Engine]\n  RAG --> LLM[Gemini Flash]",
    roadmap: [
      { 
        milestone: "Phase 1: BigQuery AI", 
        duration: "3 Weeks", 
        details: ["Leverage BigQuery ML for structured data", "Vector search in BigQuery", "SQL-based AI models"] 
      },
      { 
        milestone: "Phase 2: Agentic Design", 
        duration: "5 Weeks", 
        details: ["Multi-agent patterns with LangGraph", "Implementing stateful conversations", "Tool integration for agents"] 
      }
    ],
    cloudStack: [
      { service: "BigQuery", role: "Data Warehouse", useCase: "Primary data source and ML feature store" },
      { service: "Dataflow", role: "Processing", useCase: "Real-time embedding generation pipelines" }
    ]
  }
];

export const getRandomMockQuestion = (difficulty?: 'easy' | 'medium' | 'hard') => {
  const levels = difficulty ? [difficulty] : (['easy', 'medium', 'hard'] as const);
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];
  const questions = MOCK_INTERVIEW_DATA.questions[selectedLevel];
  return questions[Math.floor(Math.random() * questions.length)];
};

export const getRandomMockEvaluation = () => {
  return MOCK_INTERVIEW_DATA.evaluations[Math.floor(Math.random() * MOCK_INTERVIEW_DATA.evaluations.length)];
};

export const getRandomMockStrategy = () => {
  const baseStrategy = MOCK_STRATEGIES[Math.floor(Math.random() * MOCK_STRATEGIES.length)];
  
  // Deep clone to avoid mutating the base array
  const strategy = JSON.parse(JSON.stringify(baseStrategy));
  
  // Add slight random variance to numbers to make each generation feel unique
  strategy.skillGap = strategy.skillGap.map((gap: any) => ({
    ...gap,
    gap: Math.max(1, Math.min(10, gap.gap + Math.floor(Math.random() * 3) - 1)) // +/- 1
  }));
  
  strategy.radarData = strategy.radarData.map((data: any) => ({
    ...data,
    current: Math.max(1, Math.min(10, data.current + Math.floor(Math.random() * 3) - 1)), // +/- 1
    required: Math.max(1, Math.min(10, data.required + Math.floor(Math.random() * 2))) // +0 to 1
  }));

  return strategy;
};
