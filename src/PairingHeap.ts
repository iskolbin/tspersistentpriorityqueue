export type List<T,P> = {
	head: Heap<T,P>
	next: List<T,P>
} | undefined

export type Heap<T,P> = {
	entry: [T,P],
	subHeaps: List<T,P>
}

export type MaybeHeap<T,P> = Heap<T,P> | undefined

export function merge<T,P>( a: MaybeHeap<T,P>, b: MaybeHeap<T,P>, comparator: (a: P, b: P) => number ): MaybeHeap<T,P> {
  if( !a ) {
    return b
  } else if( !b ) {
    return a
	} else if( comparator( a.entry[1], b.entry[1] ) < 0 ) {
		return { entry: a.entry, subHeaps: { head: b, next: a.subHeaps }}
  } else {
		return { entry: b.entry, subHeaps: { head: a, next: b.subHeaps }}
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
	return merge( heap, { entry: [element, priority], subHeaps: undefined }, comparator )
}

export function deleteMin<T,P>( heap: Heap<T,P>, comparator: (a: P, b: P) => number ): Heap<T,P> {
	return mergePairs( heap.subHeaps, comparator )
}
