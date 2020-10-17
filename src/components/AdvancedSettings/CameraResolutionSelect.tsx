import { Select } from 'antd'
import React from 'react'
import { RESOLUTIONS } from '../../enum'

const RESOLUTIONS_OPTIONS = [
  RESOLUTIONS.DEFAULT,
  RESOLUTIONS['480P'],
  RESOLUTIONS['720P'],
  RESOLUTIONS['1080P'],
]

interface IProps {
  value: string
  onChange: (value: string) => void
}

export default function CameraResolutionSelect({ value, onChange }: IProps) {
  return (
    <Select value={value} onChange={onChange}>
      {RESOLUTIONS_OPTIONS.map(option => (
        <Select.Option value={option} key={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  )
}
