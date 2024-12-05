import LoggedInNav from '@/components/Nav/LoggedInNav'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import { useStore } from '@/store/use-store'
import axios from 'axios'

function Profile() {
  const router = useRouter()
  const store = useStore()
  const { global: { user, token, update, _alert, } } = store
  const rotateApiKey = async () => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/user/rotateApiKey`, {
      email: user?.email,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    update('user', data?.user)
    console.log("data:", data?.user?.apikey)
    // copy to clipboard 
    navigator.clipboard.writeText(data?.user?.apikey)
    _alert('Api Key rotated and copied to clipboard', 'success')
  }
  return <LoggedInNav name="Profile">
    <div className="flex flex-col justify-center items-center">
      <p className='text-md pb-4'>
        Here's your api key.
        Keep this safe.
      </p>
      <div>
        <label htmlFor="apikey" className="block text-sm/6 font-medium text-gray-900">
          API Key
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="apikey"
            name="apikey"
            type="text"
            className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
            value={user?.apikey?.slice(0, 17) + '...'}
            onChange={() => { }}
          />
          <button
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            onClick={() => {
              navigator.clipboard.writeText(user?.apikey)
              _alert('Copied API Key to clipboard', 'success')
            }}
          >
            Copy
          </button>
          <button
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            onClick={rotateApiKey}
          >
            Rotate
          </button>
        </div>
      </div>
    </div>
  </LoggedInNav>
}

export default observer(Profile)