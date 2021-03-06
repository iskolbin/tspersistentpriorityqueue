import * as PairingHeap from './PairingHeap'
import * as PriorityQueue from './PriorityQueue'

export class PriorityQueueIterator<T,P> implements Iterator<[T,P]> {	
	index: number = 0
	protected stack: PairingHeap.Heap<T,P>[] = []

	constructor( queue: PriorityQueue.Data<T,P> ) {
		if ( queue.heap ) {
			this.stack = [queue.heap]
		} else {
			this.stack = []
		}
	}

	hasNext(): boolean {
		return this.stack.length > 0
	}

	getNext(): [T,P] {
		if ( this.hasNext()) {
			const heap = this.stack.pop() as PairingHeap.Heap<T,P>
			for ( let node: PairingHeap.List<T,P> = heap.subHeaps; node; node = node.next ) {
				this.stack.push( node.head )
			}
			this.index++
			return heap.entry
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
