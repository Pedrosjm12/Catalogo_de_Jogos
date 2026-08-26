type RawgPlatform = {
  platform?: {
    name?: string;
  };
};

type RawgDeveloper = {
  name?: string;
};

type RawgPublisher = {
  name?: string;
};

type RawgGame = {
  id: number;
  name: string;
  background_image?: string | null;
  rating?: number | null;
  released?: string | null;
  developers?: RawgDeveloper[];
  platforms?: RawgPlatform[];
};

type RawgGameDetails = {
  developers?: RawgDeveloper[];
  publishers?: RawgPublisher[];
};

export type RawgSuggestion = {
  id: number;
  name: string;
  image: string | null;
  rating: number | null;
  released: string | null;
  developer: string;
  platform: string;
};

const getPrimaryCompanyName = (
  companies?: Array<{ name?: string }>,
): string | null => {
  const name = companies?.[0]?.name?.trim();
  return name ? name : null;
};

const fetchGameDeveloper = async (
  gameId: number,
  apiKey: string,
): Promise<string | null> => {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`,
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as RawgGameDetails;
  return (
    getPrimaryCompanyName(data.developers) ??
    getPrimaryCompanyName(data.publishers)
  );
};

export const searchGames = async (query: string): Promise<RawgSuggestion[]> => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    console.warn(
      "RAWG_API_KEY não configurada: sugestões de jogos desabilitadas.",
    );
    return [];
  }

  const params = new URLSearchParams({
    search: normalizedQuery,
    key: apiKey,
    page_size: "5",
  });

  const response = await fetch(
    `https://api.rawg.io/api/games?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível consultar as sugestões de jogos.");
  }

  const data = (await response.json()) as { results?: RawgGame[] };
  const results = data.results ?? [];

  return Promise.all(
    results.map(async (game) => {
      const listDeveloper = getPrimaryCompanyName(game.developers);
      const detailDeveloper = listDeveloper
        ? null
        : await fetchGameDeveloper(game.id, apiKey);

      return {
        id: game.id,
        name: game.name,
        image: game.background_image ?? null,
        rating: typeof game.rating === "number" ? game.rating : null,
        released: game.released ?? null,
        developer:
          listDeveloper ?? detailDeveloper ?? "Desenvolvedora não informada",
        platform: game.platforms?.[0]?.platform?.name ?? "PC",
      };
    }),
  );
};
