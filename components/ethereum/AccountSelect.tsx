import { FormControl } from 'baseui/form-control'
import { Option as SelectOption, Select } from 'baseui/select'
import { ethers } from 'ethers'
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import { useEthers } from '../../libs/ethereum/contexts/useEthers'
import { useAccountsQuery } from '../../libs/ethereum/queries/useAccountsQuery'
import { useErc20BalanceQuery } from '../../libs/ethereum/queries/useErc20BalanceQuery'

interface InjectedAccountSelectProps {
    caption?: ReactNode
    defaultAddress?: string
    error?: boolean // set to undefined to let the component verify against injected accounts
    label?: ReactNode
    onChange: (address?: string) => void
}

export const InjectedAccountSelect = ({
    caption: customCaption,
    error: customError,
    label,
    onChange,
}: InjectedAccountSelectProps): ReactElement => {
    const { readystate } = useEthers()

    const { data: accounts } = useAccountsQuery()
    const options = useMemo(
        () =>
            accounts?.map<SelectOption>((address) => ({
                id: address,
                label: address,
            })) ?? [],
        [accounts]
    )

    const [selectValue, setSelectValue] = useState<readonly SelectOption[]>([])

    const { caption, error } = useMemo(() => {
        const hasSelected = selectValue.length !== 0
        return {
            caption:
                typeof customCaption !== 'undefined'
                    ? customCaption // use if custom caption is provided
                    : !hasSelected // or prompt for required input
                    ? '选择一个账户'
                    : undefined,
            error: typeof customError === 'boolean' ? customError : !hasSelected,
        }
    }, [selectValue, customCaption, customError])

    useEffect(() => onChange(selectValue[0]?.id?.toString()), [onChange, selectValue])

    return (
        <FormControl caption={caption} label={label}>
            <Select
                error={error}
                isLoading={readystate !== 'connected'}
                onChange={({ value }) => setSelectValue(value)}
                options={options}
                value={selectValue}
            />
        </FormControl>
    )
}

export const InjectedAccountSelectWithBalanceCaption = (props: InjectedAccountSelectProps): JSX.Element => {
    const { caption: customCaption, onChange: parentOnChange } = props

    const [account, setAccount] = useState<string>()
    const { data: balance } = useErc20BalanceQuery(account)
    const balanceString = useMemo(() => {
        return balance !== undefined
            ? `${ethers.utils.formatUnits(balance as ethers.BigNumberish, 18)} PHA`
            : account !== undefined
            ? 'Loading'
            : undefined
    }, [account, balance])

    const onChange = (account?: string) => {
        setAccount(account)
        parentOnChange(account)
    }

    return <InjectedAccountSelect {...props} caption={customCaption ?? balanceString} onChange={onChange} />
}
