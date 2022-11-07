import { useNotification } from '@web3uikit/core'
import { ethers, ContractTransaction } from 'ethers'
import { useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abi, addresses } from '../constants'

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex!).toString()

    const handleNotification = useNotification()

    const raffleAddress =
        chainId in addresses ? addresses[chainId as keyof typeof addresses][0] : undefined

    const { runContractFunction: getEntranceFee, data: entranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee',
        params: {},
    })

    const { runContractFunction: getNumPlayers, data: numPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getNumPlayers',
        params: {},
    })

    const { runContractFunction: getRecentWinner, data: recentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getRecentWinner',
        params: {},
    })

    console.log('recentWinner', recentWinner)
    useEffect(() => {
        if (isWeb3Enabled) {
            getEntranceFee()
            getNumPlayers()
            getRecentWinner()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    const {
        runContractFunction: enterRaffle,
        isFetching: isFetchingEnterRaffle,
        isLoading: isLoadingEnterRaffle,
    } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        params: {},
        msgValue: entranceFee as string,
    })

    const onEnterRaffle = () => {
        enterRaffle({
            onSuccess: async (tx) => {
                ;(tx as ContractTransaction).wait(1)
                handleNotification({
                    type: 'success',
                    message: 'Transaction Complete!',
                    title: 'Tx Notification',
                    position: 'topR',
                })
            },
        })
    }

    return (
        <div>
            {raffleAddress ? (
                <>
                    Number of players {numPlayers?.toString()} Entrance Fee: Recent Winner{' '}
                    {recentWinner}
                    {''}
                    {!!entranceFee && ethers.utils.formatUnits(entranceFee as bigint, 'ether')} ETH
                    <button
                        onClick={onEnterRaffle}
                        disabled={isFetchingEnterRaffle || isLoadingEnterRaffle}
                    >
                        Enter Raffle
                    </button>
                </>
            ) : (
                <>No Raffle address detected</>
            )}
        </div>
    )
}

export default LotteryEntrance
