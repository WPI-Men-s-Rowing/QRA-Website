import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { EntityConfiguration } from "electrodb";
import { Table } from "sst/node/table"; // This gets the tables that are available from the stacks

// Create a client engine so we only have to do this once
const Client = new DynamoDBClient({});

// This is the global configuration for the regattas table
export const databaseConfiguration: EntityConfiguration = {
  client: Client,
  table: Table.database.tableName,
};
