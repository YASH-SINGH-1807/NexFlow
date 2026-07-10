export function parseNodeConfig<T>(
  config: string
): T | null {
  try {
    return JSON.parse(config) as T;
  } catch {
    return null;
  }
}

export function serializeNodeConfig<T>(
  config: T
): string {
  return JSON.stringify(
    config,
    null,
    2
  );
}