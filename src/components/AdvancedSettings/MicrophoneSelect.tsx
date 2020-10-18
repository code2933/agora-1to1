import { Select } from 'antd'
import React from 'react'

interface IProps {
  value: string
  onChange: (value: string) => void
  options: MediaDeviceInfo[]
}

const AUDIO_NAME_PREFIX = 'microphone-'

export default function MicrophoneSelect({
  value,
  onChange,
  options = [],
}: IProps) {
  return (
    <Select value={value} onChange={onChange}>
      {options.map((option, index) => (
        <Select.Option value={option.deviceId} key={option.deviceId}>
          {option.label || `${AUDIO_NAME_PREFIX}${index}`}
        </Select.Option>
      ))}
    </Select>
  )
}
