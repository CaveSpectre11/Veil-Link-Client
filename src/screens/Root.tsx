import React, { useEffect, useState } from 'react'
import { useStore } from 'store'

import Setup from './Setup'
import WalletRoot from './WalletRoot'
import Connect from './Connect'
import Loading from './Loading'

const Root = () => {
  const [daemonOptions, setDaemonOptions] = useState({ user: '', pass: '' })
  const { state, effects } = useStore()
  const { daemon } = state
  const { connected } = state.blockchain

  useEffect(() => {
    ;(async () => {
      const options = await effects.daemon.start()
      setDaemonOptions(options)
    })()
  }, [])

  if (connected) {
    return <WalletRoot />
  }

  const { user, pass } = daemonOptions

  switch (daemon.status) {
    case 'unknown':
    case 'starting':
      return <Loading message={daemon.message || ''} />
    case 'new-wallet':
      return <Setup />
    case 'stopping':
      return <Loading message={daemon.message || 'Stopping Veil Core…'} />
    case 'already-running':
      return (
        <Connect message="We detected veild is already running. Connect with the --rpcuser and --rpcpassword you've configured." />
      )
    case 'wallet-loaded':
      return <Connect user={user} pass={pass} />
    default:
      return (
        <Connect message="Please start veild and enter the values you used for the --rpcuser and --rpcpassword options." />
      )
  }
}

export default Root
