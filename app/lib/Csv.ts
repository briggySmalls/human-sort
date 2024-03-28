import { State } from './State'
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function'

export function toCsv(state: State<String>): string {
    const list = state.allElementsCanonical
    const ranking = new Map(pipe(state.tree.sorted(), A.mapWithIndex((i: number, s: String) =>
        [s, i]
    )))
    const lines = pipe(list, A.map((elem) => {
        const rank = ranking.get(elem)?.toString() ?? ""
        return `${elem},${rank}`
    }))
    const linesWithHeader = pipe(lines, A.prepend("elem,rank"))
    return linesWithHeader.join("\n")
}
