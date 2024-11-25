//@ts-nocheck

// @flow strict
"use client"
import { autoUpdate, useFloating, Placement, shift } from "@floating-ui/react-dom";
import { ReactNode, useEffect, useRef, useState } from "react";

function ReactPopover({
    content,
    popover,
    placement,
    className
}: {
    content:(ref:any)=>ReactNode,
    popover: ReactNode,
        placement: Placement,
    className?:string,
}) {
    const [show, setShow] = useState(false)
    
    const { refs, floatingStyles } = useFloating({
        //open: show,
        placement,
        whileElementsMounted: autoUpdate,
        middleware:[shift()]
    });
    const mouseEnter = () => {
        setShow(true)
        
    }
    const mouseLeave = (e: any) => {
        
        setShow(false)
        console.log(e.target)
    }

    return (
        <div
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            className={className}
            //onMouseOut={mouseLeave}
        >
            {content(refs.setReference)}
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                className={`bg-white z-10 p-3 rounded-md transition-opacity ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
                {popover}
            </div>
        </div>
    );
};

export default ReactPopover;