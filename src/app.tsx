import { Toaster } from 'react-hot-toast'
import { useManagerData } from '~/hooks/use-manager-data'
import { LoginScreen } from '~/components/login-screen'
import { AppLoadingScreen } from '~/components/ui'
import useRouteElements from '~/use-route-elements'

const App = () => {
    const m = useManagerData()
    const routeElements = useRouteElements(m)

    if (!m.user) {
        return (
            <>
                <LoginScreen
                    theme={m.theme}
                    authError={m.authError}
                    toggleTheme={m.toggleTheme}
                    googleClientId={m.googleClientId}
                    onCredentialResponse={m.handleCredentialResponse}
                />
                <Toaster position='bottom-right' />
            </>
        )
    }

    if (!m.isServerLoaded) {
        return (
            <>
                <AppLoadingScreen
                    theme={m.theme}
                    syncStatus={m.syncStatus}
                    syncMessage={m.syncMessage}
                    gasUrl={m.gasUrl}
                    onRetry={() => m.fetchFromGoogleSheets()}
                    onSaveGasUrl={m.handleSaveGasUrl}
                    onLogout={m.handleLogout}
                />
                <Toaster position='bottom-right' />
            </>
        )
    }

    return (
        <div className='w-full max-w-full overflow-x-hidden min-h-screen'>
            {routeElements}
            <Toaster position='bottom-right' />
        </div>
    )
}

export default App
