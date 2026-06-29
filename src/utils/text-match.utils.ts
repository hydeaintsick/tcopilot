/**
 * Appariement souple entre une référence exprimée en langage naturel
 * ("c'est bon pour mes analyses", "ma séance basic fit") et le titre/description
 * d'une tâche existante.
 *
 * L'objectif est de tolérer les différences de casse, d'accents, de ponctuation,
 * de singulier/pluriel et la présence de mots parasites (articles, possessifs,
 * mots de liaison) qui faisaient échouer une simple recherche par sous-chaîne.
 */

/**
 * Mots vides multilingues ignorés lors de l'appariement. Ils n'apportent aucune
 * information discriminante (articles, possessifs, prépositions, conjonctions).
 */
const STOPWORDS = new Set([
  // Français
  "le", "la", "les", "un", "une", "des", "du", "de", "d", "l",
  "au", "aux", "a", "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses",
  "ce", "cet", "cette", "ces", "pour", "par", "sur", "dans", "avec", "et", "ou",
  "est", "c", "ca", "que", "qui", "fait", "faire", "bon", "bonne",
  // Anglais
  "the", "an", "my", "your", "of", "for", "to", "in", "on", "with",
  "and", "or", "is", "it", "that", "this", "done", "do", "did", "good",
  // Espagnol / Italien (minimal)
  "el", "los", "mi", "mis", "para", "con", "y", "il", "lo", "gli", "mia", "mio",
]);

/** Minuscule, sans accents, sans ponctuation, espaces normalisés. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’'`]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  return normalized.length === 0 ? [] : normalized.split(" ");
}

/** Tokens porteurs de sens (mots vides exclus). */
function meaningfulTokens(input: string): string[] {
  return tokenize(input).filter((token) => !STOPWORDS.has(token));
}

/** Suppression légère du « s » du pluriel (analyses -> analyse). */
function stem(token: string): string {
  return token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
}

/**
 * Deux tokens correspondent s'ils sont égaux, égaux après désuffixation du
 * pluriel, ou si l'un est préfixe de l'autre (pour absorber conjugaisons et
 * variantes), à condition d'une longueur suffisante pour éviter les faux positifs.
 */
function tokensMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const sa = stem(a);
  const sb = stem(b);
  if (sa === sb) return true;
  const min = Math.min(sa.length, sb.length);
  return min >= 4 && (sa.startsWith(sb) || sb.startsWith(sa));
}

/**
 * Score d'appariement entre une référence et une tâche. Plus le score est élevé,
 * meilleure est la correspondance. 0 signifie aucune correspondance.
 */
export function scoreReference(
  reference: string,
  title: string,
  description?: string | null
): number {
  const refTokens = meaningfulTokens(reference);
  if (refTokens.length === 0) return 0;

  const targetTokens = meaningfulTokens(`${title} ${description ?? ""}`);
  if (targetTokens.length === 0) return 0;

  let score = 0;

  // Sous-chaîne normalisée exacte sur le titre : signal très fort.
  const normRef = normalizeText(reference);
  const normTitle = normalizeText(title);
  if (normRef.length >= 3 && normTitle.includes(normRef)) {
    score += 100;
  }

  let matched = 0;
  for (const refToken of refTokens) {
    if (targetTokens.some((targetToken) => tokensMatch(refToken, targetToken))) {
      matched += 1;
    }
  }
  score += matched * 10;

  return score;
}

/**
 * Classe une liste de tâches par pertinence vis-à-vis d'une référence et renvoie
 * l'ensemble des meilleures candidates (ex æquo au meilleur score). Une liste vide
 * signifie « aucune correspondance » ; plusieurs éléments signifient « ambigu ».
 */
export function rankByReference<T extends { title: string; description?: string | null }>(
  reference: string,
  items: T[]
): T[] {
  const scored = items
    .map((item) => ({ item, score: scoreReference(reference, item.title, item.description) }))
    .filter((entry) => entry.score > 0);

  if (scored.length === 0) return [];

  const maxScore = Math.max(...scored.map((entry) => entry.score));
  return scored.filter((entry) => entry.score === maxScore).map((entry) => entry.item);
}
