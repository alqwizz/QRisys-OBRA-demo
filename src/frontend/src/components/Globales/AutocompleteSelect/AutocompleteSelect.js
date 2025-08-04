import React, { useState, useEffect, useRef } from 'react';
import './AutoCompleteSelect.css';
export function AutocompleteSelect({ showNew = true, label, suggestions, initialSuggestions, errorMessage, clickEvent, defaultValue, reset, onlyNames }) {

    let [filteredList, setFilteredList] = useState([]);
    let [value, setValue] = useState(defaultValue || '');
    let [showList, setShowList] = useState(false);
    useEffect(() => {
        if (reset) {
            setShowList(false)
            setValue(defaultValue || '')
            setFilteredList([])
        }
    }, [reset, defaultValue])

    const handleChange = (event) => {
        const value = event.target.value;
        setValue(value);
        filter(value);
    };

    const filter = (value) => {
        let sugerencias = (!value && initialSuggestions) ? Array.from(initialSuggestions) : suggestions;
        if (onlyNames) {
            if (sugerencias && sugerencias.length > 0) {
                if (!showList) setShowList(true);
                const filtered = sugerencias.filter(x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().includes(value.toLowerCase().trim()));
                if ((filtered.length < 1 || filtered.filter(x => x.trim() === value.trim()).length < 1) && value && value !== '') {
                    if (showNew) filtered.push(value);
                }
                setFilteredList(filtered)
            }
        } else {
            if (sugerencias && sugerencias.length > 0) {
                if (!showList) setShowList(true);
                const filtered = sugerencias.filter(x => x.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().includes(value.toLowerCase().trim()));
                if ((filtered.length < 1 || filtered.filter(x => x.nombre.trim() === value.trim()).length < 1) && value && value !== '') {
                    if (showNew) filtered.push({ nombre: value, inputValue: value });
                }
                setFilteredList(filtered)
            }
        }

    };

    const handleBlur = () => {
        if (showList) {
            setValue('');
            setFilteredList([]);
            setShowList(false)
        };
    };

    const handleClick = (suggestion) => () => {
        if (suggestion) {
            if (onlyNames) {
                setValue(suggestion);
            } else {
                setValue(suggestion.inputValue ? suggestion.inputValue : suggestion.nombre);
            }
            setShowList(false);
            clickEvent(suggestion);
        }
    };

    const wrapperRef = useRef(null);

    function useOutsideAlerter(ref) {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handleBlur()
            }
        }
        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        });
    };
    useOutsideAlerter(wrapperRef);
    return (<div className={"form-group form-group-default required" + (errorMessage && errorMessage.length > 0 ? " has-error" : "")} ref={wrapperRef} style={{ overflow: 'visible' }}>
        <label>{label}</label>
        <input className="form-control" onFocus={() => filter(value)} type="search" onChange={handleChange} value={value} />
        {showList && filteredList && filteredList.length > 0 && <div className={'multiselect-container'}>
            {filteredList.map((suggestion, index) => {
                return <div key={"key sug" + index} className={'autoOption'} onClick={handleClick(suggestion)}>{onlyNames ? suggestion : suggestion.nombre}</div>
            })}
        </div>}
        {errorMessage && errorMessage.length > 0 && <label id="error" className="error">{errorMessage}</label>}
    </div>)
}
