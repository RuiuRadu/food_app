import Modal from './UI/Modal.jsx';
import { currencyFormatter } from '../util/formatting.js';
import { useContext } from 'react';
import CartContext from '../store/CartContext.jsx';
import Input from './UI/Input.jsx';
import UserProgressContext from '../store/UserProgressContext.jsx';
import Button from './UI/Button.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },

};


export default function Checkout() {

    const userProgressCtx = useContext(UserProgressContext);

    const cartCtx = useContext(CartContext);


    const { sendRequest, isLoading: isSending, error, data, clearData } =
    useHttp('/api/orders', requestConfig);
      


    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.price * item.quantity, 0);

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(event){
        event.preventDefault();

        const fd =new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData,
            },
        }));


    }

    let actions = (<>
                    <Button type="button" textOnly onClick={handleClose}>Close</Button>
                    <Button>Submit Order</Button>
    </>);

    if(isSending) {
        actions = <span>Sending order data...</span>;
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order has been sent successfully.</p>
            <p>It will be delivered to you in 30 minutes.</p>
            <p className="modal-actions">
            <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total amount to pay: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full Name" id="name" type="text" />
            <Input label="E-Mail Address" id="email" type="email" />
            <Input label="Street" id="street" type="text" />
            <div className="control-row">
                <Input label="Postal Code" id="postal-code" type="text" />
                <Input label="City" id="city" type="text" />
            </div>

            {error && <Error title="Failed to send order" message={error.message} />}

            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
);

}