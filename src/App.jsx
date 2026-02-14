import { useEffect, useState } from 'react'

import vkBridge from '@vkontakte/vk-bridge'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { Panel, Root, View } from '@vkontakte/vkui'

import useInitData from './hooks/useInitData'

import IsEmployee from './components/Dummy/IsEmployee/IsEmployee'
import Loading from './components/Dummy/Loading/Loading'
import NotInitialized from './components/Dummy/NotInitialized/NotInitialized'
import NotVk from './components/Dummy/NotVk/NotVk'
import Main from './components/Main/Main'
import Catalog from './pages/Catalog/Catalog'
import Coupon from './pages/Coupon/Coupon'
import Game from './pages/Game/Game'
import Inventory from './pages/Inventory/Inventory'
import Profile from './pages/Profile/Profile'
import Quest from './pages/Quest/Quest'
import Review from './pages/Review/Review'
import Transactions from './pages/Transactions/Transactions'

function App() {

  const { root: activeRoot, view: activeView, panel: activePanel } = useActiveVkuiLocation()

  const [isVkBridgeInit, setIsVkBridgeInit] = useState(true)
  const [isVk, setIsVk] = useState(true)

  const { isLoading, isParamsLoaded, isInviteLink, isEmployee, loadData } = useInitData()


  useEffect(() => {
    const init = async () => {
      try {
        const data = await vkBridge.send('VKWebAppInit')
        // const isVk = typeof window !== 'undefined' && window.location?.origin?.includes('vk-apps.com')
        const isVk = typeof window !== 'undefined' && (window.location?.origin?.includes('tunnel.levoneapp.ru') || window.location?.origin?.includes('vk-apps.com'))

        if (!isVk) {
          setIsVk(Boolean(isVk))
        }

        if (data?.result === true) {
          loadData()
        } else {
          setIsVkBridgeInit(false)
        }

        const handler = (e) => {
          if (e.detail.type === 'VKWebAppViewRestore') {
            loadData()
          }
        }

        vkBridge.subscribe(handler)
        return () => vkBridge.unsubscribe(handler)
      } catch (error) {
        console.error(e)
      }
    }

    init()
  }, [])

  if (!isVk) {
    return <NotVk />
  }


  if (isLoading) {
    return <Loading />
  }

  if (isEmployee) {
    return <IsEmployee />
  }


  if (!isParamsLoaded) {
    return <NotInitialized />
  }

  if (isInviteLink) {
    return <NotInitialized />
  }

  return (
    <Main>
      <Root nav={activeRoot} activeView={activeView}>
        <View nav={activeView} activePanel={activePanel}>
          <Panel nav="game" mode="plain" disableBackground disableanimation="true">
            <Game />
          </Panel>

          <Panel nav="profile" mode="plain" disableBackground disableanimation="true">
            <Profile />
          </Panel>

          <Panel nav="transactions" mode="plain" disableBackground disableanimation="true">
            <Transactions />
          </Panel>

          <Panel nav="inventory" mode="plain" disableBackground disableanimation="true">
            <Inventory />
          </Panel>

          <Panel nav="catalog" mode="plain" disableBackground disableanimation="true">
            <Catalog />
          </Panel>

          <Panel nav="quest" mode="plain" disableBackground disableanimation="true">
            <Quest />
          </Panel>

          <Panel nav="coupon" mode="plain" disableBackground disableanimation="true">
            <Coupon />
          </Panel>

          <Panel nav="review" mode="plain" disableBackground disableanimation="true">
            <Review />
          </Panel>
        </View>
      </Root>
    </Main>
  )
}

export default App
