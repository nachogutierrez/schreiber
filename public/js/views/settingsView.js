import {
    createState,
    loadSettings,
    saveSettings
} from '../state.js'

import { renderTrainingSet } from '../ui.js'

async function start() {
    const bindings = bind()
    const state = createState()
    await initState(state)
    updateUI(bindings, state)
    setListeners(bindings, state)
}

function bind() {
    return {
        trainingSets: document.querySelector('.training-sets'),
        confirmButton: document.getElementById('confirm-btn')
    }
}

async function initState(state) {
    await loadSettings(state)
}

function setListeners(bindings, state) {
    bindings.confirmButton.addEventListener('click', async () => {
        await saveSettings(state)
        window.location.href = 'index.html'
    })
}

function updateUI(bindings, state) {
    bindings.trainingSets.innerHTML = state.settings.trainingSets.map(renderTrainingSet).join('')
    bindings.trainingSets.querySelectorAll("input").forEach(el => el.addEventListener('change', () => {
        const index = Number(el.getAttribute('data-index'))
        state.settings.trainingSets[index].enabled = el.checked
    }))
    bindings.trainingSets.querySelectorAll('button').forEach(el => el.addEventListener('click', async () => {
        const index = Number(el.parentNode.parentNode.querySelector('input').getAttribute('data-index'))
        const set = state.settings.trainingSets[index]
        if (confirm(`Are you sure you want to clear progress for training set "${set.name}"`)) {
            clearScore(Object.keys(set.flashcards))
            await initState(state)
            updateUI(bindings, state)
        }
    }))
}

function clearScore(words) {
    const score = Storage.loadScore()
    console.log({ score, words })
    for (let word of words) {
        delete score[word]
    }
    console.log({ score, words })
    Storage.saveScore(score)
}

window.addEventListener('load', start)