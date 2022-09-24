const Score = function (initialState = {}) {

    const maxMemSize = initialState.maxMemSize || 3;
    const mem = initialState.mem || []
    let sum = initialState.sum || 0
    let lastModified = initialState.lastModified || 0

    // hit=1, miss=-1
    function add(hitOrMiss) {
        sum += hitOrMiss
        if (mem.push(hitOrMiss) > maxMemSize) {
            sum -= mem.shift()
        }
        lastModified = new Date().getTime()
    }

    function getMaxMemSize() {
        return maxMemSize
    }

    function getSum() {
        return sum
    }

    function getLastModified() {
        return lastModified
    }

    function getMem() {
        return [...mem]
    }

    function getMemSize() {
        return mem.length
    }

    function serialize() {
        return {
            maxMemSize,
            mem,
            sum,
            lastModified
        }
    }

    return {
        add,
        serialize,
        getSum,
        getLastModified,
        getMaxMemSize,
        getMem,
        getMemSize
    }
}

Score.HIT = 1
Score.MISS = -1