import { useEffect, useState } from "react";

const POKEMON_NAMES = ["ditto", "accelgor", "aipom", "gorebyss", "jigglypuff"];

// https://pokeapi.co/api/v2/pokemon/POKEMON_NAME
type RawPokemon = {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
};

const fetchPokemonByName = (name: string) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) => {
    if (!response.ok) {
      throw new Error(`Network error occurred when fetching pokemon '${name}'`);
    }

    return response.json() as Promise<RawPokemon>;
  });

type Pokemon = {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  imageUrl: string;
  isAttacker: boolean;
};

// takes at least { attack: number; defense: number }
// returns { attack: number; defense: number; isAttacker: boolean}
const addIsAttacker = () => {};

export const App = () => {
  const [pokemon, setPokemon] = useState<Array<Pokemon>>([]);

  useEffect(() => {
    const fetchPokemon = () => {
      Promise.all(POKEMON_NAMES.map(fetchPokemonByName))
        .then((rawPokemon) =>
          rawPokemon.map((rawPoke) => ({
            id: rawPoke.id,
            name: rawPoke.name,
            imageUrl: rawPoke.sprites.other["official-artwork"].front_default,
            hp:
              rawPoke.stats.find((stat) => stat.stat.name === "hp")
                ?.base_stat || 0,
            attack:
              rawPoke.stats.find((stat) => stat.stat.name === "attack")
                ?.base_stat || 0,
            defense:
              rawPoke.stats.find((stat) => stat.stat.name === "defense")
                ?.base_stat || 0,
          }))
        )
        .then((pokemon) =>
          pokemon.map((poke) => ({
            ...poke,
            isAttacker: poke.attack > poke.defense,
          }))
        )
        .then(setPokemon)
        .catch(console.error);
    };

    fetchPokemon();
  });

  return (
    <div className="bg-cream">
      <h1>Pokemon</h1>
      <div>
        {pokemon.map(({ id, name, imageUrl }) => (
          <div key={id} className="bg-white">
            <div>{name}</div>
            <img src={imageUrl} alt={name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
