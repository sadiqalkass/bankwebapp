import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccounts, getAccount } from '@/lib/actions/bank.actions'
import React from 'react'

const Home = async ({searchParams: {id, page}}: SearchParamsProps) => {
  const loggedUser = await getLoggedInUser();
  const accounts = getAccounts({
    userId: loggedUser.$id
  })

  const accountsData = accounts?.data
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId 
  if(!account) return

  const account = getAccount({appwriteItemId})

  return (
    <section className='home'>
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedUser?.firstName || 'Guest'}
            subtext="Access and manage your account and transaction efficiently"
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
        user={loggedUser}
        banks = {accountsData?.slice(0, 2)}
        transactions={accounts?.transactions}
      />
    </section>
  )
}

export default Home
