import { PriorityQueue } from './src/PriorityQueue'
import { suite, test } from 'mocha-typescript'
import { equal, deepEqual } from 'assert'

@suite class PriorityQueueTestSute {
	@test("length") caseLength() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 2 )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 3 )
		nq = nq.dequeue()
		equal( nq.length, 2 )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 3 )
		nq = nq.dequeue()
		equal( nq.length, 2 )
		nq = nq.dequeue()
		equal( nq.length, 1 )
		nq = nq.dequeue()
		equal( nq.length, 0 )
	}

	@test("it's ok to queue same items, even with same priorities") caseEnqueueSame() {
		let nq = new PriorityQueue<string,number>()
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 2 )
		nq = nq.enqueue( "", 1 )
		equal( nq.length, 3 )
		nq = nq.enqueue( "a", 1 )
		equal( nq.length, 4 )
		nq = nq.enqueue( "b", 2 )
		equal( nq.length, 5 )
	}

	@test("dequeue returns new heap without element with higher priority (min by default)") dequeueCase() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq = nq.enqueue( "1", 1 )
		nq = nq.enqueue( "2", 2 )
		nq = nq.enqueue( "0", 0 )
		nq = nq.enqueue( "5", 5 )
		nq = nq.enqueue( "3", 3 )
		nq = nq.enqueue( "4", 4 )
		equal( nq.length, 6 )
		equal( nq.first(), "0" )
		nq = nq.dequeue()
		equal( nq.first(), "1" )
		nq = nq.dequeue()
		equal( nq.first(), "2" )
		nq = nq.dequeue()
		equal( nq.length, 3 )
		equal( nq.first(), "3" )
		nq = nq.dequeue()
		equal( nq.first(), "4" )
		nq = nq.dequeue()
		equal( nq.first(), "5" )
		nq = nq.dequeue()
		equal( nq.length, 0 )
	}

	@test("dequeue from empty returns the same queue") dequeueEmpty() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.dequeue(), nq )
		nq = nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq = nq.dequeue()
		equal( nq.dequeue(), nq )
	}
	
	@test("default comparator: min heap") defaultComparator() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq = nq.enqueue( "second", 2 ).enqueue( "first", 1 ).enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.first(), "first" )
		nq = nq.dequeue()
		equal( nq.first(), "second" )
		nq = nq.dequeue()
		equal( nq.first(), "third" )
		nq = nq.dequeue()
		equal( nq.length, 0 )
		nq = nq.dequeue()
		equal( nq, nq.dequeue())
		equal( nq.length, 0 )
	}

	@test("custom comparator: max heap") case6() {
		const comparator = (a: number, b: number): number => a > b ? -1 : a < b ? 1 : 0
		let nq = new PriorityQueue<string,number>( comparator )
		equal( nq.length, 0 )
		nq = nq.enqueue( "second", 2 ).enqueue( "first", 1 ).enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.first(), "third" )
		nq = nq.dequeue()
		equal( nq.first(), "second" )
		nq = nq.dequeue()
		equal( nq.first(), "first" )
		nq = nq.dequeue()
		equal( nq.length, 0 )
	}

	@test("has and not has") hasOrNot() {
		let nq = new PriorityQueue<string,number>( undefined, [["first",1],["second",2],["third",3]] )
		equal( nq.length, 3 )
		equal( nq.has( "first" ), true )
		equal( nq.has( "first"  ), true )
		equal( nq.has( "second" ), true )
		equal( nq.has( "third" ), true )
		equal( nq.has( "fourth" ), false )
		nq = nq.dequeue()
		equal( nq.has( "first" ), false )
		equal( nq.has( "second" ), true )
		equal( nq.has( "third" ), true )
		nq = nq.dequeue()
		equal( nq.has( "third" ), true )
		equal( nq.has( "second" ), false )
		nq = nq.dequeue()
		equal( nq.has( "third" ), false )
		equal( nq.length, 0 )
	}
	
	@test("first returns first item or undefined if queue is empty") firstElement() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.first(), undefined )
		equal( nq.firstPriority(), undefined )
		nq = nq.enqueue( "first", 1 ).enqueue( "second", 2 ).enqueue( "third", 3 )
		equal( nq.first(), "first" )
	}

	@test("firstPriority returns first priority or undefined if queue is empty") firstPriority() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq = nq.enqueue( "first", 1 ).enqueue( "second", 2 ).enqueue( "third", 3 )
		equal( nq.firstPriority(), 1 )
	}

	@test("forEach iterates through elements (not sorted)") forEachCase() {
		let nq1 = new PriorityQueue<string,number>()
		let nq = new PriorityQueue<string,number>( undefined, [["first",1],["third",3],["second",2]] )
		equal( nq.length, 3 )
		const items: [string,number][] = []
		nq1.forEach( (elements,priority,q) => {
			items.push( [elements,priority] )
		})
		nq.forEach( (element,priority,q) => {
			items.push( [element,priority] )
		})
		items.sort( ([_,priority1],[_e,priority2]): number => priority1 - priority2 )
		equal( nq.first(), items[0][0] )
		equal( nq.firstPriority(), items[0][1] )
		nq = nq.dequeue()
		equal( nq.first(), items[1][0] )
		equal( nq.firstPriority(), items[1][1] )
		nq = nq.dequeue()
		equal( nq.first(), items[2][0] )
		equal( nq.firstPriority(), items[2][1] )
	}

	@test("clear method clears items (only if not empty)") clearCase() {
		let nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq = nq.clear()
		equal( nq.length, 0 )
		nq = nq.enqueue( "second", 2 )
		nq = nq.enqueue( "first", 1 )
		nq = nq.enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.isEmpty(), false )
		nq = nq.clear()
		equal( nq.length, 0 )
		equal( nq.isEmpty(), true )
	}

	@test("merge merges queue (if they are not the same)") merge() {
		const nq = new PriorityQueue<string,number>(undefined,[["first",1],["second",2]])
		const nq1 = new PriorityQueue<string,number>(undefined,[["fourth",4],["third",3]])
		const nq2 = nq.merge( nq )
		equal( nq2, nq )
		let nq3 = nq1.merge( nq )
		equal( nq3.length, 4 )
		equal( nq3.first(), "first" )
		equal( nq3.firstPriority(), 1 )
		nq3 = nq3.dequeue()
		equal( nq3.first(), "second" )
		equal( nq3.firstPriority(), 2 )
		nq3 = nq3.dequeue()
		equal( nq3.first(), "third" )
		equal( nq3.firstPriority(), 3 )
		nq3 = nq3.dequeue()
		equal( nq3.first(), "fourth" )
		equal( nq3.firstPriority(), 4 )
		nq3 = nq3.dequeue()
		equal( nq3.length, 0 )
	}
}
