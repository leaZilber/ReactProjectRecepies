import { createContext, useState, ReactNode } from "react"
import React from "react"
export type User = {
    Password: string,
    UserName: string,
}
export type UserSignUp = {
    user: User,
    Name:string,
    Phone: string,
    Email: string,
    Tz: string,
}
interface FlagContextType {
    flag: boolean
    setFlag: (value: boolean) => void
    AuthorizedUser: boolean
    setAuthorizedUser: (value: boolean) => void
}

export const flagContext = createContext<FlagContextType | null>(null)

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [flag, setFlag] = useState(false)
    const [AuthorizedUser, setAuthorizedUser] = useState(false)

    return (
        <flagContext.Provider value={{ flag, setFlag, AuthorizedUser, setAuthorizedUser }}>
            {children}
        </flagContext.Provider>
    )
}