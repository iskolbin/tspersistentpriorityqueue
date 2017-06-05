[![Build Status](https://travis-ci.org/iskolbin/tspersistentpriorityqueue.svg?branch=master)](https://travis-ci.org/iskolbin/tspersistentpriorityqueue)
[![license](https://img.shields.io/badge/license-public%20domain-blue.svg)](http://unlicense.org/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)


Persistent priority queue
=========================

Persistent priority queue implemented with [pairing heap](https://en.wikipedia.org/wiki/Pairing_heap).
Implementation allows fast peek, enqueue, dequeue.


## constructor(comparator = DEFAULT\_COMPARATOR, arraylike?: \[T,P][])

Creates new queue. By default uses `comparator` for **minimal heap**, i.e. item with
the smallest priority will dequeue first. If `arraylike` is passed populate queue


## length

Property returning size of the queue


## isEmpty

Yields `true` if `length` is zero and `false` otherwise


## enqueue(element: T, priority: P): PriorityQueue<T,P>

Enqueues `element` into the queue with specified `priority`. Returns new queue


## dequeue(): PriorityQueue<T,P>

Dequeue element from queue and returns new queue. If queue is empty returns itself


## first(): T | undefined

Returns element with the highest priority or `undefined` if the queue is empty


## firstPriority(): P | undefined

Returns highest priority of the queue or `undefined` if the queue is empty


## has(element: T): boolean

Returns `true` if the `element` is in the queue and `false` otherwise.
This is slow O(n) method


## clear(): boolean

If queue has items returns new empty queue otherwise returns itself


## forEach( callback(element: T, priority: P, queue: PriorityQueue<T,P>), thisArg?: any )

Calls `callback` for each element and priority in the queue.
