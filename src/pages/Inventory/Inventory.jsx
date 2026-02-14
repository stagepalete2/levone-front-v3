import { useMemo } from 'react'
import inventoryBgAnimation from '../../assets/background/light/my_gift2_A.json'
import ActivePrize from '../../components/Inventory/ActivePrize/ActivePrize'
import Prize from '../../components/Inventory/Prize/Prize'
import SuperPrize from '../../components/Inventory/SuperPrize/SuperPrize'
import ModalManager from '../../components/Modal/Manager'
import Nav from '../../components/Nav/Nav'

import PageBackground from '../../components/PageBackground/PageBackground'
import { useNavigation } from '../../hooks/useHandleNavigation'
import { useInventory, useInventoryCooldown, useModal, useSuperPrize } from '../../zustand'
import styles from './Inventory.module.scss'

const PAGE_ID = 'inventory'

const Inventory = () => {
    const items = useInventory((state) => state.items)
    const super_prize_items = useSuperPrize((state) => state.superPrizes)
    const cooldown = useInventoryCooldown((state) => state.inventoryCooldown)
    const { handleNavigation } = useNavigation()

    const pushModal = useModal((state) => state.pushModal)

    const { activeItems, availableItems, usedItems } = useMemo(() => {
        const active = []
        const available = []
        const used = []

        items.forEach(item => {
            if (item.status === 'ACTIVE') {
                active.push(item)
            } else if (item.status === 'EXPIRED') {
                used.push(item)
            } else {
                available.push(item)
            }
        })
        return { activeItems: active, availableItems: available, usedItems: used }
    }, [items])

    const totalCount = (super_prize_items?.length || 0) + availableItems.length + activeItems.length

    const handleActivatePrize = (prize) => {
        if (prize.status === 'ACTIVE') {
            handleNavigation('/coupon')
            return
        }
        if (cooldown?.is_active || prize.last_activated_at) {
            return
        }
        pushModal({
            pageId: PAGE_ID,
            modal: {
                type: 'activate',
                props: { prize: prize }
            }
        })
    }

    const handleActivateSuperPrize = (super_prize) => {
        pushModal({
            pageId: PAGE_ID,
            modal: {
                type: 'superprize',
                props: { super_prize: super_prize }
            }
        })
    }

    return (
        <div className={styles.wrap}>
            <PageBackground animationData={inventoryBgAnimation} />
            <Nav />
            <div className={styles.pageHeader}>
                <h1 className={styles.title}>МОИ<br />ПОДАРКИ</h1>
                <div className={styles.counterBadge}>
                    <img src='/icons/GIFT.png' className={styles.icon} />
                    <span className={styles.count}>{totalCount} шт.</span>
                </div>
            </div>

            <div className={styles.content}>

                {activeItems.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>АКТИВНЫЕ</h2>
                        {activeItems.map((item) => (
                            <ActivePrize key={item.id} item={item} click={handleActivatePrize} />
                        ))}
                        <div className={styles.divider} />
                    </div>
                )}

                <div className={styles.grid}>
                    {super_prize_items && super_prize_items.map((item) => (
                        <SuperPrize key={item.id} super_prize={item} click={handleActivateSuperPrize} />
                    ))}

                    {availableItems.map((item) => (
                        <Prize key={item.id} item={item} click={handleActivatePrize} />
                    ))}
                </div>

                {usedItems.length > 0 && (
                    <div className={styles.usedSection}>
                        <div className={styles.divider} />
                        <h2 className={styles.usedTitle}>ИСПОЛЬЗОВАННЫЕ</h2>
                        <div className={styles.grid}>
                            {usedItems.map((item) => (
                                <Prize key={item.id} item={item} click={handleActivatePrize} isUsed={true} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ModalManager pageId={PAGE_ID} />
        </div>
    )
}

export default Inventory