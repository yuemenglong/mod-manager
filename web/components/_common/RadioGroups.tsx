import {observer} from "mobx-react";
import * as _ from "lodash";
import {$$} from "../../framework/site";
import {useEffect} from "react";


/*l
*list 默认[{name:'',value:''}]
* */
interface Props {
  list: [],//radio循环的数据
  onChange?: (string) => any,//input的onChange事件
  disabled?: boolean,//是否不可编辑
  clear?: boolean//清空input选项
}

const RadioGroups = observer((props: Props) => {
  let {list, disabled, clear} = props;
  let changeName = "r" + Math.random();
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
      <input type={'radio'} name={changeName} value={inputValue} disabled={disabled} onChange={onChange}/>
      <span>{_.get(item, 'name', '')}</span>
    </div>
  })}</div>
});

export default RadioGroups;