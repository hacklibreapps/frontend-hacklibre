'use client'

import React, { useState } from 'react'
import { FiCreditCard, FiLock } from 'react-icons/fi'

export default function PaymentTabsCard() {
  const [tab, setTab] = useState<'card' | 'paypal'>('card')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      setTab((t) => (t === 'card' ? 'paypal' : 'card'))
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      setTab((t) => (t === 'paypal' ? 'card' : 'paypal'))
    else if (e.key === 'Home') setTab('card')
    else if (e.key === 'End') setTab('paypal')
  }

  return (
    <div className='relative flex w-full max-w-[24rem] flex-col rounded-lg border border-Cian2 bg-white shadow-sm'>
      <div className='relative m-2.5 flex h-32 flex-col items-center justify-center rounded-md bg-Cian8 text-white'>
        <div className='mb-4'>
          <FiCreditCard className='h-10 w-10' />
        </div>
        <h5 className='text-xl'>Material Tailwind PRO</h5>
      </div>

      <div className='p-6'>
        <div className='w-full'>
          <div className='relative'>
            <ul
              className='relative flex list-none flex-wrap rounded-md bg-Cian2 px-1.5 py-1.5'
              role='tablist'
              aria-label='Método de pago'
            >
              <li className='z-30 flex-auto text-center'>
                <button
                  id='tab-card'
                  type='button'
                  role='tab'
                  aria-selected={tab === 'card'}
                  aria-controls='panel-card'
                  tabIndex={tab === 'card' ? 0 : -1}
                  onKeyDown={handleKeyDown}
                  onClick={() => setTab('card')}
                  className={`z-30 mb-0 flex w-full items-center justify-center rounded-md px-0 py-2 text-sm transition-all ease-in-out ${
                    tab === 'card'
                      ? 'bg-white text-Charcoal shadow'
                      : 'bg-inherit text-Cian8'
                  }`}
                >
                  Pay with Card
                </button>
              </li>
              <li className='z-30 flex-auto text-center'>
                <button
                  id='tab-paypal'
                  type='button'
                  role='tab'
                  aria-selected={tab === 'paypal'}
                  aria-controls='panel-paypal'
                  tabIndex={tab === 'paypal' ? 0 : -1}
                  onKeyDown={handleKeyDown}
                  onClick={() => setTab('paypal')}
                  className={`z-30 mb-0 flex w-full items-center justify-center rounded-md px-0 py-2 text-sm transition-all ease-in-out ${
                    tab === 'paypal'
                      ? 'bg-white text-Charcoal shadow'
                      : 'bg-inherit text-Cian8'
                  }`}
                >
                  Pay with PayPal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className='relative block w-full overflow-hidden bg-transparent'>
          <div
            id='panel-card'
            role='tabpanel'
            aria-labelledby='tab-card'
            hidden={tab !== 'card'}
          >
            <form className='mt-8 flex flex-col'>
              <div className='w-full min-w-[200px] max-w-sm'>
                <label className='mb-2 block text-sm text-Charcoal/80'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full rounded-md border border-Cian2 bg-transparent px-3 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                  placeholder='Your Email'
                />
              </div>

              <label className='mt-4 mb-1 block text-sm text-Charcoal/80'>
                Card Details
              </label>
              <input
                type='text'
                className='w-full rounded-md border border-Cian2 bg-transparent pl-3 pr-20 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                placeholder='1234 5678 9012 3456'
              />

              <div className='mt-1 flex'>
                <div className='mr-4 w-full md:w-8/12'>
                  <label className='mt-4 mb-1 block text-sm text-Charcoal/80'>
                    Expiration Date
                  </label>
                  <input
                    type='text'
                    className='w-full rounded-md border border-Cian2 bg-transparent pl-3 pr-20 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                    placeholder='MM/YY'
                  />
                </div>
                <div className='w-full md:w-4/12'>
                  <label className='mt-4 mb-1 block text-sm text-Charcoal/80'>
                    CVV
                  </label>
                  <input
                    type='text'
                    className='w-full rounded-md border border-Cian2 bg-transparent px-3 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                    placeholder='123'
                  />
                </div>
              </div>

              <label className='mt-4 mb-1 block text-sm text-Charcoal/80'>
                Holder Name
              </label>
              <input
                type='text'
                className='w-full rounded-md border border-Cian2 bg-transparent pl-3 pr-20 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                placeholder='e.g John Doe'
              />

              <button
                type='button'
                className='mt-6 w-full rounded-md border border-transparent bg-Green8 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-Green7'
              >
                Pay Now
              </button>

              <p className='mt-4 flex items-center justify-center gap-2 text-sm font-light text-Charcoal/70'>
                <FiLock className='-mt-0.5 h-4 w-4' />
                Payments are secure and encrypted
              </p>
            </form>
          </div>

          <div
            id='panel-paypal'
            role='tabpanel'
            aria-labelledby='tab-paypal'
            hidden={tab !== 'paypal'}
            className='mt-8'
          >
            <form className='flex flex-col'>
              <div className='w-full min-w-[200px] max-w-sm'>
                <label className='mb-2 block text-sm text-Charcoal/80'>
                  PayPal Email
                </label>
                <input
                  type='email'
                  className='w-full rounded-md border border-Cian2 bg-transparent px-3 py-2 text-sm text-Charcoal shadow-sm transition duration-300 ease focus:shadow focus:outline-none focus:border-Cian4 placeholder:text-Charcoal/50 hover:border-Cian4'
                  placeholder='your-paypal@email.com'
                />
              </div>

              <button
                type='button'
                className='mt-6 w-full rounded-md border border-Cian8 px-4 py-2 text-sm text-Cian8 shadow-sm transition hover:bg-Cian8 hover:text-white focus:bg-Cian8 focus:text-white'
              >
                Continue with PayPal
              </button>
              <p className='mt-4 text-center text-xs text-Charcoal/70'>
                You’ll be redirected to PayPal to complete your purchase.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
