import './App.css'
import React, { useState } from 'react'
import AgoraRTC from './vendor/AgoraRTC'
import { Col, message, Row } from 'antd'
import BaseSettings, { IState as BaseOption } from './components/BaseSettings'
import AdvancedSettings, {
  useAdvancedSettingsReducer,
} from './components/AdvancedSettings'
import Incompatible from './components/Incompatible'
import RemoteVideoPlayer from './components/RemoteVideoPlayer'
import LocalVideoPlayer from './components/LocalVideoPlayer'

const App = AgoraRTC.checkSystemRequirements() ? Main : Incompatible

export default App

let client: AgoraRTC.Client | null = null
let localStream: AgoraRTC.Stream | null = null
let remoteStreams: AgoraRTC.Stream[] = []
let uid: string | null = null
let isJoined = false
let isPublished = false

function Main() {
  const [
    advancedOption,
    advancedSettingsDispatch,
  ] = useAdvancedSettingsReducer()

  const [remotePlayId, setRemotePlayId] = useState<number | null>(null)

  async function join(baseOption: BaseOption) {
    if (isJoined) {
      message.error('You have already joined')
      return
    }
    client = AgoraRTC.createClient({
      mode: advancedOption.mode,
      codec: advancedOption.codec,
    })
    handleEvents()
    try {
      const clientInit = () =>
        new Promise((resolve, reject) => {
          client?.init(baseOption.appID, resolve, reject)
        })
      await clientInit()
    } catch (error) {
      message.error(
        'Client init failed, please open console to see more details'
      )
      return
    }
    try {
      const clinetJoin = () =>
        new Promise((resolve, reject) => {
          const token = baseOption.token ? baseOption.token : null
          const channel = baseOption.channel
          const uid = advancedOption.uid ? String(advancedOption.uid) : null
          client?.join(token, channel, uid, resolve, reject)
        })
      uid = (await clinetJoin()) as string
      isJoined = true
      message.success(
        `Join channel: ${baseOption.channel} success, uid: ${uid}`
      )
    } catch (error) {
      message.error(
        'Stream init failed, please open console to see more details'
      )
      return
    }

    try {
      localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false,
        microphoneId: advancedOption.microphoneId,
        cameraId: advancedOption.cameraId,
      })
      const localStreamInit = () =>
        new Promise((resolve, reject) => {
          localStream?.init(resolve, reject)
        })
      await localStreamInit()
      localStream.play('local_stream')
      publish()
    } catch (error) {
      message.error(
        'Stream init failed, please open console to see more details'
      )
    }
  }

  async function publish() {
    if (!client) {
      message.error('Please Join Room First')
      return
    }
    if (isPublished) {
      message.error('You have already published')
      return
    }
    client.publish(localStream as AgoraRTC.Stream, () => {
      isPublished = false
      message.error('Publish failed')
    })
    message.info('Publish')
    isPublished = true
  }

  async function leave() {
    if (!client) {
      message.error('Please Join First!')
      return
    }
    if (!isJoined) {
      message.error('You are not in channel')
      return
    }
    try {
      const clientLeave = () =>
        new Promise((resolve, reject) => {
          client?.leave(resolve, reject)
        })
      await clientLeave()
      if (localStream?.isPlaying()) {
        localStream?.stop()
      }
      localStream?.close()
      for (let i = 0; i < remoteStreams.length; i++) {
        const stream = remoteStreams.shift()
        if (stream?.isPlaying()) {
          stream?.stop()
        }
      }
      localStream = null
      remoteStreams = []
      client = null
      isJoined = false
      isPublished = false
      setRemotePlayId(null)
      message.success('Leave success')
    } catch (error) {
      message.error('Leave failed')
    }
  }

  async function unpublish() {
    if (!client) {
      message.error('Please Join Room First')
      return
    }
    if (!isPublished) {
      message.error("You didn't publish")
      return
    }
    client?.unpublish(localStream as AgoraRTC.Stream, () => {
      isPublished = true
      message.error('Unpublish failed')
    })
    isPublished = false
    message.info('Unpublish')
  }

  function handleEvents() {
    if (!client) {
      message.error('Please Join Room First')
      return
    }
    client.on('error', error => {
      message.error(error)
    })
    client.on('peer-leave', evt => {
      const id = evt.uid
      const peerStream = remoteStreams.find(e => id === e.getId())
      if (peerStream && peerStream.isPlaying()) {
        peerStream.stop()
      }
      remoteStreams = remoteStreams.filter(e => id !== e.getId())
      if (id !== uid) {
        setRemotePlayId(null)
      }
      message.info('Peer leave')
    })
    client.on('stream-published', () => {
      message.success('Stream published success')
    })
    client.on('stream-added', evt => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      message.info('Stream-added uid: ' + id)
      if (id !== uid) {
        client?.subscribe(remoteStream)
      }
    })
    client.on('stream-subscribed', evt => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      remoteStreams.push(remoteStream)
      setRemotePlayId(id)
      remoteStream.play('remote_video_' + id)
      message.info('Stream-subscribed remote-uid: ' + id)
    })
    client.on('stream-removed', evt => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      message.info('Stream-removed uid: ' + id)
      if (remoteStream.isPlaying()) {
        remoteStream.stop()
      }
      remoteStreams = remoteStreams.filter(stream => stream.getId() !== id)
      setRemotePlayId(null)
    })
    client.on('onTokenPrivilegeWillExpire', () => {
      message.info('onTokenPrivilegeWillExpire')
    })
    client.on('onTokenPrivilegeDidExpire', () => {
      message.info('onTokenPrivilegeDidExpire')
    })
  }
  return (
    <Row className="app" gutter={40}>
      <Col span={12}>
        <BaseSettings
          onJoin={join}
          onLeave={leave}
          onPublish={publish}
          onUnpublish={unpublish}
        />
        <AdvancedSettings
          state={advancedOption}
          dispatch={advancedSettingsDispatch}
        />
      </Col>
      <Col span={12}>
        <LocalVideoPlayer />
        <RemoteVideoPlayer playId={remotePlayId} />
      </Col>
    </Row>
  )
}
