"use client"
import { KeyframeOptions, useIsomorphicLayoutEffect } from 'framer-motion'
import React, { useRef } from 'react'
import { animate } from 'framer-motion'

type AnimatedCounterProps = {
    from: number, 
    to: number,
    animationOptions?: KeyframeOptions 
}

const AnimatedCounter = ({from, to, animationOptions}: AnimatedCounterProps) => {
    const ref = useRef<HTMLSpanElement>(null)
    useIsomorphicLayoutEffect(()=>{
        const element = ref.current

        if(!element) return

        element.textContent = String(from)

        const controls = animate(from, to, {
            duration: 5,   // durata dell'animazione
            ease: [0.25, 0.1, 0.25, 1], // Bezier easing che rallenta verso la fine
            ...animationOptions,
            onUpdate(value){
                element.textContent = String(value.toFixed(0))
            }
        })

        return () => {
            controls.stop()
        }
    }, [ref, from, to])

    return <span ref={ref}></span>
}

export default AnimatedCounter
