function Card(props) {
    return (
        <article className="photos__container">
            <img className="photos__grid" src={props.card.link} alt={props.card.name}
            onClick={function handleClick() {props.onCardClick(props.card)}}/>
            <button
                className="photos__delete"
                type="button"
                aria-label="Удалить"
            ></button>
            <div className="photos__information">
                <h2 className="photos__title">{props.card.name}</h2>
                <div className="photos__like-container">
                    <button
                        className="photos__like"
                        type="button"
                        aria-label="Нравится"
                    ></button>
                    <p className="photos__like-number">{props.card.likes.length}</p>
                </div>
            </div>
        </article>
    )
}
export default Card;