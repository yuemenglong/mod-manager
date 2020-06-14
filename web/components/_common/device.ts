import {useMediaQuery} from 'react-responsive'

type size = 'xs' | 'sm' | 'md' | "lg" | 'xl' | 'xxl';
const xs = ({query: '(max-width: 575px)'});
const md = ({query: '(min-width: 576px) and (max-width:767px)'});
const lg = ({query: '(min-width: 768px) and (max-width:991px)'});
const xl = ({query: '(min-width: 992px) and (max-width:1199px)'});
const xll = ({query: '(max-width: 1200px)'});
const xxl = ({query: '(min-width: 1200px)'});
const use: (args: { query: string }) => boolean = useMediaQuery;
const get = (width:{min?:number,max?:number}) =>{
  if(!!width.max){
    return {query: `(max-width: ${width.max}px)`};
  }
  if(!!width.min){
    return {query: `(min-width: ${width.min}px)`};
  }
  if(!!width.min && !!width.max){
    return {query: `(min-width: ${width.min}px) and (max-width: ${width.max}px)`};
  }
}
const device = {xs,xll, md, lg, xl, xxl,get, use};
export default device;