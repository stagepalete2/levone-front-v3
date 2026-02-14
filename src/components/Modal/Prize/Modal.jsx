import Confetti from 'react-confetti'
import { createPortal } from 'react-dom'
import useWindowSize from '../../../hooks/useWindowSize'
import { useLogo } from '../../../zustand'
import styles from './Modal.module.scss'
import { useEffect } from 'react'

export const WinConfetti = () => {
	const { width, height } = useWindowSize()

	return (
		<Confetti
			initialVelocityY={5}
			gravity={0.8}
			recycle={false}
			width={width}
			height={height}
		/>
	)
}

const Modal = ({ prize, onClose }) => {

	const coin = useLogo((state) => state.coin)

	useEffect(() => {
		console.log(coin)
	}, [coin])

	const prizes = {
		prize: {
			name: "Супер Приз",
			icon: "/images/SuperPuperPrize.png",
			description: "Вам доступны 3 награды на выбор",
		},
		coin: {
			name: "Монеты",
			icon: (coin !== null && coin !== undefined) ? `${import.meta.env.VITE_BACKEND_DOMAIN}${coin}` : '/icons/coin.png',
			description: `Вы выиграли ${prize.reward} монет`,
		}
	}

	const currentPrize = prizes[prize.type]

	return createPortal(
		<div className={styles.overlay}>
			<div className={styles.confettiWrapper}>
				<WinConfetti />
			</div>

			<div className={styles.modal}>

				<div className={styles.header}>
					<p className={styles.title}>ВЫ ВЫИГРАЛИ ПРИЗ!</p>
				</div>

				<div className={styles.body}>
					<div className={styles.iconWrapper}>
						<img src={currentPrize.icon} alt={currentPrize.name} className={styles.icon} />
					</div>

					{/* Белая карточка с описанием */}
					<div className={styles.whiteCard}>
						<h3 className={styles.prizeName}>{currentPrize.name}</h3>
						<p className={styles.prizeDescription}>
							{currentPrize.description}
						</p>
					</div>

					<button className={styles.button} onClick={() => onClose()}>
						ЗАБРАТЬ
					</button>
				</div>
			</div>
		</div>,
		document.body
	)
}

export default Modal