import { NextResponse } from 'next/server';

// Custom interface for nodes matching React Flow schema
interface MindMapNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; subtext?: string };
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

interface MindMapData {
  nodes: any[]; // Using raw type here, we will format it with helper
  edges: MindMapEdge[];
}

// Helper function to format nodes into valid React Flow schemas
function formatNode(node: any, index: number): MindMapNode {
  const label = node.data?.label || node.label || 'Node';
  const subtext = node.data?.subtext || node.subtext || '';
  let pos = node.position;
  if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
    pos = { x: 60, y: 10 + index * 110 };
  }
  return {
    id: node.id,
    type: node.type || 'generic',
    position: pos,
    data: { label, subtext }
  };
}

// Tailored high-fidelity fallbacks for projects
const FALLBACK_MAPS: Record<string, MindMapData> = {
  'd-scent-house': {
    nodes: [
      { id: 'user', label: 'Customer Browses', type: 'user', subtext: 'Selects fragrance & qty', position: { x: 60, y: 10 } },
      { id: 'frontend', label: 'Next.js 14 Storefront', type: 'frontend', subtext: 'Cart + Stripe checkout flow', position: { x: 60, y: 120 } },
      { id: 'payment', label: 'Stripe Payment', type: 'payment', subtext: 'Webhook confirms charge', position: { x: 60, y: 230 } },
      { id: 'backend', label: 'pg_notify Job Queue', type: 'backend', subtext: 'Triggers fulfillment pipeline', position: { x: 60, y: 340 } },
      { id: 'email', label: 'Transactional Email', type: 'email', subtext: 'Order confirm + shipping', position: { x: 60, y: 450 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'frontend', animated: true },
      { id: 'e2', source: 'frontend', target: 'payment', animated: true },
      { id: 'e3', source: 'payment', target: 'backend', animated: true },
      { id: 'e4', source: 'backend', target: 'email', animated: true },
    ]
  },
  'coach-jake': {
    nodes: [
      { id: 'user', label: 'Head Coach Login', type: 'user', subtext: 'Role-gated entry point', position: { x: 60, y: 10 } },
      { id: 'auth', label: 'NextAuth.js JWT', type: 'auth', subtext: 'Role claims check, no DB round-trip', position: { x: 60, y: 120 } },
      { id: 'frontend', label: 'Next.js 14 KPI Dashboard', type: 'frontend', subtext: 'Cached on 30s revalidation interval', position: { x: 60, y: 230 } },
      { id: 'database', label: 'PostgreSQL DB Query', type: 'database', subtext: 'O(1) indexed claim check', position: { x: 60, y: 340 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'auth', animated: true },
      { id: 'e2', source: 'auth', target: 'frontend', animated: true },
      { id: 'e3', source: 'frontend', target: 'database', animated: true },
    ]
  },
  'unick-auto-detailing': {
    nodes: [
      { id: 'user', label: 'Customer Goal Input', type: 'user', subtext: '"Make my car showroom-ready"', position: { x: 60, y: 10 } },
      { id: 'llm', label: 'OpenAI Function Calling', type: 'llm', subtext: 'Maps goal → service package', position: { x: 60, y: 120 } },
      { id: 'frontend', label: 'Booking Confirmation', type: 'frontend', subtext: 'Slot + upsell rendered instantly', position: { x: 60, y: 230 } },
      { id: 'sms', label: 'Twilio SMS Feedback', type: 'sms', subtext: 'Auto rebooking reminder sent', position: { x: 60, y: 340 } },
      { id: 'database', label: 'PostgreSQL CRM', type: 'database', subtext: 'Customer history + preferences', position: { x: 60, y: 450 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'llm', animated: true },
      { id: 'e2', source: 'llm', target: 'frontend', animated: true },
      { id: 'e3', source: 'frontend', target: 'sms', animated: true },
      { id: 'e4', source: 'frontend', target: 'database', animated: true },
    ]
  },
  'citrix-rag-knowledge-assistant': {
    nodes: [
      { id: 'user', label: 'Support Engineer Query', type: 'user', subtext: 'Natural language question', position: { x: 60, y: 10 } },
      { id: 'backend', label: 'LangChain Pipeline', type: 'backend', subtext: 'Chunk retrieval + context assembly', position: { x: 60, y: 120 } },
      { id: 'vector', label: 'Pinecone Vector Store', type: 'vector', subtext: '40K KB articles indexed', position: { x: 60, y: 230 } },
      { id: 'llm', label: 'Azure OpenAI GPT-4', type: 'llm', subtext: 'Answer + regex citation validation', position: { x: 60, y: 340 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'backend', animated: true },
      { id: 'e2', source: 'backend', target: 'vector', animated: true },
      { id: 'e3', source: 'vector', target: 'llm', animated: true },
    ]
  },
  'koreai-customer-service-agent': {
    nodes: [
      { id: 'user', label: 'Customer Message', type: 'user', subtext: 'Live chat or email channel', position: { x: 60, y: 10 } },
      { id: 'agent', label: 'Kore.ai NLU Engine', type: 'agent', subtext: 'Retrained intent classifier', position: { x: 60, y: 120 } },
      { id: 'webhook', label: 'Spring Boot Middleware', type: 'webhook', subtext: 'Idempotency key deduplication', position: { x: 60, y: 230 } },
      { id: 'database', label: 'CRM + Ticket DB', type: 'database', subtext: '28% fewer duplicate escalations', position: { x: 60, y: 340 } },
    ],
    edges: [
      { id: 'e1', source: 'user', target: 'agent', animated: true },
      { id: 'e2', source: 'agent', target: 'webhook', animated: true },
      { id: 'e3', source: 'webhook', target: 'database', animated: true },
    ]
  }
};

const DEFAULT_FALLBACK: MindMapData = {
  nodes: [
    { id: 'user', label: 'User Client', type: 'user', position: { x: 110, y: 10 } },
    { id: 'frontend', label: 'Frontend UI', type: 'frontend', position: { x: 110, y: 100 } },
    { id: 'backend', label: 'Backend Server', type: 'backend', position: { x: 110, y: 190 } },
    { id: 'database', label: 'Database', type: 'database', position: { x: 110, y: 280 } }
  ],
  edges: [
    { id: 'e1', source: 'user', target: 'frontend', animated: true },
    { id: 'e2', source: 'frontend', target: 'backend', animated: true },
    { id: 'e3', source: 'backend', target: 'database', animated: true }
  ]
};

function handleFallback(id: string) {
  const fallback = FALLBACK_MAPS[id] || FALLBACK_MAPS[id?.replace(/-app$/, '')] || DEFAULT_FALLBACK;
  return {
    nodes: fallback.nodes.map((node, idx) => formatNode(node, idx)),
    edges: fallback.edges
  };
}

export async function POST(req: Request) {
  try {
    const { id, title, description, approach, stack } = await req.json();

    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('Gemini API key missing, returning formatted fallback map');
      return NextResponse.json(handleFallback(id));
    }

    // Build the prompt for Gemini
    const prompt = `You are a software architect. Analyze the following project description:
Title: ${title || 'Project'}
Description: ${description || ''}
Approach: ${approach || ''}
Tech Stack: ${Array.isArray(stack) ? stack.join(', ') : ''}

Generate a JSON response for a mind map representing the project's data architecture and workflow.
The response MUST be a valid raw JSON object. Do not include markdown wraps (like \`\`\`json).
The JSON must contain two arrays:
1. "nodes": each node has "id" (string, e.g., 'user', 'frontend', 'db'), "label" (short title, e.g., 'React UI'), "type" (one of: 'user', 'frontend', 'backend', 'database', 'vector', 'llm', 'payment', 'service', 'webhook'), and "position" (an object with "x" and "y" coordinates in numbers, ranging between x: 10 and 220, and y: 10 and 420).
2. "edges": each edge has "id" (string), "source" (string matching a node ID), "target" (string matching a node ID), and "animated" (boolean, set to true for data pipelines/interactions).

Keep the number of nodes between 4 and 7. Ensure that the coordinates stack cleanly from top to bottom (Y starting near 10 for User, and stepping down by 70-90px for subsequent nodes) and the nodes do not overlap. Ensure the graph is connected.`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    console.log(`Querying Gemini API for mindmap of project: ${title}`);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: HTTP status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Gemini API returned an empty response');
    }

    // Parse the generated text into JSON
    const parsedData = JSON.parse(responseText.trim());

    // Clean up nodes and format to React Flow format
    const cleanNodes = parsedData.nodes.map((node: any, idx: number) => formatNode(node, idx));

    const cleanEdges = parsedData.edges.map((edge: any) => ({
      id: edge.id || `e-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: typeof edge.animated === 'boolean' ? edge.animated : true
    }));

    return NextResponse.json({
      nodes: cleanNodes,
      edges: cleanEdges
    });

  } catch (error: any) {
    console.error('Error generating mindmap:', error);
    // Graceful fallback to static high-fidelity flow
    try {
      const body = await req.clone().json();
      return NextResponse.json(handleFallback(body.id));
    } catch {
      return NextResponse.json(handleFallback(''));
    }
  }
}
