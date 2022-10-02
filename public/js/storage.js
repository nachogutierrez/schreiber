const Storage = (function () {

    const DEFAULT_ENABLED_TRAINING_SET = 'assets/trainingsets/vokabular_misc.json'

    const STORAGE_SCORE = 'STORAGE_SCORE'
    const STORAGE_ENABLED_TRAINING_SETS = 'STORAGE_ENABLED_TRAINING_SETS'

    function loadScore() {
        const scoreString = localStorage.getItem(STORAGE_SCORE) || '{}'
        return JSON.parse(scoreString)
    }

    function saveScore(serializedScore) {
        localStorage.setItem(STORAGE_SCORE, JSON.stringify(serializedScore))
    }

    // getEnabledTrainingSets :: () => [string]
    function loadEnabledTrainingSets() {
        return JSON.parse(localStorage.getItem(STORAGE_ENABLED_TRAINING_SETS) || `["${DEFAULT_ENABLED_TRAINING_SET}"]`)
    }

    // setEnabledTrainingSets :: [string] => ()
    function saveEnabledTrainingSets(enabledTrainingSets) {
        localStorage.setItem(STORAGE_ENABLED_TRAINING_SETS, JSON.stringify(enabledTrainingSets))
    }

    return {
        loadScore,
        saveScore,
        loadEnabledTrainingSets,
        saveEnabledTrainingSets
    }
})()