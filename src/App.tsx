import { useEffect, useState } from 'react'

// The names of the pokemon to fetch from the external API
const POKEMON_NAMES = [
  'bulbasaur',
  'squirtle',
  'pidgey',
  'rattata',
  'pikachu',
  'jigglypuff',
]

// Relevant TS type for the raw pokemon data from the external API
type RawPokemon = {
  id: number
  name: string
  abilities: Array<{
    is_hidden: boolean
    ability: {
      name: string
    }
  }>
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}

const fetchPokemonByName = (name: string) =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) => {
    if (!response.ok) {
      throw new Error(`Network error occurred when fetching pokemon '${name}'`)
    }

    return response.json() as Promise<RawPokemon>
  })

// TS type for the transformed pokemon data
type Pokemon = {
  id: number
  name: string
  hp: number
  visibleAbilityNames: Array<string>
  imageUrl: string
}

// TS type for the transformed and "caught" pokemon data that will be stored
// in state
type CaughtPokemon = Pokemon & {
  caught: true
}

// use this function to transform the RawPokemon data into the Pokemon type
const pokemonFromRawPokemon = (rawPokemon: RawPokemon) => ({
  id: rawPokemon.id,
  name: rawPokemon.name,
  imageUrl: rawPokemon.sprites.other['official-artwork'].front_default,
  hp: rawPokemon.stats.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 0,
  visibleAbilityNames: rawPokemon.abilities
    .filter((x) => x.is_hidden === false)
    .map((x) => x.ability.name),
})

// use this function to "catch" the transformed `Pokemon` by adding the `caught`
// property
const caughtPokemonFromPokemon = <T extends Record<string, unknown>>(
  pokemon: T,
) => ({
  ...pokemon,
  caught: true as const,
})

export const App = () => {
  const [pokemon, setPokemon] = useState<Array<CaughtPokemon>>([])

  useEffect(() => {
    // fetch, transform, catch, and set the Pokemon state here
    const fetchPokemon = () => {
      Promise.all(POKEMON_NAMES.map(fetchPokemonByName))
        .then((pokemon) => pokemon.map(pokemonFromRawPokemon))
        .then((pokemon) => pokemon.map(caughtPokemonFromPokemon))
        .then(setPokemon)
        .catch(console.error)
    }

    fetchPokemon()
  }, [])

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-4xl font-bold md:mb-8">
        Pokemon ({pokemon.length})
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pokemon.map(({ id, name, hp, imageUrl, visibleAbilityNames }) => (
          <div key={id} className="rounded-lg bg-white shadow-md">
            <div className="relative">
              <img
                src={imageUrl}
                alt={name}
                className="mx-auto w-full max-w-[250px]"
              />
              <div className="absolute right-0 top-0 flex h-[40px] w-[40px] items-center justify-center rounded-tr-lg bg-stone p-2 text-xl text-white">
                {hp}
              </div>
            </div>
            <div className="p-4">
              <div className="mb-2 text-2xl font-bold">{name}</div>
              <div className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
              <div>
                {visibleAbilityNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {visibleAbilityNames.map((abilityName) => (
                      <div
                        key={abilityName}
                        className="inline-block max-w-[100px] overflow-hidden text-ellipsis text-nowrap rounded-md bg-stone px-2 py-1 text-center text-xs text-white"
                      >
                        {abilityName}
                      </div>
                    ))}
                  </div>
                ) : (
                  'None'
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
