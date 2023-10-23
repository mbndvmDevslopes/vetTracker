import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { Form } from 'react-router-dom';


import { DogType } from '../Types';
import { useAllDogsContext } from '../providers/useAllDogs';

const Search = () => {
  const {  setSearchResults, allDogs } = useAllDogsContext();

  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const searchTerm= e.target.value.toLowerCase();
   
    if (!e.target.value) return setSearchResults(allDogs as DogType[]);
    const filteredDogs = allDogs?.filter(
      (dog: DogType) =>
        dog.name.toLowerCase().includes(searchTerm) ||
        dog.sex.toLowerCase().includes(searchTerm) ||
        dog.breed.toLowerCase().includes(searchTerm) ||
        dog.ownerName.toLowerCase().includes(searchTerm) 
        
    );
    setSearchResults(filteredDogs as DogType[]);
    console.log(filteredDogs)
  
  };


  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center search">
          <FormRow
            type="search"
            name="search"
            defaultValue=""
            onChange={handleSearch}
            labelText=""
          />
        </div>
      </Form>
    </Wrapper>
  );
};

export default Search;


/*import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { Form, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name_like') || '';
  const breed = searchParams.get('breed_like') || '';
  const ownerName = searchParams.get('ownerName_like') || '';

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/dogs?name_like=${name}&breed_like=${breed}&ownerName_like=${ownerName}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();
  }, [name, breed, ownerName]);

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="name_like"
            defaultValue={name}
            labelText="Search by Name"
          />
          <FormRow
            type="search"
            name="breed_like"
            defaultValue={breed}
            labelText="Search by Breed"
          />
          <FormRow
            type="search"
            name="ownerName_like"
            defaultValue={ownerName}
            labelText="Search by Owner's Name"
          />

          <Link to="/dashboard/all-dogs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>

      <div className="search-results">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((dog) => (
            <li key={dog.id}>{dog.name}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Search;




import React, { useState } from 'react';
import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { Form, Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Fetch data based on the new query
    fetchData(newQuery);
  };

  const fetchData = async (newQuery) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/dogs?q=${newQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="query"
            value={query}
            onChange={handleInputChange}
            labelText="Search by Name, Sex, Breed, or Owner"
          />

          <Link to="/dashboard/all-dogs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>

      <div className="search-results">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((dog) => (
            <li key={dog.id}>{dog.name}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Search;



import React, { useState } from 'react';
import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { Form, Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Fetch data based on the new query
    fetchData(newQuery);
  };

  const fetchData = async (newQuery) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/dogs?q=${newQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleResetClick = () => {
    // Clear the search input and reset search results
    setQuery(''); // Set the query state to an empty string
    setSearchResults([]); // Reset search results
  };

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="query"
            value={query}
            onChange={handleInputChange}
            labelText="Search by Name, Sex, Breed, or Owner"
          />

          <Link
            to="/dashboard/all-dogs"
            className="btn form-btn delete-btn"
            onClick={handleResetClick} // Call handleResetClick function on button click
          >
            Reset Search Values
          </Link>
        </div>
      </Form>

      <div className="search-results">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((dog) => (
            <li key={dog.id}>{dog.name}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Search;


 */