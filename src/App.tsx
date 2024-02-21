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
const pokemonFromRawPokemon = (rawPokemon: RawPokemon) => {}

// use this function to "catch" the transformed `Pokemon` by adding the `caught`
// property
const caughtPokemonFromPokemon = () => {}

export const App = () => {
  const [pokemon, setPokemon] = useState<Array<CaughtPokemon>>([])

  useEffect(() => {
    // fetch, transform, catch, and set the Pokemon state here
  }, [])

  return <h1>Pokemon ({pokemon.length})</h1>
}

export default App
