
Class Array of Vector3's

    Allocated Size: 64 Mb
    Execution Time: 1411 ms

Typed Array of Float32

    Allocated Size: 12 Mb
    Execution Time: 26 ms

Hybrid Array of Float32 processed as Vector classes

    Allocated Size: 12 Mb
    Execution Time: 34 ms

Typed Array
    is 54 times faster than storing in objects.
    uses less than 20% of the memory.
    12 bytes for 3 Floats vs 64 bytes for a Vector with 3 numbers.

Hybrid Array
    is still 41 times faster than storing in objects.
    uses same memory as Typed Array, (less than 20%).

Proxy is SUPER SLOW. Not even a remotely option.

Web Assembly performance is about identical to hand optimized Javascript code.
That combined with the fact that to use WASM requires typed arrays to be constructed out of WASM memory (and thus not garbage collectable) makes it a sub-optimal approach.
Stick with potentially optimizing the code right to javascript.

8.77449475071673e+207 wasmTest 64ms
8.77449475071673e+207 wasmTest 38ms
8.77449475071673e+207 wasmTest 40ms
8.77449475071673e+207 wasmTest 39ms
8.77449475071673e+207 wasmTest 39ms
8.77449475071673e+207 wasmTest 32ms
8.77449475071673e+207 wasmTest 37ms
8.77449475071673e+207 wasmTest 37ms
8.77449475071673e+207 testTypedArrayHybrid 125ms
8.77449475071673e+207 testTypedArrayHybrid 142ms
8.77449475071673e+207 testTypedArrayHybrid 73ms
8.77449475071673e+207 testTypedArrayHybrid 73ms
8.77449475071673e+207 testTypedArrayHybrid 56ms
8.77449475071673e+207 testTypedArrayHybrid 52ms
8.77449475071673e+207 testTypedArrayHybrid 60ms
8.77449475071673e+207 testTypedArrayHybrid 57ms
8.77449475071673e+207 testTypedArrayOptimized 57ms
8.77449475071673e+207 testTypedArrayOptimized 54ms
8.77449475071673e+207 testTypedArrayOptimized 48ms
8.77449475071673e+207 testTypedArrayOptimized 51ms
8.77449475071673e+207 testTypedArrayOptimized 44ms
8.77449475071673e+207 testTypedArrayOptimized 47ms
8.77449475071673e+207 testTypedArrayOptimized 46ms
8.77449475071673e+207 testTypedArrayOptimized 46ms
8.774494750716651e+207 testObjects 2492ms
8.774494750716651e+207 testObjects 1995ms
8.774494750716651e+207 testObjects 2280ms
8.774494750716651e+207 testObjects 2280ms
8.774494750716651e+207 testObjects 2404ms
8.774494750716651e+207 testObjects 2385ms
8.774494750716651e+207 testObjects 1959ms
8.774494750716651e+207 testObjects 2315ms

8.7744710529e+207 Optimized C Code 40ms

JS Objects           => 2200 ms     61 times slower
TypedArray Hybrid    => 56 ms       56% slower
TypedArray Optimized => 46 ms       28% slower
Web Assembly         => 36 ms
GCC Optimized C      => 40 ms       11% slower

Summary:
    TypedArray Hybrid which is easy to use is a huge win.
    The next improvement would be optimized javascript for a 22% improvement.
    Because that's fairly hard to do and the benefits are small, not a priority.
    Web Assembly would be 50% faster but that requires memory management and allocating using web assembly memory.
