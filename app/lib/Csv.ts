import { State, StateManager } from './State'
import { contramap } from 'fp-ts/Ord'
import * as A from 'fp-ts/Array'
import * as N from 'fp-ts/Number'
import { pipe } from 'fp-ts/function'
import { parse } from 'csv-parse/sync';

interface RawCsvRow {
    elem: string
    rank: string
}

interface CsvRow {
    elem: string
    rank: number
}

export function toCsv(state: State<string>): string {
    const list = state.allElementsCanonical
    const ranking = new Map(pipe(state.tree.sorted(), A.mapWithIndex((i: number, s: string) =>
        [s, i]
    )))
    const lines = pipe(list, A.map((elem) => {
        const rank = ranking.get(elem)?.toString() ?? ""
        return `${elem},${rank}`
    }))
    const linesWithHeader = pipe(lines, A.prepend("elem,rank"))
    return linesWithHeader.join("\n")
}

export function fromCsv(csv: string): StateManager<string> {
    const rawData = parse(csv, { columns: true }) as Array<RawCsvRow>
    const data: CsvRow[] = rawData.map(
        (r) => ({
            elem: r.elem,
            rank: parseInt(r.rank),
        })
    )
    const allElementsCanonical = data.map((r) => r.elem)
    const sortByRank = pipe(N.Ord, contramap((r: CsvRow) => r.rank))
    const sortedElements = pipe(
        data,
        A.filter((r) => !isNaN(r.rank)),
        A.sortBy([sortByRank]),
        A.map((r) => r.elem)
    )
    const stateManager = StateManager.init(allElementsCanonical, sortedElements)
    return stateManager
}
