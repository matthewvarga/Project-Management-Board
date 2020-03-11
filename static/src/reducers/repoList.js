const repoList = (state = null, action) => {
    switch(action.type) {
        case 'SET_REPO_LIST':
            return action.repoList 
        default:
            return state
    }
}

export default repoList;