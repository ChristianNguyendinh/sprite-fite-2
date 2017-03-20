import SpriteFite from './SpriteFite.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        gameState: state.gameState
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		saveCard: (card) => {
			dispatch(addCard(card))
		},
		unSaveCard: (card) => {
			dispatch(unAddCard(card))
		}
	}
}

const SpriteFiteContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpriteFite)

module.exports = SpriteFiteContainer;