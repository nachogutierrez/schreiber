const Main = (function () {

    const { loadFlashcards, saveFlashcards } = Storage
    const { determineNextFlashcard, calculateScoreBoard, handleScoreUpdate } = State

    const state = {
        logHistory: [],
        flashcards: {},
        card: undefined,
        text: '',
        scoreBoard: {}
    }

    async function start() {
        const bindings = bind()
        await initState(state)
        loop(bindings, state)
    }

    async function initState(state) {
        await loadFlashcards(state)
    }

    function bind() {
        return {
            score: document.getElementById('score'),
            current: document.getElementById('current'),
            back: document.getElementById('back'),
            input: document.getElementById('input'),
            log: document.getElementById('log')
        }
    }

    function updateUI(bindings, state) {
        bindings.score.innerHTML = UI.renderScoreBoard(state.scoreBoard)
        bindings.current.innerHTML = UI.renderCard(state.card.front, state.card.score.getMem(), state.card.score.getMaxMemSize())
        bindings.input.value = ''
        bindings.log.innerHTML = UI.renderLogHistory(state.logHistory)
    }

    function loop(bindings, state) {
        determineNextFlashcard(state)
        calculateScoreBoard(state)

        updateUI(bindings, state)

        const listener = function (e) {
            // press enter
            if (e.keyCode === 13) {

                // ignore if input text is empty
                if (!bindings.input.value) {
                    return
                }
                state.text = bindings.input.value
                handleScoreUpdate(state)
                saveFlashcards(state)
                bindings.input.removeEventListener('keypress', listener)
                loop(bindings, state)
            }
        }
        bindings.input.addEventListener('keypress', listener)
    }



    return {
        start
    }
})()

window.addEventListener('load', Main.start)