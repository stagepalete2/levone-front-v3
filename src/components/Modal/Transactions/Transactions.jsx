import { Icon28Cancel, Icon28NewsfeedOutline } from '@vkontakte/icons'
import { ColorSchemeProvider, ModalPage, ModalPageHeader, PanelHeaderButton } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import getTransactions from '../../../api/endpoints/get/transactions.api'
import { useClient, useLogo, useParams } from '../../../zustand'
import styles from './Transactions.module.scss'

const Transactions = ({ open, setOpen }) => {
    const client = useClient((state) => state.client)
    const branch = useParams((state) => state.branch)
    const coin = useLogo((state) => state.coin)
    const [transactions, setTransactions] = useState([])

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions({
                branch: branch,
                vk_user_id: client.vk_user_id
            })
            // Убедимся, что пришел массив, иначе ставим пустой
            setTransactions(Array.isArray(response) ? response : [])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (open) {
            fetchTransactions()
        }
    }, [open]) // Лучше обновлять при открытии

    // Хелпер для форматирования даты и времени
    const formatDateTime = (isoString) => {
        const date = new Date(isoString)
        return {
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: date.toLocaleDateString() // Выведет формат ДД.ММ.ГГГГ
        }
    }

    // Хелпер для получения названия операции
    const getTitle = (item) => {
        // Если есть описание от админа/системы, показываем его
        if (item.description) return item.description

        // Иначе мапим по источнику (source)
        switch (item.source) {
            case 'SHOP': return 'Магазин подарков'
            case 'GAME': return 'Игра Memory'
            case 'QUEST': return 'Выполнение задания'
            case 'ADMIN': return 'Начисление администратором'
            case 'INITIAL': return 'Приветственный бонус'
            default: return 'Операция'
        }
    }

    const onClose = () => {
        setOpen(false)
    }

    return (
        <ColorSchemeProvider value="light" className={styles.modal}>
            <ModalPage
                id='transactions-modal'
                open={open}
                onClose={onClose}
                settlingHeight={100}
                className={styles.modal}
                header={
                    <ModalPageHeader
                        after={
                            <PanelHeaderButton onClick={onClose} aria-label="Закрыть">
                                <Icon28Cancel fill="black" />
                            </PanelHeaderButton>
                        }
                    />
                }
            >
                <div className={styles.wrap}>
                    <div className={styles.balanceHeader}>
                        <span className={styles.label}>БАЛАНС:</span>
                        <div className={styles.balanceBadge}>
                            <span className={styles.value}>★ {client?.coins_balance || 0}</span>
                        </div>
                    </div>

                    {/* 2. Карточка операций */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Icon28NewsfeedOutline width={24} height={24} className={styles.icon} />
                            <span className={styles.title}>ОПЕРАЦИИ</span>
                        </div>

                        <div className={styles.list}>
                            {transactions.length > 0 ? transactions.map((item) => {
                                const { time, date } = formatDateTime(item.created_on)
                                const isExpense = item.type === 'ТРАТА' // Проверяем тип
                                const title = getTitle(item)

                                return (
                                    <div key={item.id || item.created_on} className={styles.item}>
                                        <div className={styles.info}>
                                            <div className={styles.datetime}>
                                                {time}<br />
                                                {date}
                                            </div>
                                            <div className={styles.name}>{title}</div>
                                        </div>

                                        <div className={styles.amountBadge}>
                                            <span className={`${styles.amountText} ${isExpense ? styles.negative : styles.positive}`}>
                                                ★
                                                {/* Если трата, рисуем минус, иначе плюс */}
                                                {isExpense ? '-' : '+'}{item.amount}
                                            </span>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
                                    История пуста
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalPage>
        </ColorSchemeProvider>
    )
}

export default Transactions