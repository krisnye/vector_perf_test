(module
    (memory (import "js" "memory") 1)
    (import "js" "trace" (func $trace (param i32) (param f64)))
    (func $add (param $lhs i32) (param $rhs i32) (result i32)
        get_local $lhs
        get_local $rhs
        i32.add
    )
    (export "add" (func $add))
    (func $addDotArray
        (param $count i32)
        ;; add vector
        (param $ax f64) (param $ay f64) (param $az f64)
        ;; dot vector
        (param $dx f64) (param $dy f64) (param $dz f64)
        (result i32)
        (local $dot f64)
        (local $pointer i32)
        (local $ix f64) (local $iy f64) (local $iz f64)
        (local $i i32)
        (set_local $i (i32.const 0))

        (set_local $pointer (i32.const 0))

        (block $end
            (loop $start
                (br_if 1 (i32.eq (get_local $count) (i32.const 0)))

                (set_local $i (i32.add (get_local $i) (i32.const 1)))
                ;; load the x,y,z vector components
                (set_local $ix (f64.load (i32.add (get_local $pointer) (i32.const  0))))
                (set_local $iy (f64.load (i32.add (get_local $pointer) (i32.const  8))))
                (set_local $iz (f64.load (i32.add (get_local $pointer) (i32.const 16))))
                ;; calculate the dot product
                (set_local
                    $dot
                    (f64.add
                        (f64.add
                            (f64.mul (f64.add (get_local $ix) (get_local $ax)) (get_local $dx))
                            (f64.mul (f64.add (get_local $iy) (get_local $ay)) (get_local $dy))
                        )
                        (f64.mul (f64.add (get_local $iz) (get_local $az)) (get_local $dz))
                    )
                )

                ;; (call $trace (i32.const 10) (get_local $ix))
                ;; (call $trace (i32.const 20) (get_local $iy))
                ;; (call $trace (i32.const 30) (get_local $iz))
                ;; (call $trace (get_local $i) (get_local $dot))

                ;; store the new x,y,z components
                (f64.store (i32.add (get_local $pointer) (i32.const 0)) (f64.mul (get_local $ix) (get_local $dot)))
                (f64.store (i32.add (get_local $pointer) (i32.const 8)) (f64.mul (get_local $iy) (get_local $dot)))
                (f64.store (i32.add (get_local $pointer) (i32.const 16)) (f64.mul (get_local $iz) (get_local $dot)))
                ;; decrement count
                (set_local $count (i32.sub (get_local $count) (i32.const 1)))
                ;; increment pointer
                (set_local $pointer (i32.add (get_local $pointer) (i32.const 24)))
                ;; loop back to start
                (br 0)
            )
        )
        get_local $i
    )
    (export "addDotArray" (func $addDotArray))
    (func $addDot
        ;; initial vector
        (param $ix f64) (param $iy f64) (param $iz f64)
        ;; add vector
        (param $ax f64) (param $ay f64) (param $az f64)
        ;; dot vector
        (param $dx f64) (param $dy f64) (param $dz f64)
        (result f64)

        ;; let dot = (x + addMe.x) * dotMe.x + (y + addMe.y) * dotMe.y + (z + addMe.z) * dotMe.z
        (f64.add
            (f64.add
                (f64.mul (f64.add (get_local $ix) (get_local $ax)) (get_local $dx))
                (f64.mul (f64.add (get_local $iy) (get_local $ay)) (get_local $dy))
            )
           (f64.mul (f64.add (get_local $iz) (get_local $az)) (get_local $dz))
        )
    )
    (export "addDot" (func $addDot))
)