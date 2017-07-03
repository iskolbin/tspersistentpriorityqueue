import * as PairingHeap from './PairingHeap'
import { PriorityQueueIterator } from './PriorityQueueIterator'

export const DEFAULT_COMPARATOR = (a: any, b: any): number => {
	if ( a < b ) {
		return -1
	} else if ( a > b ) {
		return 1
	} else {
		return 0
	}
}

export interface Data<T,P> {
	heap: PairingHeap.Heap<T,P>
	size: number
}

export const NIL: Data<any,any> = { heap: undefined, size: 0 }

export function make<T,P>( arraylike?: [T,P][], comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR ): Data<T,P> {
	let heap = undefined
	let size = 0
	if ( arraylike ) {
		for( const [element,priority] of arraylike ) {
			heap = PairingHeap.insert( heap, element, priority, comparator )
			size++
		}
	}
	return { heap, size }
}

export function isEmpty<T,P>( {size}: Data<T,P> ): boolean {
	return size === 0
}

export function clear<T,P>( _?: Data<T,P> ): Data<T,P> {
	return NIL
}

export function first<T,P>( {heap}: Data<T,P> ): [T,P] | undefined {
	return !heap ? undefined : heap.entry
}

export function firstElement<T,P>( {heap}: Data<T,P> ): T | undefined {
		return !heap ? undefined : heap.entry[0]
}

export function firstPriority<T,P>( {heap}: Data<T,P> ): P | undefined {
		return !heap ? undefined : heap.entry[1]
}

export function enqueue<T,P>( {heap,size}: Data<T,P>, element: T, priority: P, comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR ): Data<T,P> {
	return { heap: PairingHeap.insert( heap, element, priority, comparator ), size: size + 1 }
}

export function dequeue<T,P>( queue: Data<T,P>, comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR ): Data<T,P> {
	const {heap,size} = queue
	if ( !heap ) {
		return queue
	} else {
		return { heap: PairingHeap.deleteMin( heap, comparator ), size: size - 1 }
	}
}

export function merge<T,P>( queue: Data<T,P>, otherQueue: Data<T,P>, comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR ): Data<T,P> {
	if ( queue == otherQueue ) {
		return queue
	} else {
		return { heap: PairingHeap.merge( queue.heap, otherQueue.heap, comparator ), size: queue.size + otherQueue.size }
	}
}

export function has<T,P>( queue: Data<T,P>, element: T ): boolean {
	const iterator = new PriorityQueueIterator( queue )
	while ( iterator.hasNext()) {
		if ( iterator.getNext()[0] === element ) {
			return true
		}
	}
	return false
}

export function forEach<T,P,Z,Y>(
	queue: Data<T,P>,
	callbackFn: (this: Z, element: T, priority: P, callbackArg: Y) => void,
	thisArg?: Z,
	callbackArg: any = queue
): void {
	const iterator = new PriorityQueueIterator( queue )
	while ( iterator.hasNext()) {
		const [element, priority] = iterator.getNext()
		callbackFn.call( thisArg, element, priority, callbackArg )
	}
}

export class PriorityQueue<T,P> {
	protected queue: Data<T,P>

	get size() {
		return this.queue.size
	}

	constructor( 
		arraylike?: [T,P][],
		protected comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR,
	) {
		this.queue = make( arraylike, comparator )
	}

	static ofData<T,P>( queue: Data<T,P>, comparator: (a: P, b: P) => number = DEFAULT_COMPARATOR ): PriorityQueue<T,P> {
		const q = new PriorityQueue<T,P>( undefined, comparator )
		q.queue = queue
		return q
	}

	isEmpty(): boolean {
		return isEmpty( this.queue )
	}

	clear(): PriorityQueue<T,P> {
		if ( this.isEmpty() ) {
			return this
		} else {
			return new PriorityQueue<T,P>( undefined, this.comparator )
		}
	}

	first(): [T,P] | undefined {
		return first( this.queue )
	}

	firstElement(): T | undefined {
		return firstElement( this.queue )
	}

	firstPriority(): P | undefined {
		return firstPriority( this.queue )
	}

	enqueue( element: T, priority: P ): PriorityQueue<T,P> {
		return PriorityQueue.ofData( enqueue( this.queue, element, priority, this.comparator ), this.comparator )
	}

	dequeue(): PriorityQueue<T,P> {
		if ( this.isEmpty()) return this
		return PriorityQueue.ofData( dequeue( this.queue, this.comparator ), this.comparator )
	}

	merge( queue: PriorityQueue<T,P> ): PriorityQueue<T,P> {
		if ( this === queue ) return this
		return PriorityQueue.ofData( merge( this.queue, queue.queue ), this.comparator )
	}

	has( element: T ): boolean {
		return has( this.queue, element )
	}

	forEach<Z>(
		callbackFn: (this: Z, element: T, priority: P, pq: this) => void,
		thisArg?: Z
	): void {
		forEach( this.queue, callbackFn, thisArg, this )
	}
}
