import { useSelector, useDispatch } from 'react-redux'

import type { RootState } from './lib/types/store'
import { decrement, increment } from './features/counter/counterSlice'


function App() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <>
      <div>
        <button
          className='btn btn-primary' 
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          className='btn btn-secondary'
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
      <h1 className="text-3xl font-bold underline">    Hello world!  </h1>
    </>
  )
}

export default App
