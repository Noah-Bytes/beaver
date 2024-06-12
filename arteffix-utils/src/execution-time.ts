export class ExecutionTime {
  private static instance = new ExecutionTime();
  private now = Date.now();
  private name?: string;

  public static getInstance(): ExecutionTime {
    return this.instance;
  }

  private constructor() {}

  start(name?: string) {
    this.now = Date.now();
    this.name = name;
  }

  end() {
    const executionTime = Date.now() - this.now;
    console.log(`${this.name} execution time: ${executionTime}ms`);
  }
}
