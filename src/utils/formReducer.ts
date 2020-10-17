import * as R from 'ramda'

export interface IFormItem {
  label: string
  name: string
}

export interface IAction {
  type: string
  value: any
}

// build condition list instead of switch
export const getFormReducer = <S>(formItems: IFormItem[]) => (
  state: S,
  action: IAction
) => {
  const cond = R.map<IFormItem, any>(item => [
    R.propEq('type', item.name),
    (act: IAction) => R.assoc(item.name, act.value, state),
  ])(formItems)
  return R.cond<IAction, S>([...cond, [R.T, R.always(state)]])(action)
}
