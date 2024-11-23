//@ts-nocheck

import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react";
import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react";
type ActionStatus = "fresh" | "pending" | "success" | "failed" | "reset"
type ButtonState = {
    class:string,
    element: ReactNode,
    disabled:boolean
}
type CompProps = {
    children: {
        [key in ActionStatus]?: () => Partial<ButtonState>
    },
    action: () => Promise<void>,
    className?: string,
    successTimeout?:number
}
const Comp = (props:CompProps, ref: any) => {
    let [status, setStatus] = useState<ActionStatus>("fresh")
    let defaultState = useMemo(()=>({
        class: props.className ?? "",
        disabled: false,
        element: <div></div>,
        ...props.children["fresh"]?.()
    }), [])
    let state = useMemo(() => {
        let new_state = props.children[status]?.()
        let _state = {
            ...defaultState,
            ...new_state
        }
        return _state as ButtonState;
    }, [status])
    return (
        <button
            disabled={state.disabled}
            className={`${props.className} ${state.class}`}
            onClick={() => {
                setStatus("pending")
                props.action()
                    .then(() => {
                        console.log("success")
                        setStatus("success")
                        if (props.successTimeout != undefined)
                            setTimeout(() => {
                                setStatus("reset")
                            }, props.successTimeout)
                    })
                    .catch(() => setStatus("failed"))
            }}
        >
            {state.element}
        </button>
    )
}
export default forwardRef(Comp);