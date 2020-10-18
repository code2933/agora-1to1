import React from 'react'
import { CODEC } from '../../enum'
import { Radio } from 'antd'

const CODEC_OPTIONS = [CODEC.H264, CODEC.VP8]

interface IProps {
  value: string
  onChange: (value: string) => void
}

export default function CodecRadio({ value, onChange }: IProps) {
  return (
    <Radio.Group onChange={e => onChange(e.target.value)} value={value}>
      {CODEC_OPTIONS.map(option => (
        <Radio value={option} key={option}>
          {option}
        </Radio>
      ))}
    </Radio.Group>
  )
}
