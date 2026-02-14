import bridge from '@vkontakte/vk-bridge'
import { useClient, useParams } from '../../../zustand'
import patchClient from '../../endpoints/patch/updateclient.api'



export const useAllowMessageFromCommunity = () => {
	const client = useClient((state) => state.client)
	const branch = useParams((state) => state.branch)
	const setIsAllowedMessageFromCommunity = useClient((state) => state.setIsAllowedMessageFromCommunity)

	const allowMessageFromCommunity = async ({ group_id }) => {
		try {
			if (client) {
				const data = await bridge.send('VKWebAppAllowMessagesFromGroup', {
					group_id: group_id
				})

				if (data.result) {
					try {
						const response = await patchClient({
							vk_user_id: client.vk_user_id,
							branch_id: branch,
							is_allowed_message: true
						})
						if (response) {
							setIsAllowedMessageFromCommunity(true)
						}
					} catch (error) {
						console.log(error)
					}
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	return { allowMessageFromCommunity }
}