import React, { useState, useEffect } from 'react'
import { useStore } from 'store'
import { useToasts } from 'react-toast-notifications'
import Loading from './Loading'
import RPC_ERRORS from 'constants/rpcErrors'
import WalletRoot from './Wallet'

const RpcRoot = () => {
  const { addToast } = useToasts()
  const [warmupMessage, setWarmupMessage] = useState<string | null>()
  const { state, actions } = useStore()
  const { connected } = state.blockchain

  useEffect(() => {
    loadBlockchain()
  }, [])

  const loadBlockchain = async () => {
    const error = await actions.blockchain.load()
    if (error) {
      handleError(error)
    }
  }

  const handleError = ({ message, code }: any) => {
    switch (code) {
      case RPC_ERRORS.RPC_IN_WARMUP:
        setWarmupMessage(message)
        setTimeout(async () => {
          await loadBlockchain()
        }, 500)
        break
      case undefined:
        setWarmupMessage(null)
        addToast(message, { appearance: 'error' })
        break
    }
  }

  if (true || connected) {
    return <WalletRoot />
  } else {
    return <Loading message={warmupMessage || 'Loading blockchain info…'} />
  }
}

export default RpcRoot
