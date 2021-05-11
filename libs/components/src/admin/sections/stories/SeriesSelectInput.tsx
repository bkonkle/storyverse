import {forwardRef} from 'react'

import {Schema} from '@storyverse/graphql'

import SelectInput, {SelectInputProps} from '../../forms/SelectInput'

export type SeriesSelectInputProps = Omit<SelectInputProps, 'options'>

export const SeriesSelectInput = forwardRef<
  HTMLSelectElement,
  SeriesSelectInputProps
>((props: SeriesSelectInputProps, ref) => {
  const [{data: seriesData}] = Schema.useGetMySeriesQuery()
  const series = seriesData?.getMySeries.data || []

  const options = [
    {value: '', label: '(select one)'},
    ...series.map((s) => ({
      value: s.id,
      label: s.name,
    })),
  ]

  return <SelectInput {...props} ref={ref} options={options} />
})

export default SeriesSelectInput
