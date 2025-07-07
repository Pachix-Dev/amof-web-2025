import { useRegisterForm } from '../../store/register-form'

export function DonwloadAccess({ text }) {
  const { invoiceDownToLoad } = useRegisterForm()
  return (
    <>
      {<a
        href={`/invoices/${invoiceDownToLoad}`}
        target='_blank'
        className='mt-10 text-white px-4 py-2 rounded-md font-bold bg-blue-500 hover:bg-blue-800 transition duration-300 ease-in-out'
      >
        {text}
      </a>}<br></br>
    </>
  )
}
