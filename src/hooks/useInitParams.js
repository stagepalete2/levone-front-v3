

import { useSearchParams } from '@vkontakte/vk-mini-apps-router'
import { useMemo } from 'react'

const useInitParams = () => {
	const [params, setParams] = useSearchParams();

	const company = useMemo(() => {
		const value = params.get('company')
		return value && value !== 'null' ? value : undefined
	}, [params])

	const branch = useMemo(() => {
		const value = params.get('branch')
		return value && value !== 'null' ? value : undefined
	}, [params])

	const table = useMemo(() => {
		const value = params.get('table')
		return value && value !== 'null' ? value : undefined
	}, [params])

	const is_referral = useMemo(() => {
		const value = params.get('is_referral')
		return value && value !== 'null' ? value : undefined
	}, [params])

	const delivery = useMemo(() => {
		const value = params.get('delivery')
		return value && value !== 'null' ? value : undefined
	}, [params])

	const from = useMemo(() => {
		const value = params.get('from')
		return value && value !== 'null' ? value : undefined
	}, [params])

	return { company, branch, table, is_referral, delivery, from }
}

export default useInitParams