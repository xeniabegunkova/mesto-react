function PopupWithForm(props) {
    return (
        <div className={`popup popup_type_${props.name} ${props.isOpen && 'popup_is-open'}`} >
            <div className="popup__content">
                <button
                    className="popup__close"
                    type="button"
                    aria-label="Закрыть"
                    onClick={props.onClose}
                ></button>
                <h3 className="popup__title">{props.title}</h3>
                <form
                    action="#"
                    className="popup__form"
                    name={props.name}
                    noValidate
                ></form>

                {props.children}

                <button type="submit" className="popup__button" disabled>
                    {props.buttonText}
                </button>
            </div>
        </div>
    )
}

export default PopupWithForm;