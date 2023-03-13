import { createContext } from 'react'
// import { TopScreenNavigationProps } from '../App'

const mainContext = createContext({
  userProfile: {},
  targetAirConId: '',
})
export default mainContext
