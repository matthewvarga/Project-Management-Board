const board = (state = null, action) => {
    switch(action.type) {
        case 'SET_BOARD':
            return action.board 
        default:
            return state
    }
}

export default board;