import { ApiError } from "~/server/api/errors/api-error";

enum FunctionType {
  SquareRoot = "sqrt",
}

enum OperatorType {
  Plus = "+",
  Minus = "-",
  Multiply = "*",
  Divide = "/",
  Power = "^",
}

enum ParenthesisType {
  Left = "(",
  Right = ")",
}

enum TokenType {
  Number = "Number",
  Function = "Function",
  Operator = "Operator",
  Parenthesis = "Parenthesis",
}

type Operator = {
  type: OperatorType;
  precedence: number;
  associativity: "left" | "right";
};

type Parenthesis = {
  type: ParenthesisType;
};

type Function = {
  type: FunctionType;
};

type Token =
  | {
      type: TokenType.Number;
      value: number | string;
    }
  | {
      type: TokenType.Function;
      value: Function;
    }
  | {
      type: TokenType.Operator;
      value: Operator;
    }
  | {
      type: TokenType.Parenthesis;
      value: Parenthesis;
    };

const SUPPORTED_OPERATORS = [
  OperatorType.Plus,
  OperatorType.Minus,
  OperatorType.Multiply,
  OperatorType.Divide,
  OperatorType.Power,
];

const SUPPORTED_FUNCTIONS = [FunctionType.SquareRoot];

const getOperator = (type: OperatorType) => {
  switch (type) {
    case OperatorType.Plus:
      return {
        type,
        precedence: 2,
        associativity: "left" as const,
      };
    case OperatorType.Minus:
      return {
        type,
        precedence: 2,
        associativity: "left" as const,
      };
    case OperatorType.Multiply:
      return {
        type,
        precedence: 3,
        associativity: "left" as const,
      };
    case OperatorType.Divide:
      return {
        type,
        precedence: 3,
        associativity: "left" as const,
      };
    case OperatorType.Power:
      return {
        type,
        precedence: 4,
        associativity: "right" as const,
      };
  }
};

const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];

  const stringParts: string[] = [];
  let stringPart = "";

  input.split("").forEach((char) => {
    if (
      [
        ...SUPPORTED_OPERATORS,
        ParenthesisType.Left,
        ParenthesisType.Right,
      ].includes(char as any)
    ) {
      if (stringPart) {
        stringParts.push(stringPart);
      }

      stringParts.push(char);
      stringPart = "";
    } else {
      stringPart += char;
    }
  });

  if (stringPart) {
    stringParts.push(stringPart);
  }

  stringParts.forEach((part) => {
    if (SUPPORTED_OPERATORS.includes(part as any)) {
      tokens.push({
        type: TokenType.Operator,
        value: getOperator(part as OperatorType),
      });
    } else if (
      part === ParenthesisType.Left ||
      part === ParenthesisType.Right
    ) {
      tokens.push({
        type: TokenType.Parenthesis,
        value: {
          type: part as ParenthesisType,
        },
      });
    } else if (SUPPORTED_FUNCTIONS.includes(part as any)) {
      tokens.push({
        type: TokenType.Function,
        value: {
          type: part as FunctionType,
        },
      });
    } else {
      tokens.push({
        type: TokenType.Number,
        value: !isNaN(Number(part)) ? Number(part) : part,
      });
    }
  });

  return tokens;
};

export const applyShuntingYard = (input: string) => {
  const inputWithoutSpaces = input.replace(/\s/g, "");

  const tokens = tokenize(inputWithoutSpaces);

  const reversedPolishNotation: Token[] = [];
  const operatorStack: Token[] = [];

  tokens.forEach((token) => {
    switch (token.type) {
      case TokenType.Number:
        reversedPolishNotation.push(token);
        break;
      case TokenType.Function:
        operatorStack.push(token);
        break;
      case TokenType.Operator:
        while (
          operatorStack[operatorStack.length - 1] &&
          !(
            operatorStack[operatorStack.length - 1]!.type ===
              TokenType.Parenthesis &&
            (
              operatorStack[operatorStack.length - 1]!.value as {
                type: ParenthesisType;
              }
            ).type === ParenthesisType.Left
          ) &&
          ((
            operatorStack[operatorStack.length - 1]!
              .value as unknown as Operator
          ).precedence > token.value.precedence ||
            ((
              operatorStack[operatorStack.length - 1]!
                .value as unknown as Operator
            ).precedence === token.value.precedence &&
              token.value.associativity === "left"))
        ) {
          reversedPolishNotation.push(operatorStack.pop()!);
        }

        operatorStack.push(token);

        break;
      case TokenType.Parenthesis:
        if (token.value.type === ParenthesisType.Left) {
          operatorStack.push(token);
        } else if (token.value.type === ParenthesisType.Right) {
          while (
            operatorStack[operatorStack.length - 1] &&
            !(
              operatorStack[operatorStack.length - 1]!.type ===
                TokenType.Parenthesis &&
              (
                operatorStack[operatorStack.length - 1]!.value as {
                  type: ParenthesisType;
                }
              ).type === ParenthesisType.Left
            )
          ) {
            if (operatorStack.length === 0) {
              throw new ApiError(
                "There was an error while parsing the equation (empty operation stack in right parenthesis)",
                "equation"
              );
            }

            reversedPolishNotation.push(operatorStack.pop()!);
          }

          if (
            operatorStack[operatorStack.length - 1]!.type !==
              TokenType.Parenthesis &&
            (
              operatorStack[operatorStack.length - 1]!.value as {
                type: ParenthesisType;
              }
            ).type !== ParenthesisType.Left
          ) {
            throw new ApiError(
              "There was an error while parsing the equation (parenthesis mismatch 1)",
              "equation"
            );
          }

          operatorStack.pop();
        }

        if (
          operatorStack[operatorStack.length - 1] &&
          operatorStack[operatorStack.length - 1]!.type === TokenType.Function
        ) {
          reversedPolishNotation.push(operatorStack.pop()!);
        }

        break;
    }
  });

  while (operatorStack.length > 0) {
    if (
      !(
        operatorStack[operatorStack.length - 1]!.type !==
          TokenType.Parenthesis &&
        (
          operatorStack[operatorStack.length - 1]!.value as {
            type: ParenthesisType;
          }
        ).type !== ParenthesisType.Left
      )
    ) {
      throw new ApiError(
        "There was an error while parsing the equation (parenthesis mismatch 2)",
        "equation"
      );
    }

    reversedPolishNotation.push(operatorStack.pop()!);
  }

  console.log(reversedPolishNotation);
  return reversedPolishNotation;
};
