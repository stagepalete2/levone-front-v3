import bridge from '@vkontakte/vk-bridge'
import { useClient } from '../../../zustand.js'
import patchClient from '../../endpoints/patch/updateclient.api.js'

export const useCheckIsJoinedCommunity = () => {
	const setIsJoinedCommunity = useClient((state) => state.setIsJoinedCommunity)

	const checkIsJoinedCommunity = async ({ vk_user_id, branch, group_id }) => {
		try {
			const result = await bridge.send('VKWebAppGetGroupInfo', {
				group_id: parseInt(group_id)
			})
			if (result.id) {
				try {
					const isJoined = result.is_member === 1;
					const response = await patchClient({ vk_user_id: vk_user_id, branch_id: branch, is_joined_community: isJoined })
					if (response) {
						setIsJoinedCommunity(isJoined)
					}
				} catch (error) {
					console.log(error)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	return { checkIsJoinedCommunity }
}