import { createContext } from 'react'
import { TopScreenNavigationProps } from '../App'

const mainContext = createContext({
  userProfile: {},
  signOutUser: ({ navigation }: { navigation: TopScreenNavigationProps }) => {},
  handleSignInWithGoogle: ({
    navigation,
  }: {
    navigation: TopScreenNavigationProps
  }) => {},
})
export default mainContext
