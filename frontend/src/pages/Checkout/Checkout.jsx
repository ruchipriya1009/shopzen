import Navbar from '../../components/home/Navbar'
import styles from './Checkout.module.css'
import { getCartProducts } from '../../redux/CartReducer/Action'
import { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useCallback } from 'react'
import useRazorpay from 'react-razorpay'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const [prod, setProd] = useState([])
  const { products, isLoading, isError } = useSelector((store) => {
    return {
      products: store.CartReducer.products,
      isLoading: store.CartReducer.isLoading,
      isError: store.CartReducer.isError,
    }
  }, shallowEqual)
  console.log(products)
  let dispatch = useDispatch()
  const Razorpay = useRazorpay()
  const navigate = useNavigate()

  const handlePayment = useCallback(
    async (prod) => {
      const options = {
        key: 'rzp_test_Q6qLBPFz8pzc23',
        amount: 1000 * 100,
        currency: 'INR',
        name: 'Shopzen Corp',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        handler: async (response) => {
          let postOrder = async () => {
            try {
              console.log('inside post', prod)
              let res = await fetch(
                'https://dark-erin-fox-cuff.cyclic.app/order/add',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('user_token'),
                  },
                  body: JSON.stringify({
                    products: prod,
                    userId: '123456',
                    createdAt: '2023-04-02T09:00:00.000Z',
                    totalAmount: 43434,
                    address: {
                      fullname: 'check now',
                      mobile: '32323232',
                      email: 'something',
                      address: '123 Main St',
                      pincode: 12345,
                      city: 'dfd',
                      state: 'CAdf',
                      country: 'USA',
                    },
                  }),
                }
              )
              console.log(res.status)
            } catch (error) {
              console.log('error', error)
            }
          }
          postOrder()
        },
        prefill: {
          name: 'Piyush Garg',
          email: 'youremail@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      }

      const rzpay = new Razorpay(options)
      rzpay.open()
    },
    [Razorpay]
  )

  useEffect(() => {
    setProd(products)
    dispatch(getCartProducts())
  }, [])

  const itemLength = products.length

  let totalprice = products.reduce((acc, el) => {
    return acc + Number(el.price * el.quantity)
  }, 0)

  let discountedprice = products.reduce((acc, el) => {
    return acc + Number(el.discountedPrice * el.quantity)
  }, 0)

  const address = JSON.parse(localStorage.getItem('address'))
  console.log(address)

  return (
    <>
      <Navbar />
      <img
        src='https://images.dailyobjects.com/marche/assets/images/other/20-off-new-homepage-desktop.gif?tr=cm-pad_resize,v-2,dpr-1'
        alt=''
      />
      <div>
        <p className={styles.checkout_heading}>CHECKOUT</p>
      </div>

      <div className={styles.checkout_main_div}>
        <div className={styles.checkout_subdiv1}>
          <p className={styles.orderSummary}>Address</p>

          <div style={{ marginTop: '50px' }}>
            <p>{address.name}</p>
            <p>
              {address.area} {address.building}
            </p>
            <p>
              {address.city} {address.counter}
            </p>
            <p>
              {address.city} {address.building}
            </p>
            <p>{address.pincode} </p>
          </div>

          <Link to='/cart'>
            <p className={styles.gobackHeading}>Go Back</p>
          </Link>
        </div>
        <div className={styles.checkout_subdiv2}>
          <p className={styles.orderSummary}>ORDER SUMMARY</p>

          <div className={styles.TotalItemDiv}>
            <p>Item Total ({itemLength} Items)</p>
            <p>Rs. {totalprice}</p>
          </div>

          <div className={styles.TotalDiscountDiv}>
            <p>Discount</p>
            <p>Rs. {discountedprice}</p>
          </div>

          <div className={styles.shippingDiv}>
            <p>Shipping</p>
            <p>FREE</p>
          </div>

          <div className={styles.grandTotal}>
            <p>Grand Total</p>
            <p>Rs.{totalprice}</p>
          </div>

          <div className={styles.savedDiv}>
            <p>(Inclusive of Taxes)</p>
            <p>You Saved 20%</p>
          </div>

          <div className={styles.checkoutButtonDiv}>
            <Button
              colorScheme='green'
              borderRadius={0}
              width='100%'
              onClick={() => {
                console.log('before', products)
                handlePayment(products)
              }}
            >
              PAY NOW
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
