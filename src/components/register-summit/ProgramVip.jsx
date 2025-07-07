import { useState } from 'react'
import { useRegisterForm } from '../../store/register-form'
import { Checkout } from './Checkout'

export function ProgramVip({ currentLanguage }) {
  const {
    addTocart,
    item,
    setCode_cortesia,
    code_cortesia,
    email,
    setCompleteRegister,
    setInvoiceDownToLoad,
    clear,
  } = useRegisterForm()

  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  const products = [
    {
      id: 1,
      name: 'Programa de Conferencias CCE - CONCAMIN - ITM - AMOF',
      price: 5800,
      included: [
        'Acceso 2 días al programa de Conferencias CCE - CONCAMIN - ITM - AMOF',
        'Coffee Break',
        'Entrada al piso de exposición',
      ],
    },
  ]

  const active = (id) => {
    return item.id === id ? 'border-2 border-[#475CA0]' : ''
  }

  const urlbase = 'https://industrialtransformation.mx/server/'
  //const urlbase = 'http://localhost:3010/'

  async function CheckCode() {
    setProcessing(true)
    const response = await fetch(urlbase + 'check-cortesia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code_cortesia,
        item,
        email,
      }),
    })
    const orderData = await response.json()
    if (orderData.status) {
      console.log(orderData)
      clear()
      setCompleteRegister(true)
      setInvoiceDownToLoad(orderData?.invoice)
      window.location.href = '/gracias-por-tu-compra'
    } else {
      setProcessing(false)
      setMessage(orderData?.message)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  return (
    <>
      <div className='grid place-content-center justify-center h-[650px] rounded-lg overflow-y-scroll w-full bg-white p-4'>
        <div className='mt-5 grid justify-center gap-6 w-full'>
          {products.map((product) => (
            <div
              key={product.id}
              className={`w-full max-w-sm h-fit  p-4 bg-white  rounded-lg shadow-xl  ${active(
                product.id
              )}`}
            >
              <div className='flex justify-between'>
                <h5 className='mb-4 text-xl font-medium text-black '>
                  {product.name}
                </h5>
                {product.id === item.id ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='#475CA0'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                ) : (
                  <svg
                    height='24'
                    width='24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle
                      r='10'
                      cx='12'
                      cy='12'
                      stroke='#475CA0'
                      strokeWidth='1'
                      opacity='0.5'
                    />
                  </svg>
                )}
              </div>
              <div className='flex items-baseline text-black '>
                <span className='text-3xl font-semibold'>$</span>
                <span className='text-4xl font-extrabold tracking-tight'>
                  5,000 + IVA
                </span>
                <span className='font-bold'>MXN</span>
              </div>
              <ul role='list' className='space-y-5 my-7'>
                {product.included.map((list, index) => (
                  <li key={index} className='flex items-center'>
                    <svg
                      className='flex-shrink-0 w-4 h-4 text-blue-600 '
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                    </svg>
                    <span className='text-base font-normal leading-tight text-gray-500  ms-3'>
                      {list}
                    </span>
                  </li>
                ))}
                <li className='flex items-center'>
                  <svg
                    className='flex-shrink-0 w-4 h-4 text-blue-600 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
                  </svg>
                  <span className='text-base font-normal leading-tight text-gray-500  ms-3'>
                    Pase doble a noche de industriales, previo registro con:{' '}
                    <a
                      href='mailto:gabriela.aguirre@igeco.mx'
                      target='_blank'
                      className='font-bold text-blue-600'
                    >
                      gabriela.aguirre@igeco.mx
                    </a>
                  </span>
                </li>
              </ul>
              <p className='text-black font-bold'>Ingresa codigo de cortesia</p>
              <div className='flex gap-10'>
                <input
                  type='text'
                  className='border rounded-md p-2 text-black'
                  onChange={(e) => setCode_cortesia(e.target.value)}
                />
                <button
                  className='text-white border border-white bg-gray-950 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center'
                  onClick={() => CheckCode()}
                >
                  Aplicar
                </button>
              </div>
              {message && (
                <p className='mt-5 text-red-600 font-bold text-center'>
                  {message}
                </p>
              )}
              {Object.keys(item).length === 0 && (
                <button
                  type='button'
                  className='mt-5 text-white border border-white bg-gray-950 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center'
                  onClick={() => addTocart(product)}
                >
                  Comprar
                </button>
              )}
            </div>
          ))}
          {Object.keys(item).length > 0 && (
            <Checkout currentLanguage={currentLanguage} />
          )}
        </div>
      </div>

      {processing && (
        <div className='fixed top-0 left-0 bg-gray-400 bg-opacity-85 z-[999] w-full h-screen'>
          <div role='status' className='grid place-items-center w-full h-full'>
            <p className='text-center flex gap-2'>
              <svg
                aria-hidden='true'
                className='w-8 h-8 text-gray-200 animate-spin fill-blue-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='font-bold text-white text-2xl'>
                Estamos procesando la información por favor espere...
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
