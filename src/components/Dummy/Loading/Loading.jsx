import { Spinner } from '@vkontakte/vkui'

const Loading = () => {
	return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'black'
    }}
    >
      <Spinner size="xl" />
    </div>
}

export default Loading