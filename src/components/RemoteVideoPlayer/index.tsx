import { Card } from 'antd'
import React from 'react'
import './index.css'

interface IProps {
  playId: number | null
}
export default function ({ playId }: IProps) {
  return (
    <Card className="remote-video-player">
      <div id={`remote_video_${playId}`} className="video-placeholder"></div>
    </Card>
  )
}
