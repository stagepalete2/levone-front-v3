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

    // Просто объявляем переменную. Она будет заново создаваться с актуальными 
    // данными при каждом изменении client или group в Zustand.
    const tasks = [
        {
            id: 0,
            title: "Вступить в наше сообщество",
            // Убедитесь, что используете правильный путь. Если флаг лежит 
            // прямо в client, оставьте client?.isJoinedCommunity
            is_complete: client?.is_joined_community || client?.branches?.is_joined_community,
            onClick: () => joinCommunity({ group_id: parseInt(group?.group_id) }),
        },
        {
            id: 1,
            title: "Разрешить отправку сообщений",
            is_complete: client?.is_allowed_message || client?.branches?.is_allowed_message,
            onClick: () => allowMessageFromCommunity({ group_id: parseInt(group?.group_id) }),
        }
    ]

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
        document.body
    )
}

export default Modal