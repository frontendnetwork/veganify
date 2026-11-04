export function preprocessIngredients(input: string): string[] {
  if (!input || typeof input !== "string") {
    return [];
  }

  const processed = input
    .replace(/\d+(?:\.\d+)?%/gu, "")
    .replace(/\b\w+\s+\d+/gu, (match) => match.replace(/\d+$/u, ""))
    .replace(/:/gu, ",");

  return processed
    .split(",")
    .map((item) => item.trim().replace(/\.$/u, ""))
    .filter(Boolean)
    .reduce<string[]>((acc, item) => {
      const parts = item
        .split(/\s+(?=\(\*)/u)
        .map((part) => part.replace(/[()]/gu, "").trim());
      return acc.concat(parts);
    }, [])
    .filter(
      (item, index, self) =>
        self.indexOf(item) === index &&
        !self.some(
          (other, otherIndex) =>
            otherIndex !== index && other.includes(item) && other !== item
        )
    );
}
