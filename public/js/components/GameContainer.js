import Rework from './CharSel_rework.js'
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

const GameContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Rework)

module.exports = GameContainer;