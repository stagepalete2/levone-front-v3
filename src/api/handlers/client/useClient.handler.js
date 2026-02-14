
import bridge from '@vkontakte/vk-bridge'
import { useClient } from '../../../zustand'
import postClient from '../../endpoints/post/client.api'

const useClientHandler = () => {
	const setClient = useClient((state) => state.setClient)

	const getClient = async ({ branch }) => {
		try {

			const vkUserInfo = await bridge
				.send('VKWebAppGetUserInfo')
				.catch((err) => {
					console.warn('Failed to get VK user info:', err)
					setIsVkUserLoaded(false)
				})

			if (!vkUserInfo?.id) {
				console.warn('VK user info missing — cannot continue')
				return
			}

			console.log(vkUserInfo)


			const client = await postClient({
				vk_user_id: vkUserInfo.id,
				branch: branch,
				name: vkUserInfo.first_name,
				lastname: vkUserInfo.last_name,
				sex: vkUserInfo.sex
			})

			console.log(client)

			if (client) {
				setClient(client)
			}

			return client
		} catch (error) {
			console.log(error)
		}
	}

	return { getClient }
}

export default useClientHandler