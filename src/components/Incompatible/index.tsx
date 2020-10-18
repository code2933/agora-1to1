import { Alert } from 'antd'
import React from 'react'
import AgoraRTC from '../../vendor/AgoraRTC'

export default function Uncompatible() {
  return (
    <Alert
      type="error"
      message="Incompatible"
      description={`agora sdk version: ${AgoraRTC.VERSION} is incompatible with your system!`}
    />
  )
}
