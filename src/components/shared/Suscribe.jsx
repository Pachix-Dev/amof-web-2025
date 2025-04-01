import { useState } from 'react'

export function Suscribe({ suscribe_label, button }) {
  const [message, setMessage] = useState('')
  const [sendStatus, setSendStatus] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = Object.fromEntries(new window.FormData(event.target))
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    }

    try {
      setSendStatus(true)
      const statusEmail = await fetch(
        'https://hfmexico.mx/agrotechmexico/backend/suscribe_worldseafood.php',
        requestOptions
      )
      const dataEmail = await statusEmail.json()
      if (dataEmail.status) {
        setSendStatus(false)
        setMessage('¡Gracias por suscribirte!')
      } else {
        setSendStatus(false)
        setMessage('Ya te encuentras suscrito gracias.')
      }
    } catch (error) {
      console.log(error)
      setSendStatus(false)
      setMessage(
        'Lo sentimos en este momento no es posible enviar tu información...'
      )
    } finally {
      setSendStatus(false)
      document.getElementById('form-contact').reset()
    }
  }

  return (
    <section className='' aria-label='Subscribe to the Flowbite newsletter'>
      {/* <p className="mb-5 text-lg lg:text-left text-center font-medium text-white">
            {description}
        </p> */}
      <div className='container mx-auto'>
        <form
          className=' justify-center  w-full grid md:flex gap-2 items-center'
          id='form-contact'
          onSubmit={handleSubmit}
        >
          <label
            htmlFor='member_email'
            className='flex-shrink-0 text-lg text-left font-medium text-white md:mb-0 md:me-4'
          >
            {suscribe_label}
          </label>
          <div className='relative formkit-field mt-2 mb-2'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
              <svg
                className='w-3.5 h-3.5 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 16'
              >
                <path d='m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z'></path>
                <path d='M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z'></path>
              </svg>
            </div>
            <input
              id='member_email'
              className='w-full formkit-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5'
              name='email'
              aria-label='Email Address'
              placeholder='Your email address...'
              required
              type='email'
            />
          </div>
          {sendStatus ? (
            <span className='text-white flex'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  stroke-width='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>{' '}
              Enviando ...
            </span>
          ) : (
            <>
              {message === '' ? (
                <button
                  type='submit'
                  className='text-white bg-[#1F76ED] hover:bg-[#1fb3edc2] focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-6 sm:mt-0 text-center cursor-pointer'
                >
                  {button}
                </button>
              ) : (
                <span className='text-white font-bold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mt-5 sm:mt-0 text-center'>
                  {message}
                </span>
              )}
            </>
          )}
        </form>
      </div>
    </section>
  )
}
