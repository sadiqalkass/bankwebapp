import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Home = async () => {
  const loggedUser = await getLoggedInUser();
  console.log(loggedUser)
  return (
    <section className='home'>
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedUser?.name || 'Guest'}
            subtext="Access and manage your account and transaction efficiently"
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar
        user={loggedUser}
        banks = {[{currentBalance: 123.54}, {currentBalance: 234.65 }]}
        transactions={[]}
      />
    </section>
  )
}

export default Home
