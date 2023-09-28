import { useEffect, useRef, useState } from "react"

//services
import { eventBusService } from "../services/event-bus.service";
import { utilService } from "../services/util.service"

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const elMsgRef = useRef()

    useEffect(() => {
        console.log(elMsgRef);
        startAnimation()
        const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
            setMsg(msg)
            setTimeout(() => {
                onCloseMsg()
            }, 5000);
        })
        return unsubscribe
    }, [])

    async function startAnimation() {
        try {
            await utilService.animateCSS(elMsgRef.current, 'animate__backInLeft')
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
            <div className={"user-msg " + msg.type}>
                <p ref={elMsgRef}>{msg.txt}</p>
                <button onClick={onCloseMsg}>X</button>
            </div>
        </section>
    )
}
