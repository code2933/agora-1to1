import * as R from 'ramda'
import AgoraRTC from '../vendor/AgoraRTC'

const AUDIO_KEY = 'audios'
const VIDEO_KEY = 'videos'
const IS_AUDIO = R.propEq('kind', 'audioinput')
const IS_VIDEO = R.propEq('kind', 'videoinput')

const groupByDevices = R.groupBy<MediaDeviceInfo>(
  R.cond<MediaDeviceInfo, string>([
    [IS_AUDIO, R.always('audios')],
    [IS_VIDEO, R.always('videos')],
    [R.T, R.always('others')],
  ])
)

export default function getDevices() {
  return new Promise((resolve, reject) => {
    AgoraRTC.getDevices(resolve, error => {
      reject(`Failed to getDevice: ${error}`)
    })
  }).then(
    R.pipe(R.tap(console.log), groupByDevices, R.pick([AUDIO_KEY, VIDEO_KEY]))
  )
}

export interface IDevicesMap {
  [AUDIO_KEY]: MediaDeviceInfo[]
  [VIDEO_KEY]: MediaDeviceInfo[]
}
