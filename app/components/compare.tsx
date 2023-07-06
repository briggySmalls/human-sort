import { Comparison, ComparisonResult } from '../lib/Comparison'

interface Props<T> {
    comparison: Comparison<T>
    onCompare: (cr: ComparisonResult<T>) => void
}

export default function Compare<T extends {}>({ comparison, onCompare }: Props<T>): JSX.Element {
    return (
        <div id="controls" className="card">
            <div id="question">
                <p>Which is larger?</p>
            </div>
            <button id="first" type="button" onClick={() => onCompare(new ComparisonResult(comparison.nodeValue, comparison.elem, false))}>{comparison.elem}</button>
            <button id="second" type="button" onClick={() => onCompare(new ComparisonResult(comparison.nodeValue, comparison.elem, true))}>{comparison.nodeValue}</button>
        </div>
    )
}