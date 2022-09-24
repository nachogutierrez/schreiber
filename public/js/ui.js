const UI = (function () {

    const { range } = Util

    function renderLogHistory(logs = []) {
        return `<div class='log-history'>${logs.map(renderLog).join('')}</div>`
    }

    function renderLog(log = {}) {
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
                ${renderScoreUpdate(scoreUpdate)}
                ${renderCard(front, mem, maxMemSize)}
                ${renderCorrection({ text, back, scoreUpdate })}
            </div>`
        )
    }

    const renderMem = (mem, maxMemSize) => (
        `<div class='mem'>
            ${range(maxMemSize - mem.length).map(() => renderMemValue()).join('')}
            ${mem.map(renderMemValue).join('')}
        </div>`
    )
    function renderMemValue(value) {
        if (value === undefined) {
            return `<div class='mem-value EMPTY'></div>`
        }
        return `<div class='mem-value ${value === Score.HIT ? 'HIT' : 'MISS'}'></div>`
    }
    const renderScoreUpdate = scoreUpdate => `<div class='score-update ${scoreUpdate === Score.HIT ? 'HIT' : 'MISS'}'>${scoreUpdate === Score.HIT ? 'HIT' : 'MISS'}</div>`
    function renderCorrection(props = {}) {
        const { text, back, scoreUpdate } = props
        let correction = ''
        if (scoreUpdate === Score.MISS) {
            correction = `<div class='correction incorrect'>${text}</div><img src='assets/arrow.svg' width='24px' height='24px'></img><div class='correction correct'>${back}</div>`
        } else {
            correction = `<div class='correction correct'>${back}</div>`
        }

        return correction
    }

    function renderCard(front, mem, maxMemSize) {
        return (
            `<div class='front'>
                <div class='word'>${front}</div>
                ${renderMem(mem, maxMemSize)}
            </div>`
        )
    }

    const renderHeaderGridItem = value => `<div class="grid-item header">${value}</div>`
    const renderGridItem = value => `<div class="grid-item">${value}</div>`

    function renderScoreBoard(scoreBoard) {
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

    return {
        renderLogHistory,
        renderLog,
        renderMem,
        renderCard,
        renderScoreBoard
    }
})()