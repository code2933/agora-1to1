import React, { useEffect, useState } from 'react'
import AgoraRTC from './vendor/AgoraRTC'
import './App.css'
import ControlForm from './components/ControlForm'
import AdvancedSettings, {
  useAdvancedSettingsReducer,
} from './components/AdvancedSettings'
import Incompatible from './components/Incompatible'

const App = AgoraRTC.checkSystemRequirements() ? Main : Incompatible

function Main() {
  const [
    advancedSettingsState,
    advancedSettingsDispatch,
  ] = useAdvancedSettingsReducer()

  const onJoin = () => {}
  const onLeave = () => {}
  const onPublish = () => {}
  const onUnpublish = () => {}
  return (
    <div className="app">
      <ControlForm
        onJoin={onJoin}
        onLeave={onLeave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
      />
      <AdvancedSettings
        state={advancedSettingsState}
        dispatch={advancedSettingsDispatch}
      />
    </div>
  )
}

export default App
