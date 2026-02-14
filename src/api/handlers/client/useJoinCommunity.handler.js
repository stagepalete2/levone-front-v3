import vkBridge from '@vkontakte/vk-bridge'
import { useClient, useParams } from '../../../zustand'
import patchClient from '../../endpoints/patch/updateclient.api'

export const useJoinCommunity = () => {
	const client = useClient((state) => state.client)
	const setIsJoinedCommunity = useClient((state) => state.setIsJoinedCommunity)
	const branch = useParams((state) => state.branch)

	const joinCommunity = async ({ group_id }) => {
		try {
			if (client) {
				const data = await vkBridge.send('VKWebAppJoinGroup', {
					group_id: group_id
				})
				if (data.result) {
					try {
						const response = await patchClient({ vk_user_id: client.vk_user_id, branch_id: branch, is_joined_community: true })
						if (response) {
							setIsJoinedCommunity(true)
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

	return { joinCommunity }
}
