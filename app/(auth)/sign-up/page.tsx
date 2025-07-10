import React from 'react'
import AuthForm from '@/components/AuthForm'


const SignUp = async () => {
  return (
    <section className='flex-center max-sm:px-6 size-full '>
      <AuthForm type= 'sign-up'/>
    </section>
  )
}

export default SignUp
