const Score = function (initialState = {}) {

    const maxMemSize = initialState.maxMemSize || 3;
    const mem = initialState.mem || []
    let lastModified = initialState.lastModified || 0

    // hit=1, miss=-1
    function add(hitOrMiss) {
        if (mem.push(hitOrMiss) > maxMemSize) {
            mem.shift()
        }
        lastModified = new Date().getTime()
    }

    function getMaxMemSize() {
        return maxMemSize
    }

    function getSum() {
        return mem.filter(x => x === Score.HIT).length
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
Score.MISS = 0