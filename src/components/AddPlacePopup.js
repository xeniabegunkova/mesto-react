import { useState } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeUrl(e) {
        setUrl(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name,
            url
        });
        onClose();
    }

    return (
        <PopupWithForm name="change-card-popup" title="Новое место" buttonText="Создать" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
            <fieldset className="popup__fieldset">
                <label className="popup__field">
                    <input
                        type="text"
                        required
                        className="popup__input popup__input_sign_appellation"
                        placeholder="Название"
                        name="name"
                        id="locality"
                        minLength="2"
                        maxLength="30"
                        onChange={handleChangeName}
                        value={name || ''}
                    />
                    <span className="popup__input-error locality-input-error">Вы пропустили это поле</span>
                </label>
                <label className="popup__field">
                    <input
                        type="url"
                        name="link"
                        id="link"
                        required
                        className="popup__input popup__input_sign_link"
                        placeholder="Ссылка на картинку"
                        onChange={handleChangeUrl}
                        value={url || ''}
                    />
                    <span className="popup__input-error link-input-error">Вы пропустили это поле</span>
                </label>
            </fieldset>
        </PopupWithForm>)
}

export default AddPlacePopup;