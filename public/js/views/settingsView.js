const SettingsView = (function () {

    async function start() {
        const bindings = bind()
        const state = State.createState()
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
        await State.loadSettings(state)
    }

    function setListeners(bindings, state) {
        bindings.confirmButton.addEventListener('click', async () => {
            await State.saveSettings(state)
            window.location.href = 'index.html'
        })
    }

    function updateUI(bindings, state) {
        bindings.trainingSets.innerHTML = state.settings.trainingSets.map(UI.renderTrainingSet).join('')
        bindings.trainingSets.querySelectorAll("input").forEach(el => el.addEventListener('change', () => {
            const index = Number(el.getAttribute('data-index'))
            state.settings.trainingSets[index].enabled = el.checked
        }))
    }

    return {
        start
    }
})()

window.addEventListener('load', SettingsView.start)