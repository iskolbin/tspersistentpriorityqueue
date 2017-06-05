export type List<T,P> = {
	head: Heap<T,P>
	next: List<T,P>
} | undefined

export type Heap<T,P> = {
	element: T,
	priority: P,
	subHeaps: List<T,P>
} | undefined

function merge<T,P>( a: Heap<T,P>, b: Heap<T,P>, comparator: ( ap: P, bp: P ) => number ): Heap<T,P> {
  if( !a ) {
    return b
  } else if( !b ) {
    return a
	} else if( comparator( a.priority, b.priority ) < 0 ) {
		return { element: a.element, priority: a.priority, subHeaps: { head: b, next: a.subHeaps }}
  } else {
		return { element: b.element, priority: b.priority, subHeaps: { head: a, next: b.subHeaps }}
  }
}

function mergePairs<T,P>( list: List<T,P>, comparator: ( ap: P, bp: P ) => number ): Heap<T,P> {
	if( !list ) {
		return undefined
	} else if ( !list.next ) {
		return list.head
	} else {
		return merge( merge( list.head, list.next.head, comparator ), mergePairs( list.next.next, comparator ), comparator )
	}
}

function insert<T,P>( heap: Heap<T,P>, element: T, priority: P, comparator: ( ap: P, bp: P ) => number ): Heap<T,P> {
	return merge( heap, { element, priority, subHeaps: undefined }, comparator )
}

function deleteMin<T,P>( heap: Heap<T,P>, comparator: ( ap: P, bp: P ) => number ): Heap<T,P> {
	if ( heap ) {
		return mergePairs( heap.subHeaps, comparator )
	} else {
		return undefined
	}
}

function has<T,P>( heap: Heap<T,P>, element: T ): boolean {
	if ( !heap ) {
		return false
	} else if ( heap.element === element ) {
		return true
	} else {
		for ( let node: List<T,P> = heap.subHeaps; node; node = node.next ) {
			if ( has( node.head, element )) {
				return true
			}
		}
		return false
	}
}

function forEach<T,P,Z>(
	heap: Heap<T,P>,
	callbackFn: (this: Z, element: T, priority: P, pq: PriorityQueue<T,P>) => void,
	pq: PriorityQueue<T,P>,
	thisArg?: Z
) {
	if ( heap ) {
		callbackFn.call( thisArg, heap.element, heap.priority, pq )
		for ( let node: List<T,P> = heap.subHeaps; node; node = node.next ) {
			forEach( node.head, callbackFn, pq, thisArg )
		}
	}
}

export class PriorityQueue<T,P> {
	static DEFAULT_COMPARATOR = ( a: any, b: any ): number => {
		if ( a < b ) {
			return -1
		} else if ( a > b ) {
			return 1
		} else {
			return 0
		}
	}

	protected root: Heap<T,P> = undefined
	protected _length: number

	get length() {
		return this._length
	}

	constructor( 
		protected comparator: (a: P, b: P) => number = PriorityQueue.DEFAULT_COMPARATOR,
		arraylike?: [T,P][],
	) {
		let root = undefined
		let length = 0
		if ( arraylike ) {
			for ( const [element,priority] of arraylike ) {
				root = insert( root, element, priority, comparator )
				length++
			}
		}
		this.root = root
		this._length = length
	}

	isEmpty(): boolean {
		return this.root === undefined
	}

	clear(): PriorityQueue<T,P> {
		if ( this.isEmpty() ) {
			return this
		} else {
			return new PriorityQueue<T,P>( this.comparator )
		}
	}

	first(): T | undefined {
		return !this.root ? undefined : this.root.element
	}

	firstPriority(): P | undefined {
		return !this.root ? undefined : this.root.priority
	}

	enqueue( element: T, priority: P ): PriorityQueue<T,P> {
		const q = new PriorityQueue<T,P>( this.comparator )
		q.root = insert( this.root, element, priority, this.comparator )
		q._length = this._length + 1
		return q
	}

	dequeue(): PriorityQueue<T,P> {
		const newRoot = deleteMin( this.root, this.comparator )
		if ( !this.root ) {
			return this
		} else {
			const q = new PriorityQueue<T,P>( this.comparator )
			q.root = newRoot
			q._length = this._length - 1
			return q
		}
	}

	merge( heap: PriorityQueue<T,P> ): PriorityQueue<T,P> {
		if ( heap === this ) {
			return this
		} else {
			const q = new PriorityQueue<T,P>( this.comparator )
			q.root = merge( this.root, heap.root, this.comparator )
			q._length = this._length + heap.length
			return q
		}
	}

	has( element: T ): boolean {
		return has( this.root, element )
	}

	forEach<Z>(
		callbackFn: (this: Z, element: T, priority: P, pq: this) => void,
		thisArg?: Z
	): void {
		forEach( this.root, callbackFn, this, thisArg )
	}
}
