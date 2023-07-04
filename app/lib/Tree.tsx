import { Comparison, ComparisonResult } from './Comparison'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array';

interface Tree<T> {
    iterate(elem: T, comparisonResults: ComparisonResult<T>[]): E.Either<Comparison<T>, Tree<T>>;
    sorted(): T[];
}

class EmptyTree<T> implements Tree<T> {
    iterate(elem: T, comparisonResults: ComparisonResult<T>[]): E.Either<Comparison<T>, Tree<T>> {
        return E.right(new Node(elem, new EmptyTree, new EmptyTree))
    }
    sorted(): T[] { return [] }
}

class Node<T> implements Tree<T> {
    constructor(private value: T, private left: Tree<T>, private right: Tree<T>) { }

    iterate(elem: T, comparisonResults: ComparisonResult<T>[]): E.Either<Comparison<T>, Tree<T>> {
        return this.tryInsertIntoChildren(elem, comparisonResults)
    }

    sorted(): T[] {
        return [...this.left.sorted(), this.value, ...this.right.sorted()]
    }

    private tryInsertIntoChildren(elem: T, comparisonResults: ComparisonResult<T>[]): E.Either<Comparison<T>, Tree<T>> {
        const maybeResult = this.checkComparisons(this.value, elem, comparisonResults)
        return O.match(
            () => E.left(new Comparison(this.value, elem)),
            (result: Boolean) => this.insertIntoChildren(elem, result, comparisonResults)
        )(maybeResult)
    }

    private insertIntoChildren(elem: T, comparisonResult: Boolean, comparisonResults: ComparisonResult<T>[]): E.Either<Comparison<T>, Tree<T>> {
        if (comparisonResult) {
            const nodeOrComparison = this.left.iterate(elem, comparisonResults)
            return E.map(
                (newNode: Tree<T>) => new Node(this.value, newNode, this.right)
            )(nodeOrComparison)
        } else {
            const nodeOrComparison = this.right.iterate(elem, comparisonResults)
            return E.map(
                (newNode: Tree<T>) => new Node(this.value, this.left, newNode)
            )(nodeOrComparison)
        }
    }

    private checkComparisons(a: T, b: T, comparisonResults: ComparisonResult<T>[]): O.Option<Boolean> {
        const maybeResults = comparisonResults.map((cr: ComparisonResult<T>) => cr.matchingResult(a, b))
        const maybeFirstResult = A.findFirst(O.match(() => false, (_) => true))(maybeResults)
        return O.compact(maybeFirstResult)
    }
}

export type { Tree }
export { EmptyTree }