
import React from 'react'


function PopupWithForm({ name, title, isOpen, onClose, onSubmit, buttonText, children }) {
    return (
        <div className={`popup popup_type_${name} ${isOpen && 'popup_is-open'}`} >
            <div className="popup__content">
                <button
                    className="popup__close"
                    type="button"
                    aria-label="Закрыть"
                    onClick={onClose}
                ></button>
                <h3 className="popup__title">{title}</h3>
                <form
                    action="#"
                    className="popup__form"
                    name={name}
                    noValidate
                    onSubmit={onSubmit}
                >
                    {children}
                    <button type="submit" className="popup__button">
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;