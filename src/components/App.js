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

  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardDelete, setCardDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setAvatarPopupOpen(false)
    setProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setSelectedCard({})
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])


  function handleCardLike(cards) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = cards.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(cards._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === cards._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      })
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
    closeAllPopups();
  };

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.setUserData(data.name, data.about)
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
    closeAllPopups();
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.setAvatar(data)
      .then((dataAvatar) => {
        setCurrentUser(dataAvatar)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
    closeAllPopups();
  }

  function handleUpdateCard(card) {
    setIsLoading(true);
    api.createСard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
    closeAllPopups();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">

        <Header />

        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          handleCardLike={handleCardLike}
          handleDeleteCard={handleDeleteCard}
          cards={cards} />

        <Footer />

        <PopupWithForm name="popup_delete_card" title="Вы уверены?" buttonText="Да" />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleUpdateCard}
          isLoading={isLoading} />

        <ImagePopup
          onClose={closeAllPopups}
          card={selectedCard} />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

//примечание к esc: Создаем переменную isOpen снаружи useEffect, в которой следим за всеми состояниями попапов. Если хоть одно состояние true или не null, то какой-то попап открыт, значит, навешивать нужно обработчик.Объявляем функцию внутри useEffect, чтобы она не теряла свою ссылку при обновлении компонента.И не забываем удалять обработчик в clean up функции через return. А также массив зависимостей c isOpen, чтобы отслеживать изменение этого показателя открытости. Как только он становится true, то навешивается обработчик, когда в false, тогда удаляется обработчик.
