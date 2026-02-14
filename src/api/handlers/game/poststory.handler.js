import vkBridge from '@vkontakte/vk-bridge'
import { useClient, useGameCooldown, useParams } from '../../../zustand'
import patchClient from '../../endpoints/patch/updateclient.api'
import unsetGameCooldown from '../../endpoints/post/unsetgamecooldown.api'



const usePostStory = () => {
	const client = useClient((state) => state.client)
	const company = useParams((state) => state.company)
	const branch = useParams((state) => state.branch)
	const setIsStoryUploaded = useClient((state) => state.setIsStoryUploaded)
	const resetGameCooldown = useGameCooldown((state) => state.resetGameCooldown)

	const post = async ({ image }) => {
		try {
			const data = await vkBridge.send("VKWebAppShowStoryBox", {
				background_type: "image",
				url: image,
				locked: true,
				stickers: [{
					sticker_type: "renderable",
					sticker: {
						content_type: "image",
						url: `${import.meta.env.VITE_BACKEND_DOMAIN}/static/images/fallback_transparent.png`,
						transform: {
							relation_width: 1,
							translation_y: -0.1,
							gravity: "center_bottom",
						},
						clickable_zones: [{
							action_type: "link",
							action: {
								link: `https://m.vk.com/app53418653/#/?company=${company}&branch=${branch}&is_referral=${true}&from=${client.id}`
							},
							clickable_area: [
								// { x: 160, y: 245 },
								// { x: 930, y: 245 },
								// { x: 930, y: 650 },
								// { x: 160, y: 650 }
							]
						}]
					},
					can_delete: false
				}]
			});



			if (data?.result) {
				const res = await patchClient({
					vk_user_id: client.vk_user_id,
					branch_id: branch,
					is_story_uploaded: true
				})
				if (res) {
					setIsStoryUploaded(true)
					resetGameCooldown()
					const deleteresponse = await unsetGameCooldown({
						vk_user_id: client.vk_user_id,
						branch: branch
					})
					if (deleteresponse) {
						console.log(deleteresponse)
					}
				}
			}

			return data
		} catch (error) {
			console.log(error)
		}
	}

	return { post }
}

export default usePostStory