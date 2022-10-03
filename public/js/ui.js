import { range } from './util.js'
import { HIT, MISS } from './score.js'

export function renderLogHistory(logs = []) {
    return `<div class='log-history'>${logs.map(renderLog).join(renderDivider())}</div>`
}

export const renderDivider = () => `<div class='divider'></div>`

export function renderLog(log = {}) {
    const {
        scoreUpdate,
        front,
        back,
        mem,
        maxMemSize,
        text
    } = log


    return (
        `<div class='log'>
                <div class='score-update-and-card'>
                    ${renderScoreUpdate(scoreUpdate)}
                    ${renderCard(front, mem, maxMemSize)}
                </div>
                ${renderCorrection({ text, back, scoreUpdate })}
            </div>`
    )
}

export const renderMem = (mem, maxMemSize) => (
    `<div class='mem'>
            ${range(maxMemSize - mem.length).map(() => renderMemValue()).join('')}
            ${mem.map(renderMemValue).join('')}
        </div>`
)
export function renderMemValue(value) {
    if (value === undefined) {
        return `<div class='mem-value EMPTY'></div>`
    }
    return `<div class='mem-value ${value === HIT ? 'HIT' : 'MISS'}'></div>`
}
export const renderScoreUpdate = scoreUpdate => `<div class='score-update ${scoreUpdate === HIT ? 'HIT' : 'MISS'}'>${scoreUpdate === HIT ? 'HIT' : 'MISS'}</div>`
export function renderCorrection(props = {}) {
    const { text, back, scoreUpdate } = props
    let correction = ''
    if (scoreUpdate === MISS) {
        correction = (
            `<div class='correction'>
                    <div class='incorrect'>${text}</div>
                    <img class='arrow' src='assets/arrow.svg' width='24px' height='24px'></img>
                    <div class='correct'>${back}</div>
                </div>`
        )
    } else {
        correction = (
            `<div class='correction'>
                    <div class='correct'>${back}</div>
                </div>`
        )
    }

    return correction
}

export function renderCard(front, mem, maxMemSize) {
    return (
        `<div class='front'>
                <div class='word'>${front}</div>
                ${renderMem(mem, maxMemSize)}
            </div>`
    )
}

export const renderHeaderGridItem = value => `<div class="grid-item header">${value}</div>`
export const renderGridItem = value => `<div class="grid-item">${value}</div>`

export function renderScoreBoard(scoreBoard) {
    let header = Object.keys(scoreBoard)
    header.sort((a, b) => a - b)
    let values = header.map(h => scoreBoard[h])
    let gridTemplateColums = range(header.length).map(_ => '48px').join(' ')

    return (
        `<div class="grid-container" style="grid-template-columns: ${gridTemplateColums};">
                ${header.map(renderHeaderGridItem).join('')}
                ${values.map(renderGridItem).join('')}
            </div>`
    )
}

export function renderTrainingSet(trainingSet, i) {
    const len = Object.values(trainingSet.flashcards).length
    const perfectWords = Object.values(trainingSet.flashcards)
        .filter(card => card.score.getSum() >= 3)
        .length
    const progress = (perfectWords * 100 / len).toFixed(0)
    const completed = progress === '100'
    const color = completed ? 'bg-green' : 'bg-beige'
    return (
        `<div class='training-set ${color}'>
                <div class='first-row'>
                    <input type="checkbox" data-index="${i}" ${trainingSet.enabled ? 'checked' : ''}>
                    <p>${trainingSet.name}</p>
                </div>
                <div class='second-row'>
                    <span class='tag'>flashcards=${len}</span>
                    <span class='tag'>perfected=${progress}%</span>
                    <button>clear</button>
                </div>
            </div>`
    )
}