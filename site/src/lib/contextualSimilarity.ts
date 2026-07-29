export type Matrix = number[][];

export type DemoMotionLabel = "Reach" | "Squat" | "Turn";
export type DemoPointShape = "circle" | "square" | "triangle";

export type DemoEmbeddingPoint = {
  id: string;
  label: DemoMotionLabel;
  shape: DemoPointShape;
  x: number;
  y: number;
  embedding: readonly number[];
};

export type ContextualSimilarityResult = {
  normalized: Matrix;
  similarity: Matrix;
  distance: Matrix;
  neighborhood: Matrix;
  sharedNeighbors: Matrix;
  sharedNonNeighbors: Matrix;
  w1: Matrix;
  reciprocal: Matrix;
  w2: Matrix;
  contextual: Matrix;
};

export const DEMO_K = 4;

export const DEMO_POINTS: readonly DemoEmbeddingPoint[] = [
  {
    id: "R1",
    label: "Reach",
    shape: "circle",
    x: 142,
    y: 124,
    embedding: [0.94, 0.25, 0.12, 0.03],
  },
  {
    id: "R2",
    label: "Reach",
    shape: "circle",
    x: 202,
    y: 88,
    embedding: [0.88, 0.34, 0.1, 0.08],
  },
  {
    id: "R3",
    label: "Reach",
    shape: "circle",
    x: 223,
    y: 156,
    embedding: [0.91, 0.21, 0.2, 0.04],
  },
  {
    id: "R4",
    label: "Reach",
    shape: "circle",
    x: 117,
    y: 187,
    embedding: [0.86, 0.31, 0.16, 0.12],
  },
  {
    id: "S1",
    label: "Squat",
    shape: "square",
    x: 448,
    y: 112,
    embedding: [0.24, 0.94, 0.08, 0.17],
  },
  {
    id: "S2",
    label: "Squat",
    shape: "square",
    x: 505,
    y: 82,
    embedding: [0.31, 0.89, 0.06, 0.19],
  },
  {
    id: "S3",
    label: "Squat",
    shape: "square",
    x: 536,
    y: 154,
    embedding: [0.18, 0.92, 0.16, 0.13],
  },
  {
    id: "S4",
    label: "Squat",
    shape: "square",
    x: 423,
    y: 190,
    embedding: [0.28, 0.87, 0.12, 0.25],
  },
  {
    id: "T1",
    label: "Turn",
    shape: "triangle",
    x: 292,
    y: 326,
    embedding: [-0.4, 0.25, 0.86, 0.08],
  },
  {
    id: "T2",
    label: "Turn",
    shape: "triangle",
    x: 355,
    y: 286,
    embedding: [-0.34, 0.31, 0.84, 0.14],
  },
  {
    id: "T3",
    label: "Turn",
    shape: "triangle",
    x: 388,
    y: 350,
    embedding: [-0.45, 0.2, 0.82, 0.18],
  },
  {
    id: "T4",
    label: "Turn",
    shape: "triangle",
    x: 250,
    y: 374,
    embedding: [-0.38, 0.34, 0.8, 0.1],
  },
];

const NOISE_TARGETS: Record<string, string> = {
  R1: "S2",
  S1: "T2",
  T1: "R2",
};

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function stable(value: number, precision = 1_000_000) {
  return Math.round(value * precision) / precision;
}

function dot(left: readonly number[], right: readonly number[]) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function normalize(vector: readonly number[]) {
  const magnitude = Math.sqrt(dot(vector, vector)) || 1;
  return vector.map((value) => value / magnitude);
}

function transpose(matrix: Matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]));
}

function multiply(left: Matrix, right: Matrix) {
  const rightColumns = transpose(right);
  return left.map((row) =>
    rightColumns.map((column) => dot(row, column)),
  );
}

function rowCounts(matrix: Matrix) {
  return matrix.map((row) => Math.max(row.reduce((sum, value) => sum + value, 0), 1));
}

export function cosineSimilarityMatrix(
  embeddings: readonly (readonly number[])[],
) {
  const normalized = embeddings.map(normalize);
  const similarity = normalized.map((left) =>
    normalized.map((right) => dot(left, right)),
  );

  return { normalized, similarity };
}

export function squaredDistanceMatrix(similarity: Matrix) {
  return similarity.map((row) =>
    row.map((value) => Math.max(2 - 2 * value, 0)),
  );
}

export function topKNeighborhood(
  distance: Matrix,
  k: number,
  epsilon = 0,
) {
  return distance.map((row) => {
    const ordered = row
      .map((value, index) => ({ index, value }))
      .sort((left, right) => left.value - right.value || left.index - right.index);
    const threshold = ordered[Math.min(k, row.length) - 1].value + epsilon;

    return row.map((value) => (value <= threshold + Number.EPSILON ? 1 : 0));
  });
}

function agreementMatrix(mask: Matrix) {
  const counts = rowCounts(mask);
  const shared = multiply(mask, transpose(mask));

  return shared.map((row, rowIndex) =>
    row.map((value) => value / counts[rowIndex]),
  );
}

export function contextualSimilarity(
  embeddings: readonly (readonly number[])[],
  {
    k,
    epsilon = 0.025,
  }: {
    k: number;
    epsilon?: number;
  },
): ContextualSimilarityResult {
  const { normalized, similarity } = cosineSimilarityMatrix(embeddings);
  const distance = squaredDistanceMatrix(similarity);
  const neighborhood = topKNeighborhood(distance, k, epsilon);
  const sharedNeighbors = agreementMatrix(neighborhood);
  const nonNeighborhood = neighborhood.map((row) =>
    row.map((value) => 1 - value),
  );
  const sharedNonNeighbors = agreementMatrix(nonNeighborhood);
  const w1 = neighborhood.map((row, rowIndex) =>
    row.map(
      (isNeighbor, columnIndex) =>
        0.5 *
        (sharedNeighbors[rowIndex][columnIndex] +
          sharedNonNeighbors[rowIndex][columnIndex]) *
        isNeighbor,
    ),
  );

  const halfNeighborhood = topKNeighborhood(distance, k / 2, epsilon);
  const reciprocal = halfNeighborhood.map((row, rowIndex) =>
    row.map(
      (value, columnIndex) =>
        value * halfNeighborhood[columnIndex][rowIndex],
    ),
  );
  const reciprocalCounts = rowCounts(reciprocal);
  const expanded = multiply(reciprocal, w1);
  const w2 = expanded.map((row, rowIndex) =>
    row.map((value) => value / reciprocalCounts[rowIndex]),
  );
  const w2Transposed = transpose(w2);
  const contextual = w2.map((row, rowIndex) =>
    row.map((value, columnIndex) =>
      clamp01(0.5 * (value + w2Transposed[rowIndex][columnIndex])),
    ),
  );

  return {
    normalized,
    similarity,
    distance,
    neighborhood,
    sharedNeighbors,
    sharedNonNeighbors,
    w1,
    reciprocal,
    w2,
    contextual,
  };
}

export function rankQuery(
  matrix: Matrix,
  queryIndex: number,
  points: readonly DemoEmbeddingPoint[],
) {
  return matrix[queryIndex]
    .map((score, index) => ({ point: points[index], score, index }))
    .filter(({ index }) => index !== queryIndex)
    .sort(
      (left, right) =>
        right.score - left.score || left.point.id.localeCompare(right.point.id),
    );
}

export function perturbDemoQuery(
  points: readonly DemoEmbeddingPoint[],
  queryId: string,
  severity: number,
) {
  const amount = clamp01(severity);
  const targetId = NOISE_TARGETS[queryId] ?? "S2";
  const target = points.find((point) => point.id === targetId) ?? points[0];

  return points.map((point) => {
    if (point.id !== queryId) {
      return point;
    }

    const blend = amount * 0.84;
    const embedding = point.embedding.map((value, index) => {
      const wobble =
        Math.sin((index + 1) * 2.7 + point.x * 0.01) *
        amount *
        (1 - amount) *
        0.18;
      return stable(
        value * (1 - blend) + target.embedding[index] * blend + wobble,
      );
    });

    return {
      ...point,
      x: stable(point.x + (target.x - point.x) * amount * 0.72, 1_000),
      y: stable(
        point.y +
          (target.y - point.y) * amount * 0.72 +
          Math.sin(amount * Math.PI) * 24,
        1_000,
      ),
      embedding,
    };
  });
}
