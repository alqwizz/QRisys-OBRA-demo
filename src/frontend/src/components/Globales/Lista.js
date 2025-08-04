import React from 'react';
import './Lista.css';

export default function Lista({ items, titlePropertys, subniveles, subtitle, footer, secondInfo, childProperty, buttons, separator, colorStyle, childTitles }) {


    const showButtons = (item) => {
        return (
            <div className={'buttons'}>
                {buttons.map((button, i) => {
                    if (button.hasPermission) {
                        if (button.icon) {
                            return <i key={i} className={button.icon} onClick={button.action(item)} title={button.title} style={{ color: button.color }} />
                        }
                        if (button.image) {
                            return <img key={i} className={'icon-image'} onClick={button.action(item)} title={button.title} style={{ height: '1.2em', marginRight: '15px', cursor: 'pointer' }} src={button.image} alt={'imagen de icono'} />
                        }
                    }
                    return <div />
                })}
            </div>
        )
    };



    const makeRow = (item, i, titlePropertys) => {
        return (
            <div key={i} className={'list-item'} style={colorStyle && Object.assign({}, colorStyle(item))}>
                <div className={'list-info'}>
                    <div>
                        <div className={'title'}>
                            {titlePropertys.map((prop, i) => { return <span key={i}>{subniveles ? item[prop][subniveles[i]] : item[prop]} {separator && i < titlePropertys.length - 1 ? <span>{separator}</span> : ''}</span> })}
                        </div>
                    </div>
                    {
                        secondInfo &&
                        <div>
                            <span>{item[secondInfo]}</span>
                        </div>
                    }
                    {
                        buttons && showButtons(item)
                    }
                </div>
                {childProperty &&

                    <div className={'children-container'}>
                        {item[childProperty] && item[childProperty].map((child, i) => makeRow(child, i, childTitles))}
                    </div >
                }
            </div >
        )

    };

    return (
        <div className={'qrisys-list'}>
            {items.map((item, i) => makeRow(item, i, titlePropertys))}
        </div >
    )
}
