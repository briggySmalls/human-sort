import * as O from 'fp-ts/Option'

class Comparison<T> {
    constructor(public nodeValue: T, public elem: T) { }
}

class ComparisonResult<T> {
    constructor(public nodeValue: T, public elem: T, public isNode: Boolean) { }

    public matchingResult(a: T, b: T): O.Option<Boolean> {
        if (this.nodeValue == a && this.elem == b) {
            return O.some(this.isNode)
        } else if (this.nodeValue == b && this.elem == a) {
            return O.some(!this.isNode)
        } else {
            return O.none
        }
    }
}

export {
    Comparison,
    ComparisonResult
}