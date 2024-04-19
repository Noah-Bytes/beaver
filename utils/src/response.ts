// 定义基础接口，不直接使用，仅作为构建具体类型的基础
interface BaseResponse<T> {
  success: boolean;
  data?: T;
  subMsg?: string;
  subCode?: string | number;
}

// 成功时的类型
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// 失败时的类型
interface FailureResponse {
  success: false;
  subMsg: string;
  subCode?: string | number;
}

// 使用条件类型根据 success 的值来决定具体的类型
export type IResponse<T> =
  BaseResponse<T> extends { success: infer S }
    ? S extends true
      ? SuccessResponse<T>
      : S extends false
        ? FailureResponse
        : never
    : never;

export function success<T>(data: T): IResponse<T> {
  return {
    success: true,
    data,
  };
}

export function fail<T>(msg: string, code?: number | string): IResponse<T> {
  return {
    success: false,
    subMsg: msg,
    subCode: code,
  };
}

export function NoExist(id: any) {
  return new ExceptionService({
    message: `${id} does not exist.`,
    code: 'Resource not found',
  });
}

export class ExceptionService extends Error {
  code?: string | number;

  constructor(props: { message: string; code?: string | number }) {
    super(props.message);
    this.code = props.code;
  }

  override toString() {
    if (this.code) {
      return `${this.code}:${this.message}`;
    }
    return this.message;
  }
}
