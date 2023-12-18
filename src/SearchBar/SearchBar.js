import React, {useState} from 'react'

function SearchBar(){
    const [userSearchInput, setUserSearchInput] = useState('');

    const handleUserSearch = (e) => {
        setUserSearchInput(e.target.value);
    }
return(
    <>
        <div>
            <label htmlFor='searchBar'>🔎</label>
            <input
             type='text' 
             name='searchBar'
             id='searchBar'
             value={userSearchInput}
             placeholder='What do you want to listen to?'
             onChange={handleUserSearch}></input>
        </div>
    </>
)
}

export default SearchBar;