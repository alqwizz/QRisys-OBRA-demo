import React, { useState } from 'react';
import './Buscador.css';

export default function Buscador({ setSearch }) {

    const [searchText, setSearchText] = useState('');

    const lookUpTasks = () => {
        setSearch(searchText)
    };

    function handleEnter(e) {
        if (e.keyCode === 13) {
            lookUpTasks();
        }
    }
    const cancel = () => {
        setSearchText('')
        setSearch('')
    }

    return (
        <div className={'buscador-container'}>
            <div className={'looking-group'}>
                <input type={'text'} id={'looking-input'} value={searchText} onChange={(e) => setSearchText(e.currentTarget.value)} onKeyDown={handleEnter} placeholder={'Buscar...'} />
                {searchText && searchText.length > 0 && <i className={'fa fa-times'} style={{ cursor: 'pointer', marginRight:'8px' }} onClick={cancel} />}
                <i className={'fa fa-search'} style={{ cursor: 'pointer' }} onClick={lookUpTasks} />
            </div>
        </div>
    )
}
