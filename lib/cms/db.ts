import postgres from 'postgres';

let client: ReturnType<typeof postgres> | null = null;

export const isCmsDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);

export const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  client ??= postgres(process.env.DATABASE_URL, {
    max: 3,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
  });

  return client;
};
