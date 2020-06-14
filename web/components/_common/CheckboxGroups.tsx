import {observer} from "mobx-react";
import * as _ from "lodash";
import {useEffect} from "react";
import {$$} from "../../framework/site";


/*
*list 默认[{name:'',value:''}]
* */
interface Props {
  list: any[],
  onChange?: (string) => any,//input的onChange事件
  disabled?: boolean,//是否不可编辑
  clear?: boolean//清空input选项
}


const CheckboxGroups = observer((props: Props) => {
  let {list, clear, disabled} = props;

  let onChange = (e) => {
    props.onChange && props.onChange(e.target.value);
  };

  useEffect(() => {
    let $ = $$();
    if (!!clear) $('input').prop('checked', false);
  });

  return <div>{list.map((item, idx) => {
    let inputValue = _.get(item, 'value', '');
    return <div key={idx}>
      <input type={'checkbox'} value={inputValue} disabled={disabled} onChange={onChange}/>
      <span>{_.get(item, 'name', '')}</span>
    </div>
  })}</div>
});

export default CheckboxGroups;