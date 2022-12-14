const DEFAULT_ENABLED_TRAINING_SET = 'assets/trainingsets/vokabular_misc.json'

const STORAGE_SCORE = 'STORAGE_SCORE'
const STORAGE_ENABLED_TRAINING_SETS = 'STORAGE_ENABLED_TRAINING_SETS'

export function loadScore() {
    const scoreString = localStorage.getItem(STORAGE_SCORE) || '{}'
    return JSON.parse(scoreString)
}

export function saveScore(serializedScore) {
    localStorage.setItem(STORAGE_SCORE, JSON.stringify(serializedScore))
}

// getEnabledTrainingSets :: () => [string]
export function loadEnabledTrainingSets() {
    return JSON.parse(localStorage.getItem(STORAGE_ENABLED_TRAINING_SETS) || `["${DEFAULT_ENABLED_TRAINING_SET}"]`)
}

// setEnabledTrainingSets :: [string] => ()
export function saveEnabledTrainingSets(enabledTrainingSets) {
    localStorage.setItem(STORAGE_ENABLED_TRAINING_SETS, JSON.stringify(enabledTrainingSets))
}