import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import firebase from '../lib/firebase'

export type MainState = {
  email: string
  password: string
  userAccount: firebase.User | null
  targetAirConId: string
}

const initialMainState: MainState = {
  email: '',
  password: '',
  userAccount: null,
  targetAirConId: '',
}

const MainContext = createContext(initialMainState)
const SetMainContext = createContext<Dispatch<SetStateAction<MainState>>>(
  () => {}
)

export function useMainContext() {
  return useContext(MainContext)
}

export function useSetMainContext() {
  return useContext(SetMainContext)
}

export function ContextProvider(props: {
  initialState?: MainState
  children: React.ReactNode
}) {
  const [state, setState] = useState(props.initialState ?? initialMainState)

  return (
    <MainContext.Provider value={state}>
      <SetMainContext.Provider value={setState}>
        {props.children}
      </SetMainContext.Provider>
    </MainContext.Provider>
  )
}
