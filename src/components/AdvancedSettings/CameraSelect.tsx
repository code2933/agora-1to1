import { Select } from 'antd'
import React from 'react'

interface IProps {
  value: string
  onChange: (value: string) => void
  options: MediaDeviceInfo[]
}

const VIDEO_NAME_PREFIX = 'camera-'

export default function CameraSelect({
  value,
  onChange,
  options = [],
}: IProps) {
  return (
    <Select value={value} onChange={onChange}>
      {options.map((option, index) => (
        <Select.Option value={option.deviceId} key={option.deviceId}>
          {option.label || `${VIDEO_NAME_PREFIX}${index}`}
        </Select.Option>
      ))}
    </Select>
  )
}
