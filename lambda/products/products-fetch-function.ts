import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const { httpMethod: method, resource } = event;
  if (resource === "/products") {
    if (method === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Ok",
        }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
