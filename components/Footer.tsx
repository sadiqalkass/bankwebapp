import { loggoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({user, type= 'desktop'}: FooterProps) => {
    const router = useRouter()

    const handleLogOut = async () => {
        const loggout = await loggoutAccount()
        if (loggout) router.push('/sign-in')
    }
  return (
    <footer className='footer'>
    <div className={type === 'mobile'? 'footer_name-mobile':"footer_name"}>
            <p className='text-bold text-gray-700 text-xl'>
                {user.firstName[0]}
            </p>
        </div>
        <div className={type === 'mobile'? 'footer_email-mobile':"footer_email"}>
            <h1 className='text-14 truncate text-gray-700 font-semibold'>
                {user.firstName}
            </h1>
            <p className='text-14 font-normal truncate text-gray-600'>
                {user.email}
            </p>
        </div>
        <div className='footer_image' onClick={handleLogOut}>
            <Image src='icons/logout.svg' fill alt='logout icon'/>
        </div>
    </footer>
  )
}

export default Footer
