const State = (function () {

    const { arrayComparator, shuffle } = Util

    function createState() {
        return {
            logHistory: [],
            flashcards: {},
            card: undefined,
            text: '',
            scoreBoard: {},
            settings: {}
        }
    }

    function _toMap(flashcardsList) {
        const map = {}
        for (let card of flashcardsList) {
            map[card.front] = card
        }
        return map
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
        if (text.toLowerCase().trim() === card.back.toLowerCase().trim()) {
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

    function determineNextFlashcard(state) {
        const { flashcards } = state
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

        state.card = flashcards[sortedFlashcards[0]]
    }

    // Depends on settings
    async function loadFlashcards(state = {}) {
        const serializedScore = Storage.loadScore()
        const enabledTrainingSets = state.settings.trainingSets.filter(set => set.enabled)
        const flashcardsJson = enabledTrainingSets.flatMap(set => set.flashcards)
        const flashcardsList = []

        const cache = {}
        flashcardsJson.forEach(([front, back]) => {
            if (cache[front] !== undefined) {
                if (cache[front] !== back) {
                    throw new Error(`Incompatible training sets. Front ${front} is repeated with back_1 '${cache[front]}' and back_2 '${back}'`)
                }
                return
            }
            cache[front] = back
            flashcardsList.push({ front, back, score: Score(serializedScore[front]) })
        })
        state.flashcards = _toMap(flashcardsList)
    }

    function saveFlashcards(state = {}) {
        const { flashcards } = state
        const serializedScore = {}
        for (let key in flashcards) {
            serializedScore[key] = flashcards[key].score.serialize()
        }
        Storage.saveScore(serializedScore)
    }

    async function loadSettings(state = {}) {
        const localTrainingSets = await (await fetch('assets/trainingsets.json')).json()

        const enabledTrainingSets = Storage.loadEnabledTrainingSets()
        localTrainingSets.sort(arrayComparator(s => [s.name, s.url]))

        state.settings = {}
        state.settings.trainingSets = await Promise.all(
            localTrainingSets.map(async s => ({
                ...s,
                enabled: enabledTrainingSets.includes(s.url),
                flashcards: await fetch(s.url).then(x => x.json())
            }))
        )
    }

    async function saveSettings(state = {}) {
        const { settings = {} } = state
        const { trainingSets = [] } = settings
        const enabledTrainingSets = trainingSets.filter(set => set.enabled).map(set => set.url)
        Storage.saveEnabledTrainingSets(enabledTrainingSets)
    }

    return {
        createState,
        determineNextFlashcard,
        calculateScoreBoard,
        handleScoreUpdate,
        loadFlashcards,
        saveFlashcards,
        loadSettings,
        saveSettings
    }
})()