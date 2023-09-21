import { auth, provider } from '$lib/firebase'
import {
  getRedirectResult as FBgetRedirectResult,
  signInWithRedirect,
  type User,
} from 'firebase/auth'
import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

type UserStore = Writable<User | null>

export function setAuth() {
  const userStore: UserStore = writable(null)
  auth.onAuthStateChanged((user) => userStore.set(user))
  setContext('auth', userStore)
}

export function getAuth() {
  return {
    user: <UserStore>getContext('auth'),
    getRedirectResult: () => FBgetRedirectResult(auth),
    signInWithGoogle: (targetUrl = '') => {
      if (targetUrl) window.history.replaceState({}, '', targetUrl) // hack to redirect to another page after signin
      signInWithRedirect(auth, provider)
    },
    signOut: () => auth.signOut(),
  }
}
