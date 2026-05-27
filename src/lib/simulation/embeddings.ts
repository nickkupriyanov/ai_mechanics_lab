export type Phrase = {
  id: string;
  text: string;
  topic: string;
  topicName: string;
  x: number;
  y: number;
};

export type TopicCluster = {
  id: string;
  name: string;
  color: string;
};

export const topicClusters: TopicCluster[] = [
  { id: "ai", name: "AI & ML", color: "#a78bfa" },
  { id: "programming", name: "Programming", color: "#3b82f6" },
  { id: "travel", name: "Travel", color: "#22c55e" },
  { id: "cooking", name: "Cooking", color: "#f59e0b" },
  { id: "productivity", name: "Productivity", color: "#ef4444" },
];

export const phrases: Phrase[] = [
  // AI & ML — centroid ~ (0.2, 0.75)
  { id: "ai-1", text: "neural network", topic: "ai", topicName: "AI & ML", x: 0.18, y: 0.76 },
  { id: "ai-2", text: "transformer model", topic: "ai", topicName: "AI & ML", x: 0.22, y: 0.73 },
  { id: "ai-3", text: "token embedding", topic: "ai", topicName: "AI & ML", x: 0.20, y: 0.78 },
  { id: "ai-4", text: "language model", topic: "ai", topicName: "AI & ML", x: 0.24, y: 0.74 },
  { id: "ai-5", text: "attention mechanism", topic: "ai", topicName: "AI & ML", x: 0.17, y: 0.75 },
  { id: "ai-6", text: "fine-tuning", topic: "ai", topicName: "AI & ML", x: 0.21, y: 0.71 },

  // Programming — centroid ~ (0.75, 0.75)
  { id: "prog-1", text: "React component", topic: "programming", topicName: "Programming", x: 0.73, y: 0.77 },
  { id: "prog-2", text: "TypeScript types", topic: "programming", topicName: "Programming", x: 0.77, y: 0.73 },
  { id: "prog-3", text: "REST API design", topic: "programming", topicName: "Programming", x: 0.72, y: 0.79 },
  { id: "prog-4", text: "database query", topic: "programming", topicName: "Programming", x: 0.76, y: 0.74 },
  { id: "prog-5", text: "unit testing", topic: "programming", topicName: "Programming", x: 0.74, y: 0.76 },
  { id: "prog-6", text: "async function", topic: "programming", topicName: "Programming", x: 0.78, y: 0.75 },

  // Travel — centroid ~ (0.22, 0.22)
  { id: "travel-1", text: "book a flight", topic: "travel", topicName: "Travel", x: 0.21, y: 0.20 },
  { id: "travel-2", text: "hotel reservation", topic: "travel", topicName: "Travel", x: 0.19, y: 0.24 },
  { id: "travel-3", text: "travel itinerary", topic: "travel", topicName: "Travel", x: 0.23, y: 0.21 },
  { id: "travel-4", text: "airport transfer", topic: "travel", topicName: "Travel", x: 0.18, y: 0.22 },
  { id: "travel-5", text: "beach vacation", topic: "travel", topicName: "Travel", x: 0.22, y: 0.19 },
  { id: "travel-6", text: "sightseeing tour", topic: "travel", topicName: "Travel", x: 0.20, y: 0.23 },

  // Cooking — centroid ~ (0.78, 0.22)
  { id: "cook-1", text: "pasta recipe", topic: "cooking", topicName: "Cooking", x: 0.77, y: 0.20 },
  { id: "cook-2", text: "baking bread", topic: "cooking", topicName: "Cooking", x: 0.80, y: 0.23 },
  { id: "cook-3", text: "grilling steak", topic: "cooking", topicName: "Cooking", x: 0.76, y: 0.22 },
  { id: "cook-4", text: "soup preparation", topic: "cooking", topicName: "Cooking", x: 0.79, y: 0.19 },
  { id: "cook-5", text: "chocolate cake", topic: "cooking", topicName: "Cooking", x: 0.78, y: 0.24 },
  { id: "cook-6", text: "meal prep", topic: "cooking", topicName: "Cooking", x: 0.81, y: 0.21 },

  // Productivity — centroid ~ (0.50, 0.48)
  { id: "prod-1", text: "task management", topic: "productivity", topicName: "Productivity", x: 0.49, y: 0.46 },
  { id: "prod-2", text: "time blocking", topic: "productivity", topicName: "Productivity", x: 0.52, y: 0.49 },
  { id: "prod-3", text: "daily planning", topic: "productivity", topicName: "Productivity", x: 0.47, y: 0.48 },
  { id: "prod-4", text: "focus session", topic: "productivity", topicName: "Productivity", x: 0.51, y: 0.47 },
  { id: "prod-5", text: "habit tracking", topic: "productivity", topicName: "Productivity", x: 0.48, y: 0.50 },
  { id: "prod-6", text: "goal setting", topic: "productivity", topicName: "Productivity", x: 0.50, y: 0.45 },
];

export function euclideanDistance(a: Phrase, b: Phrase): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function cosineSimilarity(a: Phrase, b: Phrase): number {
  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.sqrt(a.x ** 2 + a.y ** 2);
  const magB = Math.sqrt(b.x ** 2 + b.y ** 2);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function ngrams(text: string, n: number): Set<string> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const grams = new Set<string>();
  for (let i = 0; i <= cleaned.length - n; i++) {
    grams.add(cleaned.slice(i, i + n));
  }
  return grams;
}

export function keywordSimilarity(a: Phrase, b: Phrase): number {
  const gramsA = ngrams(a.text, 3);
  const gramsB = ngrams(b.text, 3);
  if (gramsA.size === 0 && gramsB.size === 0) return 0;

  let intersection = 0;
  for (const g of gramsA) {
    if (gramsB.has(g)) intersection++;
  }

  const union = gramsA.size + gramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function distanceToSimilarity(distance: number, maxDistance: number): number {
  return Math.max(0, 1 - distance / maxDistance);
}
