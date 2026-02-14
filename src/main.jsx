import { createRoot } from 'react-dom/client'

import vkBridge, { parseURLSearchParamsForGetLaunchParams } from '@vkontakte/vk-bridge'
import { RouterProvider } from '@vkontakte/vk-mini-apps-router'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'

import App from './App.jsx'
import { router } from './routes.js'


import axios from 'axios'
import '@vkontakte/vkui/dist/vkui.css'
import './styles/main.scss'


const Index = () => {
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);

  return (
    <ConfigProvider
      platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
      isWebView={vkBridge.isWebView()}
      transitionMotionEnabled={false}
      hasCustomPanelHeaderAfter={true}
      appearance="light"
    >
      <AppRoot mode='full'>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </AppRoot>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <Index />
)
