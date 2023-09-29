import { useEffect, useRef, useState } from "react"

//services
import { eventBusService } from "../services/event-bus.service";
import { utilService } from "../services/util.service"

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const elMsgRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
            setMsg(msg)
            setTimeout(() => {
                onCloseMsg()
            }, 5000);
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        if (msg) startAnimation('backInLeft')
    }, [msg])

    async function startAnimation(animation) {
        try {
            await utilService.animateCSS(elMsgRef.current, animation)
        } catch (arr) {
            console.log("cennot start animateCSS:", arr);
        }
    }

    async function onCloseMsg() {
        await startAnimation('backOutLeft')
        setMsg(null)
    }

    if (!msg) return <></>
    return (
        <section>
            <div ref={elMsgRef} className={"user-msg " + msg.type}>
                <p >{msg.txt}</p>
                <button onClick={onCloseMsg}>X</button>
            </div>
        </section>
    )
}
