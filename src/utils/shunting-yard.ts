import { ApiError } from "~/server/api/errors/api-error";

enum FunctionType {
  SquareRoot = "sqrt",
  Sin = "sin",
  Cos = "cos",
  Tan = "tan",
  Cot = "cot",
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

const SUPPORTED_FUNCTIONS = [
  FunctionType.SquareRoot,
  FunctionType.Sin,
  FunctionType.Cos,
  FunctionType.Tan,
  FunctionType.Cot,
];

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

const applyShuntingYard = (input: string) => {
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
              "There was an error while parsing the equation (parenthesis mismatch)",
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
        "There was an error while parsing the equation (parenthesis mismatch)",
        "equation"
      );
    }

    reversedPolishNotation.push(operatorStack.pop()!);
  }

  return reversedPolishNotation;
};

const calculateRPN = (rpn: Token[], variableValue: number) => {
  const stack: number[] = [];

  rpn.forEach((token) => {
    switch (token.type) {
      case TokenType.Number:
        if (typeof token.value === "number") {
          stack.push(token.value);
        } else {
          if (token.value === "x") {
            stack.push(variableValue);
          } else if (token.value === "PI") {
            stack.push(Math.PI);
          } else {
            throw new ApiError("Zmienna musi być nazwana 'x'", "equation");
          }
        }

        break;
      case TokenType.Function:
        switch (token.value.type) {
          case FunctionType.SquareRoot:
            stack.push(Math.sqrt(stack.pop()!));
            break;
          case FunctionType.Sin:
            stack.push(Math.sin(stack.pop()!));
            break;
          case FunctionType.Cos:
            stack.push(Math.cos(stack.pop()!));
            break;
          case FunctionType.Tan:
            stack.push(Math.tan(stack.pop()!));
            break;
        }

        break;
      case TokenType.Operator:
        const secondOperand = stack.pop()!;
        const firstOperand = stack.pop()!;

        switch (token.value.type) {
          case OperatorType.Plus:
            stack.push(firstOperand + secondOperand);
            break;
          case OperatorType.Minus:
            stack.push(firstOperand - secondOperand);
            break;
          case OperatorType.Multiply:
            stack.push(firstOperand * secondOperand);
            break;
          case OperatorType.Divide:
            stack.push(firstOperand / secondOperand);
            break;
          case OperatorType.Power:
            stack.push(Math.pow(firstOperand, secondOperand));
            break;
        }

        break;
      default:
        break;
    }
    console.log(stack);
  });

  return stack.pop()!;
};

export const getShuntingResponse = (input: string, variableValue?: number) => {
  const result = applyShuntingYard(input);

  return {
    reversedPolishNotation: result.map((token) =>
      token.type === TokenType.Number ? token.value : token.value.type
    ),
    valueResult:
      variableValue !== undefined ? calculateRPN(result, variableValue) : null,
  };
};
