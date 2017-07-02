export type List<T,P> = {
	head: Heap<T,P>
	next: List<T,P>
} | undefined

export type Heap<T,P> = {
	element: T,
	priority: P,
	subHeaps: List<T,P>
} | undefined

export function merge<T,P>( a: Heap<T,P>, b: Heap<T,P>, comparator: (a: P, b: P) => number ): Heap<T,P> {
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

export function mergePairs<T,P>( list: List<T,P>, comparator: (a: P, b: P) => number ): Heap<T,P> {
	if( !list ) {
		return undefined
	} else if ( !list.next ) {
		return list.head
	} else {
		return merge( merge( list.head, list.next.head, comparator ), mergePairs( list.next.next, comparator ), comparator )
	}
}

export function insert<T,P>( heap: Heap<T,P>, element: T, priority: P, comparator: (a: P, b: P) => number ): Heap<T,P> {
	return merge( heap, { element, priority, subHeaps: undefined }, comparator )
}

export function deleteMin<T,P>( heap: Heap<T,P>, comparator: (a: P, b: P) => number ): Heap<T,P> {
	if ( heap ) {
		return mergePairs( heap.subHeaps, comparator )
	} else {
		return undefined
	}
}
