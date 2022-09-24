const Util = (function () {

    function range(a, b) {
        if (a === undefined) {
            return []
        }
        if (b === undefined) {
            return _range(0, a)
        }
        return _range(a, b)
    }

    function _range(a, b) {
        if (a >= b) {
            return []
        }
        return new Array(b - a).fill().map((_, i) => i + a)
    }

    function arrayComparator(toComparingArray = () => ([])) {
        return (a, b) => {
            const arrayA = toComparingArray(a)
            const arrayB = toComparingArray(b)
            if (arrayA.length <= 0 || arrayB <= 0 || arrayA.length !== arrayB.length) {
                throw new Error('arrayComparator must receive non-empty arrays of equal length')
            }

            for (let i = 0; i < arrayA.length; i++) {
                if (arrayA[i] !== arrayB[i]) {
                    return arrayA[i] - arrayB[i]
                }
            }
            return 0
        }
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    return {
        range,
        arrayComparator,
        shuffle
    }
})()