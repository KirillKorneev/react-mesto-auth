import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { getToken, setToken } from '../utils/token.js';
import * as Auth from '../utils/auth.js';
import {Header} from  './Header.js';
import {Main} from './Main.js';
import {ProtectedRoute} from './ProtectedRouter.js';
import {Register} from './Register.js';
import {Login} from './Login.js';
import {NotificationPopup} from './NotificationPoopup.js';
import {Footer} from './Footer.js';
import {CurrentUserContext} from '../contexts/currentUserContext.js';
import {api} from '../utils/api.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [success, setSuccess] = React.useState(false);
  const [userData, setUserData] = React.useState({email: ''});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [data, setData] = React.useState({
    email: '',
    password: ''
})
  const history = useHistory();

  React.useEffect(() => {
    Promise.all([
        api.getUserInformation('users/me'),
        api.getItems('cards')
    ])
    .then((res) => {
        const [userInfo, firstCards] = res;
        setCards(firstCards);
        setCurrentUser(userInfo);
    })
    .catch((err) => {
        console.log(`Ошибка ${err}`)
    });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    if(isLiked) {
        api.removeLike('cards/likes', card._id)
          .then((newCard) => {
            const newCards = cards.map((c) => c._id === card._id ? newCard : c);
            setCards(newCards);
          })
          .catch(err => console.log(err));
    }
    else {
        api.putLike('cards/likes', card._id)
          .then((newCard) => {
            const newCards = cards.map((c) => c._id === card._id ? newCard : c);
            setCards(newCards);
          })
          .catch(err => console.log(err));
    }
  } 

  function handleEditAvatar() {
    setIsEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleNotificationOpen() {
    setIsNotificationPopupOpen(true);
  }

  function handleSuccesToTrue() {
    setSuccess(true);
  }

  function handleSuccesToFalse() {
    setSuccess(false);
  }

  function deleteCard(card) {
    api.deleteItem('cards', card._id)
    .then(() => {
      const newCards = cards.filter((c) => c._id !== card._id);
      setCards(newCards);
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsNotificationPopupOpen(false);
    setSelectedCard({});
  }

  function handleUserUpdate({profileName, profileJob}) {
    api.profileEditing('users/me', profileName, profileJob)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleAvatarUpdate(link) {
    api.avatarEditing('users/me/avatar', link)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleCardsUpdate(name, link) {
    api.createItem('cards', name, link)
    .then((res) => {
      setCards([...cards, res]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleLogin(userData) {
    setUserData(userData);
    setLoggedIn(true);
  }

  function handleLoginToFalse() {
    setLoggedIn(false);
  }

  function handleLoginSite(email, password) {
    Auth.authorize(email, password)
        .then((data) => {
          console.log(data);
            if (data.message === "Incorrect email address or password"){
                setSuccess(false);
                setIsNotificationPopupOpen(true);
                setLoggedIn(false);
            }
            else {
              setToken(data.token);
              setData({ email: '', password: ''});
              handleLogin(data);
              history.push('/');
            }
        })
        .catch((err) => {
          setLoggedIn(false);
          console.log(err)
        });
  }

  function handleRegisterSite(email, password) {
    Auth.register(email, password)
        .then((res) => {
        if (res.error !== "Пользователь с таким email уже зарегистрирован") {
            setSuccess(true)
            setIsNotificationPopupOpen(true);
            history.push('/sign-in');
        }
        else {
            setLoggedIn(false);
            setSuccess(false)
            setIsNotificationPopupOpen(true);
        }
        })
        .catch((err) => console.log(err));
  }

  function tokenCheck() {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    //localStorage.removeItem('jwt');

    Auth.getContent(jwt)
    .then((res) => {
      if (res) {
        const userData = {
          email: res.data.email
        }
        setToken(jwt);
        setLoggedIn(true);
        setUserData(userData);
        history.push('/')
      }
    })
    .catch((err) => {
      console.log(err);
      setLoggedIn(false);
    });
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  return ( 
    <CurrentUserContext.Provider value={
      currentUser
    }>
      <div className="page">
        <Header 
          loggedIn={loggedIn}
          handleLoginToFalse={handleLoginToFalse}
          userData={userData}
        />
          <Switch>
            <ProtectedRoute exact
              path="/" 
              loggedIn={loggedIn}
              onEditAvatar = {handleEditAvatar}
              onEditProfile = {handleEditProfileClick}
              onAddPlace = {handleAddPlaceClick}  
              onCardClick = {handleCardClick}
              onClose = {closeAllPopups}
              isEditProfilePopupOpen = {isEditProfilePopupOpen}
              isAddPlacePopupOpen = {isAddPlacePopupOpen}
              isEditAvatarPopupOpen = {isEditAvatarPopupOpen}
              selectedCard = {selectedCard}
              cards = {cards}
              onDeleteCards = {deleteCard}
              onUpdateUser = {handleUserUpdate}
              onUpdateAvatar = {handleAvatarUpdate}
              onCardLike = {handleCardLike}
              onUpdateCards = {handleCardsUpdate}
              component={Main}
            />
            <Route path="/sign-in">
              <Login 
                handleLogin={handleLogin} 
                tokenCheck={tokenCheck} 
                handleNotificationOpen={handleNotificationOpen}
                handleSuccesToTrue={handleSuccesToTrue}
                handleSuccesToFalse={handleSuccesToFalse}
                handleLoginSite={handleLoginSite}
                setData={setData}
                data={data}
              />
            </Route>
            <Route path="/sign-up">
              <Register 
                handleNotificationOpen={handleNotificationOpen}
                handleSuccesToTrue={handleSuccesToTrue}
                handleSuccesToFalse={handleSuccesToFalse}
                handleRegisterSite={handleRegisterSite}
              />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
        <NotificationPopup 
          success = {success}
          isOpen = {isNotificationPopupOpen} 
          onClose = {closeAllPopups}  
        />
        {loggedIn ? <Footer /> : ''}   
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
