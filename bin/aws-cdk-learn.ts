#!/usr/bin/env node
import "dotenv/config";
import * as cdk from "aws-cdk-lib/core";
import { ProductsAppStack } from "../lib/products-app-stack";
import { ECommerceApiStack } from "../lib/ecommerce-api-stack";

const app = new cdk.App();
const env: cdk.Environment = {
  account: "000000000000",
  region: "us-east-1",
};
const tags = {
  const: "ECommerce",
};
const isLocal = process.env.STAGE === "local";

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags,
  env,
});

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  isLocal,
  tags,
  env,
});
eCommerceApiStack.addStackDependency(productsAppStack);
