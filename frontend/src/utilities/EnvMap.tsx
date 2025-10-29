const CODE_TO_LABEL = {
  DEV: 'Development',
  TEST: 'Test',
  PROD: 'Production',
} as const;

type EnvironmentCode = keyof typeof CODE_TO_LABEL;

export function toEnvLabel(value: string): string {
  const key = value.trim().toUpperCase() as EnvironmentCode;
  return CODE_TO_LABEL[key] ?? value;
}
