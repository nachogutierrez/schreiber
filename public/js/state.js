const State = (function () {

    const { arrayComparator, shuffle } = Util

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

    return {
        determineNextFlashcard,
        calculateScoreBoard,
        handleScoreUpdate
    }
})()