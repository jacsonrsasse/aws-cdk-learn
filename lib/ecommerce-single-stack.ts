import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class ECommerceSingleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsFetchHandler = new lambdaNodeJS.NodejsFunction(
      this,
      "ProductsFetchFunction",
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        functionName: "products-fetch-function",
        entry: "lambda/products/products-fetch-function.ts",
        handler: "handler",
        memorySize: 512,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
      },
    );

    const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs");

    const api = new apigateway.RestApi(this, "ECommerceApi", {
      restApiName: "ecommerce-api",
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          user: true,
          caller: true,
        }),
      },
    });

    const productsFetchIntegration = new apigateway.LambdaIntegration(
      productsFetchHandler,
    );

    // /products
    const productsResource = api.root.addResource("products");
    productsResource.addMethod("GET", productsFetchIntegration);
  }
}
