import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

const IndexPage = (): JSX.Element => {
    const { pathname, push } = useRouter()

    useEffect(() => {
        if (pathname === '/') {
            push('/to-substrate').catch(() => {})
        }
    })

    return <></>
}

export default IndexPage
