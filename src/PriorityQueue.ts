export type HeapNode<T,P> = {
	element: T,
	priority: P,
	subHeaps: HeapNode<T,P>[]
} | undefined

function append<T,P>( list: HeapNode<T,P>[], item: HeapNode<T,P> ): HeapNode<T,P>[] {
  const nlist = list.slice()
  nlist.push( item )
  return nlist
}

function mergePair<T,P>( a: HeapNode<T,P>, b: HeapNode<T,P> ): HeapNode<T,P> {
  if( !a ) {
    return b
  } else if( !b ) {
    return a
  } else if( a.priority < b.priority ) {
		return { element: a.element, priority: a.priority, subHeaps: append( a.subHeaps, b ) }
  } else {
		return { element: b.element, priority: b.priority, subHeaps: append( b.subHeaps, a ) }
  }
}

function mergeRec<T,P>( list: HeapNode<T,P>[], idx: number ): HeapNode<T,P> {
  if( idx >= list.length ) {
    return undefined
	} else {
		return mergePair( mergePair( list[idx], list[idx+1] ), mergeRec( list, idx+2 ))
	}
}

function makeHeap<T,P>( arraylike: [T,P][] ): HeapNode<T,P> {
	const nodes = []
	for ( const [element,priority] of arraylike ) {
		nodes.push( {element, priority, subHeaps: []} )
	}
	return mergeRec( nodes, 0 )
}

function pushHeap<T,P>( heap: HeapNode<T,P>, element: T, priority: P ): HeapNode<T,P> {
	return merge( heap, makeHeap( [[element,priority]] ))//{element, priority, subHeaps: []} )
}

function popHeap<T,P>( heap: HeapNode<T,P> ): HeapNode<T,P> {
	if ( heap ) {
		return mergeRec( heap.subHeaps, 0 )
	} else {
		return undefined
	}
}

function merge<T,P>( ...nodes: HeapNode<T,P>[] ) {
  return mergeRec( nodes, 0 )
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

	protected root: HeapNode<T,P> = undefined
	protected _length: number

	get length() {
		return this._length
	}

	constructor( 
		protected comparator: (a: P, b: P) => number = PriorityQueue.DEFAULT_COMPARATOR,
		arraylike?: [T,P][],
	) {
		this.root = arraylike !== undefined ? makeHeap( arraylike ) : undefined
		this._length = arraylike !== undefined ? arraylike.length : 0
	}

	isEmpty() {
		return this.root === undefined
	}

	first(): T | undefined {
		return this.root === undefined ? undefined : this.root.element
	}

	firstPriority(): P | undefined {
		return this.root === undefined ? undefined : this.root.priority
	}

	enqueue( element: T, priority: P ): PriorityQueue<T,P> {
		const q = new PriorityQueue<T,P>( this.comparator )
		q.root = pushHeap( this.root, element, priority )
		q._length = this.length + 1
		return q
	}

	dequeue(): PriorityQueue<T,P> {
		if ( this.root === undefined ) {
			return this
		} else {
			const q = new PriorityQueue<T,P>( this.comparator )
			q.root = popHeap( this.root )
			q._length = this.length - 1
			return q
		}
	}
}
