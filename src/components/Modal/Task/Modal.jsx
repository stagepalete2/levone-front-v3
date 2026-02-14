import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAllowMessageFromCommunity } from '../../../api/handlers/client/useAllowMessageFromCommunity.handler'
import { useJoinCommunity } from '../../../api/handlers/client/useJoinCommunity.handler'
import { useClient, useGroup } from '../../../zustand'
import styles from './Modal.module.scss'

const Modal = ({ onClose }) => {
    const [shake, setShake] = useState(false)

    const { joinCommunity } = useJoinCommunity()
    const { allowMessageFromCommunity } = useAllowMessageFromCommunity()

    const group = useGroup((state) => state.group)
    const client = useClient((state) => state.client)


    const [tasks, setTasks] = useState([
        {
            id: 0,
            title: "Вступить в наше сообщество",
            is_complete: client?.branches?.isJoinedCommunity,
            onClick: () => joinCommunity({ group_id: parseInt(group?.group_id) }),
        },
        {
            id: 1,
            title: "Разрешить отправку сообщений",
            is_complete: client?.branches?.isAllowedMessageFromCommunity,
            onClick: () => allowMessageFromCommunity({ group_id: parseInt(group?.group_id) }),
        }
    ])

    useEffect(() => {
        if (client?.isJoinedCommunity) {
            setTasks((prev) => prev.map((task) => task.id === 0 ? { ...task, is_complete: true } : task))
        }
    }, [client?.isJoinedCommunity])

    useEffect(() => {
        if (client?.isAllowedMessageFromCommunity) {
            setTasks((prev) => prev.map((task) => task.id === 1 ? { ...task, is_complete: true } : task))
        }
    }, [client?.isAllowedMessageFromCommunity])

    useEffect(() => {
        if (shake) {
            const timeout = setTimeout(() => setShake(false), 1000)
            return () => clearTimeout(timeout)
        }
    }, [shake])

    const handleMainButtonClick = () => {
        const allDone = tasks.every((task) => task.is_complete)

        if (allDone) {
            onClose()
        } else {
            setShake(true)
        }
    }

    return createPortal(
        <div className={styles.overlay}>

            <div className={styles.logoContainer}>
                <img src='/LevelUpLogo.png' alt="Logo" />
            </div>

            <h2 className={styles.title}>
                ТВОЙ ПОДАРОК<br />УЖЕ ЖДЁТ!
            </h2>

            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={styles.taskRow}
                        onClick={!task.is_complete ? task.onClick : undefined}
                    >
                        <div className={`${styles.checkbox} ${task.is_complete ? styles.checked : ''}`} />

                        <span className={styles.taskLabel}>{task.title}</span>
                    </div>
                ))}
            </div>

            <button
                className={`${styles.mainButton} ${shake ? styles.shake : ''}`}
                onClick={handleMainButtonClick}
            >
                РАЗРЕШИТЬ
            </button>
        </div>,
        document.body // Узел DOM, куда рендерим
    )
}

export default Modal