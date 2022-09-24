const Main = (function () {

    const { arrayComparator, shuffle } = Util

    const STORAGE_SCORE = 'STORAGE_SCORE'

    const state = {
        logHistory: [],
        flashcards: {},
        card: undefined,
        text: '',
        scoreBoard: {}
    }

    async function start() {
        const bindings = bind()
        state.flashcards = await loadFlashcards()
        loop(bindings, state)
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
        const { flashcards } = state
        const next = nextFlashcard(flashcards)
        state.card = flashcards[next]

        calculateScoreBoard(state)
        updateUI(bindings, state)

        const listener = function (e) {
            // press enter
            if (e.keyCode === 13) {
                if (!bindings.input.value) {
                    return
                }
                state.text = bindings.input.value
                handleScoreUpdate(state)
                saveScore(flashcards)
                bindings.input.removeEventListener('keypress', listener)
                loop(bindings, state)
            }
        }
        bindings.input.addEventListener('keypress', listener)
    }

    function calculateScoreBoard(state = {}) {
        const { flashcards } = state
        const scoreBoard = {}
        const maxMemSize = Object.values(flashcards)[0].score.getMaxMemSize()

        for (let i = -maxMemSize; i <= maxMemSize; i++) {
            scoreBoard[i] = 0
        }
        for (let flashcard of Object.values(flashcards)) {
            const sum = flashcard.score.getSum()
            scoreBoard[sum]++;
        }
        state.scoreBoard = scoreBoard
    }

    function handleScoreUpdate(state = {}) {
        const { card, text } = state
        let scoreUpdate = Score.MISS
        if (text.toLowerCase() === card.back.toLowerCase()) {
            scoreUpdate = Score.HIT
        }
        card.score.add(scoreUpdate)
        state.logHistory.unshift({
            scoreUpdate,
            front: card.front,
            back: card.back,
            mem: card.score.getMem(),
            maxMemSize: card.score.getMaxMemSize(),
            text
        })
        if (state.logHistory.length > 5) {
            state.logHistory.pop()
        }
    }

    function nextFlashcard(flashcards) {
        let sortedByLastModified = Object.keys(flashcards)
        sortedByLastModified.sort((a, b) => {
            return flashcards[a].score.getLastModified() - flashcards[b].score.getLastModified()
        })

        // ignore 5% most recent flashcards
        let rustyFlashcards = sortedByLastModified.filter((_, i) => i < sortedByLastModified.length * .95)

        // shuffle to get different order than the json file
        rustyFlashcards = shuffle(rustyFlashcards)

        let sortedFlashcards = rustyFlashcards.sort(arrayComparator(x => {
            return [flashcards[x].score.getSum(), flashcards[x].score.getMemSize(), flashcards[x].score.getLastModified()]
        }))

        return sortedFlashcards[0]
    }

    function toMap(flashcardsList) {
        const map = {}
        for (let card of flashcardsList) {
            map[card.front] = card
        }
        return map
    }

    async function loadFlashcards() {
        const serializedScore = loadScore()
        const flashcardsJson = await (await fetch('/assets/flashcards.json')).json()
        const flashcardsList = flashcardsJson.map(([front, back]) => ({
            front, back, score: Score(serializedScore[front])
        }))
        return toMap(flashcardsList)
    }

    function loadScore() {
        const scoreString = localStorage.getItem(STORAGE_SCORE) || '{}'

        console.log(scoreString);
        return JSON.parse(scoreString)
    }

    function saveScore(flashcards) {
        const serializedScore = {}
        for (let key in flashcards) {
            serializedScore[key] = flashcards[key].score.serialize()
        }
        localStorage.setItem(STORAGE_SCORE, JSON.stringify(serializedScore))
    }

    return {
        start
    }
})()

window.addEventListener('load', Main.start)