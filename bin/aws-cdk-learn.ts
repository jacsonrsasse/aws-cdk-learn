#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { ProductsAppStack } from "../lib/products-app-stack";
import { ECommerceApiStack } from "../lib/ecommerce-api-stack";
import { ECommerceSingleStack } from "../lib/ecommerce-single-stack";

const app = new cdk.App();
const env: cdk.Environment = {
  account: "000000000000",
  region: "us-east-1",
};
const tags = {
  const: "ECommerce",
};

// Local deploys (MiniStack/LocalStack) can struggle to resolve
// cross-stack references, so the multi-stack pattern is swapped for a
// single-stack one there. Toggle with `-c singleStack=true`, e.g.:
//   npx cdklocal deploy -c singleStack=true --all
const useSingleStack = app.node.tryGetContext("singleStack") === "true";

if (useSingleStack) {
  new ECommerceSingleStack(app, "ECommerce", {
    tags,
    env,
  });
} else {
  const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
    tags,
    env,
  });

  const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
    productsFetchHandler: productsAppStack.productsFetchHandler,
    tags,
    env,
  });
  eCommerceApiStack.addStackDependency(productsAppStack);
}
