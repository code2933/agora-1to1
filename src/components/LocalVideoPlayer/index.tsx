import { Card } from 'antd'
import './index.css'
import React from 'react'

export default function () {
  return (
    <Card className="local-video-player">
      <div id="local_stream" className="video-placeholder"></div>
    </Card>
  )
}
