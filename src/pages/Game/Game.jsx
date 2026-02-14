import { useEffect } from 'react'
import gameBgAnimation from '../../assets/background/light/welcome win1 2 3 A.json'
import Testimonial from '../../components/Game/Testimonial/Testimonial'
import ModalManager from '../../components/Modal/Manager'
// Убедитесь, что путь к компоненту верный
import PageBackground from '../../components/PageBackground/PageBackground'

import Countdown from '../../components/Countdown/Countdown'
import Rocket from '../../components/Game/Board/Rocket'
import { getTimeLeft } from '../../helpers/time'
import { useClient, useGameCooldown, useHasShownPostStory, useModal, useParams, usePlay, useView } from '../../zustand'
import styles from './Game.module.scss'

const PAGE_ID = 'game'

const Intro = () => {
	const setStart = usePlay((state) => state.setStart)
	const setView = useView((state) => state.setView)
	const cooldown = useGameCooldown((state) => state.gameCooldown)
	const unsetGameCooldown = useGameCooldown((state) => state.unsetGameCooldown)

	const startGame = () => {
		setStart(null)
		setView('game')
	}

	const onComplete = () => {
		unsetGameCooldown()
	}

	return (
		<>
			<div className={styles.text}>
				<h2>ИГРАЙ И ЗАБИРАЙ<br />СКИДКУ</h2>
			</div>

			<div className={styles.content}>
				<div className={styles.rulesCard}>
					<div className={styles.cardTitle}>ПРАВИЛА</div>

					<div className={styles.cardDescription}>
						Ракета ждёт — жми и выигрывай!
					</div>

					<div className={styles.cardIcon}>
						<span>🚀</span>
					</div>
					{cooldown?.is_active ? (
						<button className={styles.playButton}>
							<Countdown
								duration={getTimeLeft(cooldown.last_activated_at, cooldown.duration, import.meta.env.VITE_TZ)}
								onComplete={() => onComplete()}
								color='black'
							/>
						</button>
					) : (
						<button className={styles.playButton} onClick={startGame}>
							НАЧАТЬ
						</button>
					)}
				</div>

				<Testimonial />
			</div>
		</>
	)
}

const Game = () => {
	const view = useView((state) => state.view)
	const client = useClient((state) => state.client)
	const branch = useParams((state) => state.branch)
	const cooldown = useGameCooldown((state) => state.gameCooldown)
	const hasShownPostStory = useHasShownPostStory((state) => state.hasShownPostStory);
	const setHasShownPostStory = useHasShownPostStory((state) => state.setHasShownPostStory)
	const pushModal = useModal((state) => state.pushModal)

	useEffect(() => {
		if (hasShownPostStory || !client || !cooldown) return;

		if (client.birth_date && !client.isStoryUploaded && cooldown?.is_active) {

			const timer = setTimeout(() => {
				pushModal({
					pageId: PAGE_ID,
					modal: { type: "poststory" },
				});
				setHasShownPostStory(true);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [client, cooldown, hasShownPostStory, pushModal, setHasShownPostStory]);

	useEffect(() => {
		if (!client || !branch) return;

		if (!client.birth_date) {
			pushModal({
				pageId: PAGE_ID,
				modal: { type: 'birth' }
			})
		}
	}, [client, branch])

	return (
		<>
			<div className={styles.wrap}>
				<PageBackground animationData={gameBgAnimation} />
				{view === 'intro' && <Intro />}
				{view === 'game' && <Rocket />}
			</div>

			<ModalManager pageId={PAGE_ID} />
		</>
	)
}

export default Game