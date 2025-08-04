import React, { useRef, useEffect } from 'react';

const makeButtons = (buttons) => {
    return buttons && buttons.map((but, i) => {
        let condition = true;
        if (but.hasOwnProperty('condition')) condition = but.condition()
        return condition && but.hasPermission && <button title={but.title} key={"buttEmp" + i} onClick={but.action()} className="btn">
            <i className={but.icon}></i>
        </button>
    });
}

export function Modal({ modalOpen, setModalOpen, header, subHeader, body, onClose, buttons, alone }) {

    const wrapperRef = useRef(null);

    function useOutsideAlerter(ref) {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && modalOpen) {
                if (onClose) onClose()
                setModalOpen(false);
            }
        }
        useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        });
    }

    useOutsideAlerter(wrapperRef);

    return (
        <div>
            <div className={"modal fade slide-up disable-scroll" + (modalOpen ? ' in' : '')} id="modalSlideUp" tabIndex="-1" role="dialog" aria-hidden={!modalOpen} style={{ display: modalOpen ? "block" : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content-wrapper">
                        <div ref={wrapperRef} className={"modal-content" + (alone ? ' alone' : '')}>
                            <div className="modal-header clearfix">
                                <button onClick={() => {
                                    if (onClose) onClose()
                                    setModalOpen(false)
                                }} type="button" className="close" data-dismiss="modal" aria-hidden="true"><i className="fa fa-times"></i>
                                </button>
                                <span>{header}</span>
                                {subHeader && <p>{subHeader}</p>}
                                {buttons && buttons.length > 0 && makeButtons(buttons)
                                }
                            </div>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
            <div className={modalOpen ? "modal-backdrop fade in" : ''}></div>
        </div>
    )
}
