import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import { useEffect, useState } from 'react';
import ImagePopup from './ImagePopup';
import api from '../utils/API';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {

  const [isEditAvatarPopupOpen, editAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, editProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, addPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardDelete, setCardDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getUserData(),

      api.getInitialCards(),
    ])
      .then(([data, cards]) => {
        setCurrentUser(data);

        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  function handleEditAvatarClick() {
    editAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    editProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    addPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    editAvatarPopupOpen(false)
    editProfilePopupOpen(false)
    addPlacePopupOpen(false)
    setSelectedCard({})
  }

  function handleCardLike(cards) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = cards.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(cards._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === cards._id ? newCard : c));
      });
  }

  function handleDeleteCard(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => { //создайте копию массива, исключив из него удалённую карточку
          return item._id !== card._id
        }))
      })
      .catch((err) => {
        console.log(err);
      })
  };

  function handleUpdateUser(data) {
    api.setUserData(data.name, data.about)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(data) {
    api.setAvatar(data)
      .then((dataAvatar) => {
        setCurrentUser(dataAvatar)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateCard(card) {
    api.createСard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">

        <Header />

        <Main onEditAvatar={handleEditAvatarClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onCardClick={handleCardClick} handleCardLike={handleCardLike} handleDeleteCard={handleDeleteCard} cards={cards} />

        <Footer />

        <PopupWithForm name="popup_delete_card" title="Вы уверены?" buttonText="Да" />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleUpdateCard} />

        <ImagePopup onClose={closeAllPopups} card={selectedCard} />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
