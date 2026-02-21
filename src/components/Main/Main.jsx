import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { classNames } from '@vkontakte/vkui'
import Lottie from 'lottie-react'

import { useNavigation } from '../../hooks/useHandleNavigation'
import { useBranch, useClient, useLogo } from '../../zustand'

import styles from './Main.module.scss'

import giftLightAnimation from '../../assets/gift_light.json'
import giftLoopAnimation from '../../assets/gift_loop.json'

const Main = ({ children }) => {
    const client = useClient((state) => state.client)
    const logotype = useLogo((state) => state.logotype)
    const branch = useBranch((state) => state.branch)
    const { handleNavigation } = useNavigation()
    const { panel: activePanel } = useActiveVkuiLocation()

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <img
                    src={'/LevelUpLogo.png'}
                    alt="Logo"
                    className={styles.logotype}
                    loading='lazy'
                />
                {branch?.name && (
                    <span className={styles.branchName}>{branch.name}</span>
                )}
            </header>

            <main className={styles.content}>
                {children}
            </main>

            <nav className={styles.nav}>
                <button
                    type='button'
                    className={classNames(styles.nav_link, activePanel === 'game' && styles.active)}
                    onClick={() => handleNavigation('/')}
                >
                    <span className={styles.link_icon}>
                        <img src="/icons/House.png" alt="" className={styles.icon} loading='lazy' />
                    </span>
                    <span className={styles.link_text}>ГЛАВНАЯ</span>
                </button>

                {/* Кнопка ПОДАРКИ (Центральная) */}
                <div className={styles.center_button_wrapper}>
                    <button
                        type='button'
                        className={classNames(styles.nav_link, styles.center_link, activePanel === 'inventory' && styles.active)}
                        onClick={() => handleNavigation('/inventory')}
                    >
                        <div className={styles.lottie_background}>
                            <Lottie
                                animationData={giftLightAnimation}
                                loop={true}
                                className={styles.lottie_player}
                            />
                        </div>

                        <span className={styles.link_icon}>
                            <Lottie
                                animationData={giftLoopAnimation}
                                loop={true}
                                className={styles.icon}
                            />
                        </span>

                        <span className={styles.link_text}>ПОДАРКИ</span>
                    </button>
                </div>

                {/* Кнопка ПРОФИЛЬ */}
                <button
                    type='button'
                    className={classNames(styles.nav_link, activePanel === 'profile' && styles.active)}
                    onClick={() => handleNavigation('/profile')}
                >
                    <span className={styles.link_icon}>
                        <img src="/icons/account.png" alt="" className={styles.icon} loading='lazy' />
                    </span>
                    <span className={styles.link_text}>ПРОФИЛЬ</span>
                </button>
            </nav>
        </div>
    )
}

export default Main