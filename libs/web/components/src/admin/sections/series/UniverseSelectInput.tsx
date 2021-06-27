import {forwardRef} from 'react'

import {Schema} from '@storyverse/graphql'

import SelectInput, {SelectInputProps} from '../../forms/SelectInput'

export type UniverseSelectInputProps = Omit<SelectInputProps, 'options'>

export const UniverseSelectInput = forwardRef<
  HTMLSelectElement,
  UniverseSelectInputProps
>((props: UniverseSelectInputProps, ref) => {
  const [{data: universeData}] = Schema.useGetManyUniversesQuery()
  const universes = universeData?.getManyUniverses.data || []

  const options = [
    {value: '', label: '(select one)'},
    ...universes.map((universe) => ({
      value: universe.id,
      label: universe.name,
    })),
  ]

  return <SelectInput {...props} ref={ref} options={options} />
})

export default UniverseSelectInput
