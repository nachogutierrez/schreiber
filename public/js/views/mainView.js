const MainView = (function () {

    async function start() {
        const bindings = bind()
        const state = State.createState()
        await initState(state)
        setListeners(bindings, state)
        loop(bindings, state)
    }

    async function initState(state) {
        await State.loadSettings(state)
        await State.loadFlashcards(state)
    }

    function bind() {
        return {
            settingsButton: document.querySelector('.navbar .settings'),
            score: document.getElementById('score'),
            current: document.getElementById('current'),
            back: document.getElementById('back'),
            input: document.getElementById('input'),
            log: document.getElementById('log')
        }
    }

    function setListeners(bindings, state) {
        bindings.settingsButton.addEventListener('click', () => {
            window.location.href = 'settings.html'
        })
    }

    function updateUI(bindings, state) {
        bindings.score.innerHTML = UI.renderScoreBoard(state.scoreBoard)
        bindings.current.innerHTML = UI.renderCard(state.card.front, state.card.score.getMem(), state.card.score.getMaxMemSize())
        bindings.input.value = ''
        bindings.log.innerHTML = UI.renderLogHistory(state.logHistory)
    }

    function loop(bindings, state) {
        State.determineNextFlashcard(state)
        State.calculateScoreBoard(state)

        updateUI(bindings, state)

        const listener = async function (e) {
            // press enter
            if (e.keyCode === 13) {

                // ignore if input text is empty
                if (!bindings.input.value) {
                    return
                }
                state.text = bindings.input.value
                State.handleScoreUpdate(state)
                await State.saveFlashcards(state)
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

window.addEventListener('load', MainView.start)