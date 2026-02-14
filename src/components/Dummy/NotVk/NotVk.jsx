
import { Icon32LogoVk } from '@vkontakte/icons'

import styles from './NotVk.module.scss'

const NotVk = () => {

	return (
		<div className={styles.wrap}>
			<img src="/LevelUpLogo.png" alt="Логотип" className={styles.logotype}/>
			<hr className={styles.divider} />
			<a
				className={styles.button}
				href="https://m.vk.com/app53418653"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon32LogoVk />
				Открыть во ВКонтакте
			</a>
		</div>
	)
}

export default NotVk