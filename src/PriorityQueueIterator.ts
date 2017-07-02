import * as PairingHeap from './PairingHeap'
import * as PriorityQueue from './PriorityQueue'

export class PriorityQueueIterator<T,P> implements Iterator<[T,P]> {	
	index: number = 0
	protected stack: PairingHeap.Heap<T,P>[] = []

	constructor( queue: PriorityQueue.Data<T,P> ) {
		this.stack = queue.size > 0 ? [queue.heap] : []
	}

	hasNext(): boolean {
		return this.stack.length > 0
	}

	getNext(): [T,P] {
		if ( this.hasNext()) {
			const heap: any = this.stack.pop()
			for ( let node: PairingHeap.List<T,P> = (<any>heap).subHeaps; node; node = (<any>node).next ) {
				if ( node.head ) {
					this.stack.push( node.head )
				}
			}
			this.index++
			return [heap.element,heap.priority]
		} else {
			throw new Error( 'Iterator is finished' )
		}
	}

	next(): IteratorResult<[T,P]> {
		return this.hasNext() ?
		{ value: this.getNext(), done: false } :
		{ value: (<any>undefined), done: true }
	}
}
