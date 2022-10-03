import {
    createState,
    loadSettings,
    loadFlashcards,
    saveFlashcards,
    determineNextFlashcard,
    calculateScoreBoard,
    handleScoreUpdate
} from '../state.js'

import { renderScoreBoard, renderCard, renderLogHistory } from '../ui.js'

async function start() {
    const bindings = bind()
    const state = createState()
    await initState(state)
    setListeners(bindings, state)
    loop(bindings, state)
}

async function initState(state) {
    await loadSettings(state)
    await loadFlashcards(state)
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
    bindings.score.innerHTML = renderScoreBoard(state.scoreBoard)
    bindings.current.innerHTML = renderCard(state.card.front, state.card.score.getMem(), state.card.score.getMaxMemSize())
    bindings.input.value = ''
    bindings.log.innerHTML = renderLogHistory(state.logHistory)
}

function loop(bindings, state) {
    determineNextFlashcard(state)
    calculateScoreBoard(state)

    updateUI(bindings, state)

    const listener = async function (e) {
        // press enter
        if (e.keyCode === 13) {

            // ignore if input text is empty
            if (!bindings.input.value) {
                return
            }
            state.text = bindings.input.value
            handleScoreUpdate(state)
            await saveFlashcards(state)
            bindings.input.removeEventListener('keypress', listener)
            loop(bindings, state)
        }
    }
    bindings.input.addEventListener('keypress', listener)
}

window.addEventListener('load', start)