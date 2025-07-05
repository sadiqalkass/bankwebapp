import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {
  const loggedUser = { firstName: 'Sadiq', lastName: 'Dayyub', email:'saddayyub@gmail.com' }
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
