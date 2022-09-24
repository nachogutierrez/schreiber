const Storage = (function () {

    const STORAGE_SCORE = 'STORAGE_SCORE'

    function _toMap(flashcardsList) {
        const map = {}
        for (let card of flashcardsList) {
            map[card.front] = card
        }
        return map
    }

    function _loadScore() {
        const scoreString = localStorage.getItem(STORAGE_SCORE) || '{}'
        return JSON.parse(scoreString)
    }

    function _saveScore(serializedScore) {
        localStorage.setItem(STORAGE_SCORE, JSON.stringify(serializedScore))
    }

    async function loadFlashcards(state = {}) {
        const serializedScore = _loadScore()
        const flashcardsJson = await (await fetch('/assets/flashcards.json')).json()
        const flashcardsList = flashcardsJson.map(([front, back]) => ({
            front, back, score: Score(serializedScore[front])
        }))
        state.flashcards = _toMap(flashcardsList)
    }

    function saveFlashcards(state = {}) {
        const { flashcards } = state
        const serializedScore = {}
        for (let key in flashcards) {
            serializedScore[key] = flashcards[key].score.serialize()
        }
        _saveScore(serializedScore)
    }

    return {
        loadFlashcards,
        saveFlashcards
    }
})()