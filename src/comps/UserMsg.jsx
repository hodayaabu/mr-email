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
        if (msg) startAnimation()
    }, [msg])

    async function startAnimation() {
        try {
            console.log(elMsgRef);
            await utilService.animateCSS(elMsgRef.current, 'backInLeft')
        } catch (arr) {
            console.log(arr);
        }
    }

    async function onCloseMsg() {
        // await utilService.animateCSS(userMessage.current, 'animate__backOutLeft')
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
