import { Form, Input, Card, Button, Space, message } from 'antd'
import React, { useReducer } from 'react'
import './index.css'
import { getFormReducer, IFormItem } from '../../utils/formReducer'
import * as R from 'ramda'

interface IProps {}

const initialState = {
  appID: '',
  channel: '',
  token: '',
}

export type IState = typeof initialState

const FORM_ITEMS: IFormItem[] = [
  {
    label: 'APP ID',
    name: 'appID',
  },
  {
    label: 'CHANNEL',
    name: 'channel',
  },
  {
    label: 'TOKEN',
    name: 'token',
  },
]

const reducer = getFormReducer<IState>(FORM_ITEMS)

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

interface IProps {
  onJoin: (state: IState) => void
  onLeave: (state: IState) => void
  onPublish: (state: IState) => void
  onUnpublish: (state: IState) => void
}

const getLabel = (name: string) =>
  R.pipe(R.find(R.propEq('name', name)), R.propOr(name, 'label'))

const withValidate = (state: { [name: string]: any }) => (action: Function) => {
  for (const name in state) {
    if (state[name]) {
      continue
    }
    const label = getLabel(name)(FORM_ITEMS)
    message.warning(`Please Enter ${label}`)
    return (() => {}) as any
  }
  return () => action(state)
}

export default function BaseSettings({
  onJoin,
  onLeave,
  onPublish,
  onUnpublish,
}: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const withValidateState = withValidate(state)
  return (
    <Card className="base-settings" bordered={false}>
      <Form {...formLayout}>
        {FORM_ITEMS.map(item => (
          <Form.Item label={item.label} required key={item.name}>
            <Input
              value={state[item.name as keyof IState]}
              onChange={e =>
                dispatch({ type: item.name, value: e.target.value })
              }
            />
          </Form.Item>
        ))}
      </Form>
      <Space size="middle" className="buttons">
        <Button type="primary" onClick={() => withValidateState(onJoin)(state)}>
          JOIN
        </Button>
        <Button
          type="primary"
          onClick={() => withValidateState(onLeave)(state)}
        >
          LEAVE
        </Button>
        <Button
          type="primary"
          onClick={() => withValidateState(onPublish)(state)}
        >
          PUBLISH
        </Button>
        <Button
          type="primary"
          onClick={() => withValidateState(onUnpublish)(state)}
        >
          UNPUBLISH
        </Button>
      </Space>
    </Card>
  )
}
