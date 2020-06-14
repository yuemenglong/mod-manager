import React, { useState, createContext, useContext } from "react";
import { Form } from "antd";
import * as _ from "lodash"
import { WrappedFormUtils, ValidationRule, GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { IReactComponent } from "mobx-react/dist/types/IReactComponent";

// export declare type WrappedFormUtils<V = any> = {
//   /** 获取一组输入控件的值，如不传入参数，则获取全部组件的值 */
//   getFieldsValue(fieldNames?: Array<string>): {
//       [field: string]: any;
//   };
//   /** 获取一个输入控件的值 */
//   getFieldValue(fieldName: string): any;
//   /** 设置一组输入控件的值 */
//   setFieldsValue(obj: Object, callback?: Function): void;
//   /** 设置一组输入控件的值 */
//   setFields(obj: Object): void;
//   /** 校验并获取一组输入域的值与 Error */
//   validateFields(fieldNames: Array<string>, options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
//   validateFields(options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
//   validateFields(fieldNames: Array<string>, callback: ValidateCallback<V>): void;
//   validateFields(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
//   validateFields(fieldNames: Array<string>): void;
//   validateFields(callback: ValidateCallback<V>): void;
//   validateFields(options: ValidateFieldsOptions): void;
//   validateFields(): void;
//   /** 与 `validateFields` 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围 */
//   validateFieldsAndScroll(fieldNames: Array<string>, options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
//   validateFieldsAndScroll(options: ValidateFieldsOptions, callback: ValidateCallback<V>): void;
//   validateFieldsAndScroll(fieldNames: Array<string>, callback: ValidateCallback<V>): void;
//   validateFieldsAndScroll(fieldNames: Array<string>, options: ValidateFieldsOptions): void;
//   validateFieldsAndScroll(fieldNames: Array<string>): void;
//   validateFieldsAndScroll(callback: ValidateCallback<V>): void;
//   validateFieldsAndScroll(options: ValidateFieldsOptions): void;
//   validateFieldsAndScroll(): void;
//   /** 获取某个输入控件的 Error */
//   getFieldError(name: string): string[] | undefined;
//   getFieldsError(names?: Array<string>): Record<string, string[] | undefined>;
//   /** 判断一个输入控件是否在校验状态 */
//   isFieldValidating(name: string): boolean;
//   isFieldTouched(name: string): boolean;
//   isFieldsTouched(names?: Array<string>): boolean;
//   /** 重置一组输入控件的值与状态，如不传入参数，则重置所有组件 */
//   resetFields(names?: Array<string>): void;
//   getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
// };

// export declare type GetFieldDecoratorOptions = {
//   /** 子节点的值的属性，如 Checkbox 的是 'checked' */
//   valuePropName?: string;
//   /** 子节点的初始值，类型、可选值均由子节点决定 */
//   initialValue?: any;
//   /** 收集子节点的值的时机 */
//   trigger?: string;
//   /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
//   getValueFromEvent?: (...args: any[]) => any;
//   /** Get the component props according to field value. */
//   getValueProps?: (value: any) => any;
//   /** 校验子节点值的时机 */
//   validateTrigger?: string | string[];
//   /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
//   rules?: ValidationRule[];
//   /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
//   exclusive?: boolean;
//   /** Normalize value to form component */
//   normalize?: (value: any, prevValue: any, allValues: any) => any;
//   /** Whether stop validate on first rule of error for this field.  */
//   validateFirst?: boolean;
//   /** 是否一直保留子节点的信息 */
//   preserve?: boolean;
// };

// export declare type ValidationRule = {
//   /** validation error message */
//   message?: React.ReactNode;
//   /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
//   type?: string;
//   /** indicates whether field is required */
//   required?: boolean;
//   /** treat required fields that only contain whitespace as errors */
//   whitespace?: boolean;
//   /** validate the exact length of a field */
//   len?: number;
//   /** validate the min length of a field */
//   min?: number;
//   /** validate the max length of a field */
//   max?: number;
//   /** validate the value from a list of possible values */
//   enum?: string | string[];
//   /** validate from a regular expression */
//   pattern?: RegExp;
//   /** transform a value before validation */
//   transform?: (value: any) => any;
//   /** custom validate function (Note: callback must be called) */
//   validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
// };

export type ValidatorType = (props: VProps) => any

export type FormType = WrappedFormUtils

export interface ValidatorProps {
  V: ValidatorType
  form: FormType
}

interface VProps extends GetFieldDecoratorOptions {
  name: string
  children?: any
};

const VContext = createContext<ValidatorProps>({} as any)

export function withValidator<T extends IReactComponent>(Comp: T, name: string = ""): T {
  let VCreator = (form: WrappedFormUtils) => {
    return (props: VProps) => {
      return <Form.Item>
        {form.getFieldDecorator(props.name, props)(props.children)}
      </Form.Item>
    }
  }
  let F = Form.create({ name })((props: any) => {
    let [V,] = useState(() => VCreator(props.form))
    let form = props.form
    let ps = _.defaults({ form: null }, props)
    return <VContext.Provider value={{ V, form }}>
      <Comp {...ps}></Comp>
    </VContext.Provider>
  });
  return F as any
}

export function useValidator(): ValidatorProps {
  return useContext(VContext)
}
