import { useEffect, useState } from 'react';
import button from '../img/Vector.svg'
import api from '../utils/API';
import Card from './Card';

function Main(props) {

    const [userName, setUserName] = useState('');
    const [userDescription, setUserDescription] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [cards, setCards] = useState([]);

    useEffect(() => {
        Promise.all([
            api.getUserData(),

            api.getInitialCards(),
        ])
            .then(([data, dataCards]) => {
                setUserName(data.name);
                setUserDescription(data.about);
                setUserAvatar(data.avatar);

                setCards(dataCards);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);


    return (
        <main className="content">
            <section className="profile">
                <div className="profile__information">
                    <div className="profile__avatar">
                        <button type="button" className="profile__avatar-redactor" onClick={props.onEditAvatar}></button>
                        <img
                            src={userAvatar}
                            alt="Аватар"
                            className="profile__image"
                        />
                    </div>
                    <div className="profile__info">
                        <h1 className="profile__name">{userName}</h1>
                        <button
                            className="profile__edit-button"
                            type="button"
                            aria-label="Исправить"
                            onClick={props.onEditProfile}

                        ></button>
                        <p className="profile__career">{userDescription}</p>
                    </div>
                </div>
                <button className="profile__add-button" type="button" aria-label="Добавить" onClick={props.onAddPlace}>
                    <img
                        src={button}
                        className="profile__pic"
                        alt="Кнопка плюс"
                    />
                </button>
            </section>

            <section className="photos">
                {
                    cards.map((card) => (
                        <Card card={card} key={card._id} onCardClick={props.onCardClick}/>
                    ))
                }
            </section>
        </main>)
}

export default Main;