import { useEffect, useState } from "react";
import axios from "axios";

type GameStatus = "JOGANDO" | "ZERADO" | "QUERO_JOGAR";

type Game = {
  id: string;
  title: string;
  platform: string;
  developer: string;
  status: GameStatus;
  favorite: boolean;
  rating?: number | null;
  releaseDate?: string | null;
  coverUrl?: string | null;
};

type Suggestion = {
  id: number;
  name: string;
  image: string | null;
  rating: number | null;
  released: string | null;
  developer: string;
  platform: string;
};

type Tab = "biblioteca" | "desejos";

const API_URL = "http://localhost:3333/api";

const formatReleaseDate = (releaseDate?: string | null) =>
  releaseDate
    ? new Date(releaseDate).toLocaleDateString("pt-BR")
    : "Não informada";

function GameCard({
  game,
  featured = false,
  selected,
  onClick,
}: {
  game: Game;
  featured?: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className={`game-card${featured ? " featured" : ""}${
        selected ? " is-selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="game-cover-wrap">
        <img
          src={
            game.coverUrl ??
            "https://placehold.co/300x180/0f172a/94a3b8?text=Sem+capa"
          }
          alt={game.title}
          className="game-cover"
        />
      </div>
      <div className="game-card-info">
        <div className="card-badges">
          {game.favorite && <span className="badge">♥ Favorito</span>}
          <span className="score">★ {game.rating ?? "—"}</span>
        </div>
        <h3 title={game.title}>{game.title}</h3>
        <p className="platform">▣ &nbsp;{game.platform}</p>
      </div>
    </article>
  );
}

function GameDetailsPanel({
  game,
  onEdit,
  onDelete,
}: {
  game?: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="panel game-details-panel">
      <div className="section-title">
        <h2>Detalhes do jogo</h2>
      </div>
      {game ? (
        <div className="selected-game-details">
          <article className="selected-game-card">
            <div className="selected-game-cover-wrap">
              <img
                src={
                  game.coverUrl ??
                  "https://placehold.co/520x360/0f172a/94a3b8?text=Sem+capa"
                }
                alt={game.title}
                className="game-cover"
              />
            </div>
            <div className="selected-game-card-info">
              <div className="card-badges">
                {game.favorite && <span className="badge">♥ Favorito</span>}
                <span className="score">★ {game.rating ?? "—"}</span>
              </div>
              <h3>{game.title}</h3>
              <p className="platform">▣ &nbsp;{game.platform}</p>
            </div>
          </article>

          <dl className="details-list">
            <div>
              <dt>Título do jogo</dt>
              <dd>{game.title}</dd>
            </div>
            <div>
              <dt>Plataforma</dt>
              <dd>{game.platform}</dd>
            </div>
            <div>
              <dt>Desenvolvedora</dt>
              <dd>{game.developer}</dd>
            </div>
            <div>
              <dt>Status de progresso</dt>
              <dd>{game.status}</dd>
            </div>
            <div>
              <dt>Favorito</dt>
              <dd>{game.favorite ? "Sim" : "Não"}</dd>
            </div>
            <div>
              <dt>Nota (0-10)</dt>
              <dd>{game.rating ?? "Não informada"}</dd>
            </div>
            <div>
              <dt>Data de Lançamento</dt>
              <dd>{formatReleaseDate(game.releaseDate)}</dd>
            </div>
          </dl>

          <div className="form-actions">
            <button
              type="button"
              className="warning"
              onClick={() => onEdit(game)}
            >
              Editar selecionado
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(game.id)}
            >
              Excluir selecionado
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Selecione um jogo para ver os detalhes.
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("biblioteca");
  const [games, setGames] = useState<Game[]>([]);
  const [featured, setFeatured] = useState<Game[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "TODOS" | "JOGANDO" | "ZERADO"
  >("TODOS");
  const [favoriteFilter, setFavoriteFilter] = useState<
    "TODOS" | "FAVORITOS" | "NAO_FAVORITOS"
  >("TODOS");
  const [sortBy, setSortBy] = useState<"recent" | "older" | "rating" | "title">(
    "recent",
  );
  const [wishlistSearchTerm, setWishlistSearchTerm] = useState("");
  const [wishlistFavoriteFilter, setWishlistFavoriteFilter] = useState<
    "TODOS" | "FAVORITOS" | "NAO_FAVORITOS"
  >("TODOS");
  const [wishlistSortBy, setWishlistSortBy] = useState<
    "recent" | "older" | "title"
  >("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [form, setForm] = useState({
    title: "",
    platform: "",
    developer: "",
    status: "JOGANDO" as GameStatus,
    favorite: false,
    rating: "",
    releaseDate: "",
    coverUrl: "",
  });

  const resetForm = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setSuggestions([]);
    setForm({
      title: "",
      platform: "",
      developer: "",
      status: "JOGANDO",
      favorite: false,
      rating: "",
      releaseDate: "",
      coverUrl: "",
    });
  };

  const loadGames = async () => {
    const [gamesRes, featuredRes] = await Promise.all([
      axios.get(`${API_URL}/games`),
      axios.get(`${API_URL}/games/featured`),
    ]);

    setGames(gamesRes.data);
    setFeatured(featuredRes.data);
  };

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = form.title.trim();

      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/games/search`, {
          params: { q: query },
        });

        setSuggestions(data ?? []);
      } catch {
        setSuggestions([]);
      }
    };

    const timer = window.setTimeout(fetchSuggestions, 250);

    return () => window.clearTimeout(timer);
  }, [form.title]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isRatingBlocked = form.status === "QUERO_JOGAR";

    const payload = {
      ...form,
      rating: isRatingBlocked ? null : form.rating ? Number(form.rating) : null,
      releaseDate: form.releaseDate || null,
      coverUrl: form.coverUrl || null,
    };

    if (editingId) {
      await axios.put(`${API_URL}/games/${editingId}`, payload);
    } else {
      await axios.post(`${API_URL}/games`, payload);
    }

    resetForm();
    loadGames();
  };

  const handleEdit = (game: Game) => {
    setSelectedGameId(game.id);
    setEditingId(game.id);
    setIsModalOpen(true);
    setForm({
      title: game.title,
      platform: game.platform,
      developer: game.developer,
      status: game.status,
      favorite: game.favorite,
      rating:
        game.rating !== null && game.rating !== undefined
          ? String(game.rating)
          : "",
      releaseDate: game.releaseDate
        ? new Date(game.releaseDate).toISOString().slice(0, 10)
        : "",
      coverUrl: game.coverUrl ?? "",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Deseja realmente excluir este jogo da sua coleção?",
    );
    if (!confirmed) return;

    await axios.delete(`${API_URL}/games/${id}`);
    setSelectedGameId(null);
    if (editingId === id) resetForm();
    loadGames();
  };

  const handleCardClick = (game: Game) => {
    setSelectedGameId(game.id);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setForm((current) => ({
      ...current,
      title: suggestion.name,
      platform: suggestion.platform?.trim() || current.platform,
      developer: suggestion.developer?.trim() || current.developer,
      releaseDate: suggestion.released
        ? new Date(suggestion.released).toISOString().slice(0, 10)
        : current.releaseDate,
      coverUrl: suggestion.image ?? current.coverUrl,
    }));
    setSuggestions([]);
  };

  const handleStatusChange = (status: GameStatus) => {
    setForm((current) => ({
      ...current,
      status,
      rating: status === "QUERO_JOGAR" ? "" : current.rating,
    }));
  };

  const libraryGames = games.filter((game) => game.status !== "QUERO_JOGAR");
  const wishlistGames = games.filter((game) => game.status === "QUERO_JOGAR");

  const filteredLibraryGames = libraryGames.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "TODOS" ? true : game.status === statusFilter;

    const matchesFavorite =
      favoriteFilter === "TODOS"
        ? true
        : favoriteFilter === "FAVORITOS"
          ? game.favorite
          : !game.favorite;

    return matchesSearch && matchesStatus && matchesFavorite;
  });

  const sortedLibraryGames = [...filteredLibraryGames].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;

    if (sortBy === "older") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  const filteredWishlistGames = wishlistGames.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(wishlistSearchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(wishlistSearchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(wishlistSearchTerm.toLowerCase());

    const matchesFavorite =
      wishlistFavoriteFilter === "TODOS"
        ? true
        : wishlistFavoriteFilter === "FAVORITOS"
          ? game.favorite
          : !game.favorite;

    return matchesSearch && matchesFavorite;
  });

  const sortedWishlistGames = [...filteredWishlistGames].sort((a, b) => {
    if (wishlistSortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;

    if (wishlistSortBy === "older") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  const totalFavorites = libraryGames.filter((game) => game.favorite).length;
  const totalZerados = libraryGames.filter(
    (game) => game.status === "ZERADO",
  ).length;
  const totalJogando = libraryGames.filter(
    (game) => game.status === "JOGANDO",
  ).length;
  const selectedGame = games.find((game) => game.id === selectedGameId);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">▣</span>
          <strong>
            QUEST<span>LOG</span>
          </strong>
        </div>
        <nav className="main-nav">
          <a
            href="#biblioteca"
            className={activeTab === "biblioteca" ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("biblioteca");
            }}
          >
            Biblioteca
          </a>
          <a
            href="#desejos"
            className={activeTab === "desejos" ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("desejos");
            }}
          >
            Lista de desejos
          </a>
        </nav>
        <div className="profile">
          <span>Gamer_Pro</span>
          <span className="avatar">◉</span>
        </div>
      </header>

      {activeTab === "biblioteca" ? (
        <>
          <section className="hero" id="biblioteca">
            <div>
              <p className="eyebrow">Sua coleção</p>
              <h1>Catálogo de Jogos</h1>
              <p className="hero-subtitle">
                Organize, classifique e controle sua jornada gamer pessoal
              </p>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div>
                <span>Total de jogos</span>
                <strong>{libraryGames.length}</strong>
              </div>
              <b className="stat-icon cyan">▥</b>
            </div>
            <div className="stat-card">
              <div>
                <span>Favoritos</span>
                <strong>{totalFavorites}</strong>
              </div>
              <b className="stat-icon pink">♡</b>
            </div>
            <div className="stat-card">
              <div>
                <span>Jogando atualmente</span>
                <strong>{totalJogando}</strong>
              </div>
              <b className="stat-icon green">▷</b>
            </div>
            <div className="stat-card">
              <div>
                <span>Zerados</span>
                <strong>{totalZerados}</strong>
              </div>
              <b className="stat-icon purple">♙</b>
            </div>
          </section>

          <main className="content">
            <section className="panel">
              <h2>
                <i />
                {editingId ? "Editar jogo" : "Adicionar novo jogo"}
              </h2>
              <form onSubmit={handleSubmit} className="game-form">
                <div className="title-input-wrap">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Título"
                    required
                    disabled={Boolean(editingId)}
                  />
                  {!isModalOpen &&
                    !editingId &&
                    suggestions.length > 0 &&
                    form.title.trim().length >= 2 && (
                      <div className="suggestions-box">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            className="suggestion-item"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            <img
                              src={
                                suggestion.image ??
                                "https://placehold.co/60x90/0f172a/94a3b8?text=Jogo"
                              }
                              alt={suggestion.name}
                            />
                            <span>{suggestion.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
                <input
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                  placeholder="Plataforma"
                  required
                />
                <input
                  value={form.developer}
                  onChange={(e) =>
                    setForm({ ...form, developer: e.target.value })
                  }
                  placeholder="Desenvolvedora"
                  required
                  disabled={Boolean(editingId)}
                />
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as GameStatus)
                  }
                >
                  <option value="JOGANDO">Jogando</option>
                  <option value="ZERADO">Zerado</option>
                  <option value="QUERO_JOGAR">Quero Jogar</option>
                </select>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.favorite}
                    onChange={(e) =>
                      setForm({ ...form, favorite: e.target.checked })
                    }
                  />
                  Favorito
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: e.target.value })
                  }
                  placeholder="Nota (0-10)"
                  disabled={form.status === "QUERO_JOGAR"}
                />
                <input
                  type="date"
                  value={form.releaseDate}
                  onChange={(e) =>
                    setForm({ ...form, releaseDate: e.target.value })
                  }
                  disabled={Boolean(editingId)}
                />
                <button type="submit">
                  {editingId ? "Salvar alterações" : "Salvar jogo"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                )}
              </form>
            </section>

            <section className="panel highlights-panel">
              <div className="section-title">
                <h2>Destaques</h2>
                <span>Em alta</span>
              </div>
              <div className="card-grid">
                {featured.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    featured
                    selected={selectedGameId === game.id}
                    onClick={() => handleCardClick(game)}
                  />
                ))}
              </div>
            </section>

            <GameDetailsPanel
              game={selectedGame}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <section className="panel">
              <div className="toolbar">
                <h2>Todos os jogos</h2>
                <div className="filters">
                  <input
                    type="text"
                    placeholder="Buscar por título, plataforma ou desenvolvedora"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as "TODOS" | "JOGANDO" | "ZERADO",
                      )
                    }
                  >
                    <option value="TODOS">Todos os status</option>
                    <option value="JOGANDO">Jogando</option>
                    <option value="ZERADO">Zerado</option>
                  </select>
                  <select
                    value={favoriteFilter}
                    onChange={(e) =>
                      setFavoriteFilter(
                        e.target.value as
                          | "TODOS"
                          | "FAVORITOS"
                          | "NAO_FAVORITOS",
                      )
                    }
                  >
                    <option value="TODOS">Todos</option>
                    <option value="FAVORITOS">Favoritos</option>
                    <option value="NAO_FAVORITOS">Não favoritos</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "recent"
                          | "older"
                          | "rating"
                          | "title",
                      )
                    }
                    className="sort-control"
                  >
                    <option value="recent">Mais recente</option>
                    <option value="older">Mais antigo</option>
                    <option value="rating">Melhor nota</option>
                    <option value="title">Título</option>
                  </select>
                </div>
              </div>

              {sortedLibraryGames.length === 0 ? (
                <div className="empty-state">
                  Nenhum jogo encontrado com os filtros atuais.
                </div>
              ) : (
                <div className="card-grid">
                  {sortedLibraryGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      selected={selectedGameId === game.id}
                      onClick={() => handleCardClick(game)}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        </>
      ) : (
        <>
          <section className="hero" id="desejos">
            <div>
              <p className="eyebrow">Planejamento</p>
              <h1>Lista de Desejos</h1>
              <p className="hero-subtitle">
                Jogos que você ainda quer jogar
              </p>
            </div>
          </section>

          <main className="content">
            <section className="panel">
              <div className="toolbar">
                <h2>Quero jogar</h2>
                <div className="filters">
                  <input
                    type="text"
                    placeholder="Buscar por título, plataforma ou desenvolvedora"
                    value={wishlistSearchTerm}
                    onChange={(e) => setWishlistSearchTerm(e.target.value)}
                  />
                  <select
                    value={wishlistFavoriteFilter}
                    onChange={(e) =>
                      setWishlistFavoriteFilter(
                        e.target.value as
                          | "TODOS"
                          | "FAVORITOS"
                          | "NAO_FAVORITOS",
                      )
                    }
                  >
                    <option value="TODOS">Todos</option>
                    <option value="FAVORITOS">Favoritos</option>
                    <option value="NAO_FAVORITOS">Não favoritos</option>
                  </select>
                  <select
                    value={wishlistSortBy}
                    onChange={(e) =>
                      setWishlistSortBy(
                        e.target.value as "recent" | "older" | "title",
                      )
                    }
                    className="sort-control"
                  >
                    <option value="recent">Mais recente</option>
                    <option value="older">Mais antigo</option>
                    <option value="title">Título</option>
                  </select>
                </div>
              </div>

              {sortedWishlistGames.length === 0 ? (
                <div className="empty-state">
                  Nenhum jogo encontrado na lista de desejos.
                </div>
              ) : (
                <div className="card-grid">
                  {sortedWishlistGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      selected={selectedGameId === game.id}
                      onClick={() => handleCardClick(game)}
                    />
                  ))}
                </div>
              )}
            </section>

            <GameDetailsPanel
              game={selectedGame}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </main>
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{editingId ? "Editar jogo" : "Novo jogo"}</h3>
              <button
                type="button"
                className="close-button"
                onClick={resetForm}
              >

              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="title-input-wrap">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título"
                  required
                  disabled={Boolean(editingId)}
                />
                {isModalOpen &&
                  !editingId &&
                  suggestions.length > 0 &&
                  form.title.trim().length >= 2 && (
                    <div className="suggestions-box">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <img
                            src={
                              suggestion.image ??
                              "https://placehold.co/60x90/0f172a/94a3b8?text=Jogo"
                            }
                            alt={suggestion.name}
                          />
                          <span>{suggestion.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <input
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                placeholder="Plataforma"
                required
              />
              <input
                value={form.developer}
                onChange={(e) =>
                  setForm({ ...form, developer: e.target.value })
                }
                placeholder="Desenvolvedora"
                required
                disabled={Boolean(editingId)}
              />
              <select
                value={form.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as GameStatus)
                }
              >
                <option value="JOGANDO">Jogando</option>
                <option value="ZERADO">Zerado</option>
                <option value="QUERO_JOGAR">Quero Jogar</option>
              </select>
              <label className="checkbox-row modal-checkbox">
                <input
                  type="checkbox"
                  checked={form.favorite}
                  onChange={(e) =>
                    setForm({ ...form, favorite: e.target.checked })
                  }
                />
                Favorito
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="Nota (0-10)"
                disabled={form.status === "QUERO_JOGAR"}
              />
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) =>
                  setForm({ ...form, releaseDate: e.target.value })
                }
                disabled={Boolean(editingId)}
              />

              <div className="modal-actions">
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit">
                  {editingId ? "Salvar alterações" : "Adicionar jogo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
