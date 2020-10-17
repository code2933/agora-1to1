import React from 'react'
import { MODE } from '../../enum'
import { Radio } from 'antd'

const MODE_OPTIONS = [MODE.LIVE, MODE.RTC]

interface IProps {
  value: string
  onChange: (value: string) => void
}

export default function ModeRadio({ value, onChange }: IProps) {
  return (
    <Radio.Group onChange={e => onChange(e.target.value)} value={value}>
      {MODE_OPTIONS.map(option => (
        <Radio value={option} key={option}>
          {option}
        </Radio>
      ))}
    </Radio.Group>
  )
}
