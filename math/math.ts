import { APIError, ErrCode, api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("math", { migrations: "./migrations" });

interface OpData {
  a: number;
  b: number;
}

interface Result {
  result: number;
}

export interface History {
  id: number;
  input: string;
  output: string;
}

export async function getHistory(db: SQLDatabase): Promise<History[]> {
  const results = db.query<History>`SELECT id, input, output FROM math ORDER BY id DESC`;

  const rows: History[] = [];

  for await (const result of results) {
    rows.push(result);
  }
  return rows;
}

async function calculateAndInsert(
  data: OpData,
  op: "+" | "-" | "/" | "*",
): Promise<Result> {
  let result = 0;
  switch (op) {
    case "+":
      result = data.a + data.b;
      break;
    case "-":
      result = data.a - data.b;
      break;
    case "/":
      result = data.a / data.b;
      break;
    case "*":
      result = data.a * data.b;
      break;
  }

  const input = data.a + op + data.b;
  const output = result + "";

  await db.exec`INSERT INTO math (input, output) VALUES (${input}, ${output})`;

  return { result };
}

export const add = api(
  { method: "POST", path: "/add", expose: true },
  async (data: OpData): Promise<Result> => {
    return calculateAndInsert(data, "+");
  },
);

export const substract = api(
  { method: "POST", path: "/substract", expose: true },
  async (data: OpData): Promise<Result> => {
    return calculateAndInsert(data, "-");
  },
);

export const division = api(
  { method: "POST", path: "/division", expose: true },
  async (data: OpData): Promise<Result> => {
    if (data.b === 0) {
      throw new APIError(ErrCode.PermissionDenied, "can't divide by 0");
    }

    return calculateAndInsert(data, "/");
  },
);

export const multiplication = api(
  { method: "POST", path: "/multiplication", expose: true },
  async (data: OpData): Promise<Result> => {
    return calculateAndInsert(data, "*");
  },
);

export const history = api(
  { method: "GET", path: "/history", expose: true },
  async (): Promise<{ data: History[] }> => {
    const data = await getHistory(db);

    return { data };
  },
);
