import { useState } from "react";

export function useToggle(initialState = false) {
    const [isOn, setIsOn] = useState(initialState)

    function onToggle(isOpen) {
        if (isOpen !== undefined) {
            setIsOn(isOpen)
        } else {
            setIsOn(isOn => !isOn)
        }
    }


    return [isOn, onToggle]
}