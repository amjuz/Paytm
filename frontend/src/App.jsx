import { Signin } from './Pages/Signin'
import { Signup } from './Pages/Signup'
import { Dashboard } from './Pages/Dashboard'
import { SendMoney } from './Pages/SendMoney'
import {
  Routes,
  Route
} from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/signin' element={<Signin/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/Dashboard' element={<Dashboard/>} ></Route>
        <Route path='/Send' element={<SendMoney/>} ></Route>
      </Routes>
    </>
  )
}

export default App
 