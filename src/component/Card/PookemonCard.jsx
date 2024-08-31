import React, { useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner'; // Import the loader spinner component
import SearchIcon from '@mui/icons-material/Search'; // Import the search icon from Material UI

const PokemonCard = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPokemonList(data.results);
        setFilteredPokemon(data.results); // Initialize filtered list with all Pokémon
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Set delay for 1 second

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPokemon(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Rings
          height="80"
          width="80"
          color="#4fa94d"
          radius="6"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-center mb-4">
        <div className="relative ">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border rounded-md py-2 px-4 pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemon.map((pokemon) => (
          <PokemonCardItem key={pokemon.name} url={pokemon.url} name={pokemon.name} />
        ))}
      </div>
    </div>
  );
};

const PokemonCardItem = ({ url, name }) => {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemonData();
  }, [url]);

  if (!pokemonData) {
    return null; 
  }

  return (
    <div className="bg-slate-300 shadow-md rounded-lg p-4 text-center mb-4">
      <img
        src={pokemonData.sprites.front_default}
        alt={name}
        className="w-32 h-32 mx-auto mb-2"
      />
      <h2 className="text-xl font-bold mb-2 capitalize">{name}</h2>
    </div>
  );
};

export default PokemonCard;
