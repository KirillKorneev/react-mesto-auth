import React from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm.js';
import ImagePopup from '../ImagePopup/ImagePopup.js';
import Card from '../Card/Card.js'
import {CurrentUserContext} from '../../contexts/currentUserContext.js';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup.js';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup.js';



function Main(props) {
    
    const currentUser = React.useContext(CurrentUserContext);


    function likeCard(card) {
        props.onCardLike(card);
    }

    function handleCardDelete(card) {
        props.onDeleteCards(card);
    } 

    function handleSubmit(name, description) {
        props.onUpdateUser({profileName: name, profileJob: description});
    }

    function handleAvatar(link) {
        props.onUpdateAvatar(link);
    }

    function handleCards(name, link) {
        props.onUpdateCards(name, link)
    }

    return (
        <main className="content">
            <section className="profile">
                <div style={{ backgroundImage: `url(${currentUser.avatar})` }} className="profile__avatar">
                    <button onClick={props.onEditAvatar} className="profile__changeImageButton"></button>
                </div>
                <div className="profile__info">
                    <h1 className="profile__name">{currentUser.name}</h1>
                    <button onClick={props.onEditProfile} type="button" className="profile__edit" aria-label="Открытие формы"></button>
                    <p className="profile__about">{currentUser.about}</p>
                </div>
                <button onClick={props.onAddPlace} type="button" className="profile__button" aria-label="Добавление карточки"></button>
            </section>
            <section className="gallery">
                <ul className="elements">
                    {
                        props.cards.map((card, i) => <Card 
                        onCardLike = {likeCard}
                        onCardDelete = {handleCardDelete}
                        card = {card}
                        key = {i}
                        onCardClick = {props.onCardClick}/>)
                    }
                </ul>
            </section>
            <EditProfilePopup 
                        isOpen = {props.isEditProfilePopupOpen}
                        onClose = {props.onClose}
                        onSubmit = {handleSubmit}

            /> 
            <ImagePopup card={props.selectedCard}
                    onClose = {props.onClose}
            />
            <AddPlacePopup
                        isOpen = {props.isAddPlacePopupOpen} 
                        onClose = {props.onClose}  
                        onSubmit = {handleCards}                    
            />
            <PopupWithForm name="agreement" 
                        type="agree" 
                        formType="sure" 
                        agree="form__title_agree" 
                        formTitle="Вы уверены?"
                        typeButton="agree"
                        buttonName="Да"
            />
            <EditAvatarPopup
                        isOpen = {props.isEditAvatarPopupOpen}  
                        onClose = {props.onClose}
                        onSubmit = {handleAvatar}
            />
        </main>
    );
}

export {Main};