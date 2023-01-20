import './login.css'
import { useState } from "react"
import { getCheckout } from '../../services/firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Login = () => {    

    const [isLoading, setIsLoading] = useState(false)
    const [objOrder, setObjOrder] = useState()


    const navigate = useNavigate()

    
    const [form, setForm] = useState()

    const handleInputChange = (event) => {
        setForm({
            ...form,
            [event.target.name] : event.target.value
        })
    }

    const createOrder = async () => {
        setIsLoading(true)
        try {
            const objOrder = {
                buyer: {
                    firstName: form.firstName,
                    password: form.password,
                },
                date: new Date()
            }

        getCheckout(objOrder).then((res) => {

            setObjOrder(res)
            setIsLoading(false)

        }).catch(error => {
            console.log(error)
        })}catch(error) {
            console.log(error)
        }
    }

    if (objOrder) {
        setTimeout(() => {
            navigate('/')
        }, 3000)
        return (<div>
            <h1>{`Tu orden se genero con el siguiente id: ${objOrder.id},Gracias por tu compra`}</h1>         
        </div>)}      

    if(isLoading) {
        return <h1>Se esta generando tu orden...</h1>
    }

    return (
        <>  
        {
                <div className="container col-xxl-10 col-xxl-8 px-4 py-5 galeria2 carrusel">
                    <div className="row align-items-center g-lg-5 py-5">
                        <div className="col-lg-7 text-center text-lg-start">
                            <h1 className="display-4 fw-bold lh-1 mb-3 foto2">Regístrate en nuestra plataforma</h1>
                            <p className="col-lg-10 fs-4 foto2">Por favor rellena los siguientes campos para finalizar su compra. </p>
                        </div>
                    <div className="col-md-10 mx-auto col-lg-5 form2 foto6">
                        <form className="p-4 p-md-5 rounded-3">
                            <div className="form-floating mb-3">
                                <input type="text" name="firstName" onChange={handleInputChange} placeholder="Ingresar nombre"></input>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" name="password" onChange={handleInputChange} placeholder="Ingresar contraseña"></input>
                            </div>
                        </form>
                    </div>
                    <button style= {{margin:'20px 30px 20px 260px'}}className="form3" onClick={createOrder}>Generar Orden</button>
                    </div>
                </div>
                }
        </>
    )
}

export default Login