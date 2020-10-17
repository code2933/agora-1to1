import React, { useReducer, useState, useEffect } from 'react'
import * as R from 'ramda'
import './index.css'
import { Form, Collapse, InputNumber, message } from 'antd'
import { getFormReducer, IFormItem, IAction } from '../../utils/formReducer'
import CameraSelect from './CameraSelect'
import MicrophoneSelect from './MicrophoneSelect'
import CameraResolutionSelect from './CameraResolutionSelect'
import { MODE, CODEC, RESOLUTIONS } from '../../enum'
import ModeRadio from './ModeRadio'
import CodecRadio from './CodecRadio'
import getDevices, { IDevicesMap } from '../../utils/getDevices'

interface IProps {
  state: IState
  dispatch: React.Dispatch<IAction>
}

interface IState {
  uid: number | undefined
  cameraId: string
  microphoneId: string
  cameraResolution: RESOLUTIONS
  mode: MODE
  codec: CODEC
}

const initialState: IState = {
  uid: undefined,
  cameraId: '',
  microphoneId: '',
  cameraResolution: RESOLUTIONS.DEFAULT,
  mode: MODE.LIVE,
  codec: CODEC.H264,
}

const FORM_ITEMS: IFormItem[] = [
  {
    label: 'UID',
    name: 'uid',
  },
  {
    label: 'CAMERA',
    name: 'cameraId',
  },
  {
    label: 'MICROPHONE',
    name: 'microphoneId',
  },
  {
    label: 'CAMERA RESOLUTION',
    name: 'cameraResolution',
  },
  {
    label: 'MODE',
    name: 'mode',
  },
  {
    label: 'CODEC',
    name: 'codec',
  },
]

const reducer = getFormReducer<IState>(FORM_ITEMS)

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

export function useAdvancedSettingsReducer() {
  return useReducer(reducer, initialState)
}

export default function AdvancedSettings({ state, dispatch }: IProps) {
  const [devices, setDevices] = useState<IDevicesMap>({
    audios: [],
    videos: [],
  })
  useEffect(() => {
    getDevices()
      .then(devices => {
        setDevices(devices as IDevicesMap)
        dispatch({
          type: 'cameraId',
          value: R.pathOr('', ['videos', '0', 'deviceId'], devices),
        })
        dispatch({
          type: 'microphoneId',
          value: R.pathOr('', ['audios', '0', 'deviceId'], devices),
        })
      })
      .catch(message.error)
  }, [])
  return (
    <Collapse className="advanced-settings" bordered={false}>
      <Collapse.Panel key="1" header="ADVANCED SETTINGS">
        <Form {...formLayout}>
          <Form.Item label="UID">
            <InputNumber
              value={state.uid}
              onChange={value => dispatch({ type: 'uid', value })}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="CAMERA">
            <CameraSelect
              value={state.cameraId}
              onChange={value => dispatch({ type: 'cameraId', value })}
              options={devices.videos}
            />
          </Form.Item>
          <Form.Item label="MICROPHONE">
            <MicrophoneSelect
              value={state.microphoneId}
              onChange={value => dispatch({ type: 'microphoneId', value })}
              options={devices.audios}
            />
          </Form.Item>
          <Form.Item label="CAMERA RESOLUTION">
            <CameraResolutionSelect
              value={state.cameraResolution}
              onChange={value => dispatch({ type: 'cameraResolution', value })}
            />
          </Form.Item>
          <Form.Item label="MODE">
            <ModeRadio
              value={state.mode}
              onChange={value => dispatch({ type: 'mode', value })}
            />
          </Form.Item>
          <Form.Item label="CODEC">
            <CodecRadio
              value={state.codec}
              onChange={value => dispatch({ type: 'codec', value })}
            />
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  )
}
