import React from 'react';

export const makeButtons = (obj, buttons) => {
    return buttons && buttons.map((but, i) => {
        let condition = true;
        if (but.hasOwnProperty('condition')) condition = but.condition(obj);
        const spanStyles = {
            fontSize: '.3em',
            fontWeight: 'bold',
            color: 'darkgrey',
            textTransform: 'uppercase',
            marginTop:'8px'
        };
        const containerStyles = {
            fontSize: '1.7em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            margin:'0 8px',
            width:'max-content'
        };
        return condition && but.hasPermission &&
            <div key={i} onClick={but.action(obj)} className="icon-container" style={but.color ? Object.assign({},containerStyles,{color:but.color}) : containerStyles}>
                <i className={but.icon} />
                <span style={but.color ? Object.assign({},spanStyles,{color:but.color}) : spanStyles}>{but.title}</span>
            </div>
    });
}
