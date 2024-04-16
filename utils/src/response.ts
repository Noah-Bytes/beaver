interface IResponse<T> {
  success: boolean;
  data?: T;
  subMsg?: string;
  subCode?: string | number;
}

export function success<T>(data?: T): IResponse<T> {
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
  code: string | number;

  constructor(props: { message: string; code: string | number }) {
    super(props.message);
    this.code = props.code;
  }

  override toString() {
    return `${this.code}:${this.message}`;
  }
}
