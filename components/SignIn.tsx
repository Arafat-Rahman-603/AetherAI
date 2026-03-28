import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return <div className=''>
    <div className='h-full w-full flex items-center justify-between sm:px-12 px-6 py-3'>
        <h1 className="text-2xl font-bold text-gray-300">Aether<span className="text-gray-400">AI</span></h1>
      </div>
    <div className='h-full w-full flex items-center justify-center'>
        <SignIn routing="path" path="/sign-in" redirectUrl="/" fallbackRedirectUrl="/" />
    </div>
    </div>
}