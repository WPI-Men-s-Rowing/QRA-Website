import { Attribute, ElectroError, Entity, Service } from "electrodb";
import {
  Adapter,
  InitializeAdapter,
  KeySchema,
  LuciaErrorConstructor,
  SessionSchema,
  UserSchema,
} from "lucia";
import { databaseConfiguration } from "./dynamo.ts";

/**
 * Configuration items for the DynamoDB Adapter. Contains additional attributes for the user and the session
 */
export interface DynamoDbAdapterConfig {
  userAttributes: Readonly<Record<string, Attribute>>;
  sessionAttributes: Readonly<Record<string, Attribute>>;
}

/**
 * Class representing an instantiated DynamoDB Adapter
 */
class DynamoDbAdapter implements Adapter {
  // Any adapter errors must throw this instead of the raw error as per Lucia docs
  private luciaError: LuciaErrorConstructor;

  // Base type for the user entity
  private userEntity: Entity<
    string,
    string,
    string,
    {
      model: {
        entity: "user";
        version: "1";
        service: "accounts";
      };
      attributes: {
        id: {
          type: "string";
          required: true;
          readOnly: true;
        };
      };
      indexes: {
        // Index to look up a user by their ID. Uses no SK to enforce uniqueness on user ID
        user: {
          pk: {
            field: "pk";
            composite: ["id"];
          };
          sk: {
            field: "sk";
            composite: [];
          };
        };
      };
    }
  >;

  // Entity representing the base Lucia key type
  private keyEntity: Entity<
    string,
    string,
    string,
    {
      model: {
        entity: "key";
        version: "1";
        service: "accounts";
      };
      attributes: {
        id: {
          type: "string";
          required: true;
          readOnly: true;
        };
        user_id: {
          type: "string";
          required: true;
          readOnly: true;
        };
        hashed_password: {
          type: "string";
          required: false;
        };
      };
      indexes: {
        // Index to look up keys by their ID. Uses no SK to enforce uniqueness on session ID
        key: {
          pk: {
            field: "pk";
            composite: ["id"];
          };
          sk: {
            field: "sk";
            composite: [];
          };
        };
        keysByUser: {
          // Index to look up keys by their user ID
          index: "gsi1";
          pk: {
            field: "gsi1pk";
            composite: ["user_id"];
          };
          sk: {
            field: "gsi1sk";
            composite: ["id"];
          };
        };
      };
    }
  >;

  // Entity representing the Lucia session. Will have at least the base types as required by Lucia
  private sessionEntity: Entity<
    string,
    string,
    string,
    {
      model: {
        entity: "session";
        version: "1";
        service: "accounts";
      };
      attributes: {
        id: {
          type: "string";
          required: true;
          readOnly: true;
        };
        user_id: {
          type: "string";
          required: true;
          readOnly: true;
        };
        active_expires: {
          type: "number";
          required: true;
        };
        idle_expires: {
          type: "number";
          required: true;
        };
      };
      indexes: {
        session: {
          // Look up a session by its ID. Uses an empty SK to ensure per-ID uniqueness
          pk: {
            field: "pk";
            composite: ["id"];
          };
          sk: {
            field: "sk";
            composite: [];
          };
        };
        sessionsByUserId: {
          // Index to look up all sessions associated with a given user by their ID
          index: "gsi1";
          pk: {
            field: "gsi1pk";
            composite: ["user_id"];
          };
          sk: {
            field: "gsi1sk";
            composite: ["id"];
          };
        };
      };
    }
  >;

  // Service for accounts
  private accountService: Service<{
    user: DynamoDbAdapter["userEntity"];
    session: DynamoDbAdapter["sessionEntity"];
    key: DynamoDbAdapter["keyEntity"];
  }>;

  constructor(
    config: DynamoDbAdapterConfig,
    luciaError: LuciaErrorConstructor,
  ) {
    // Save the lucia error type and config
    this.luciaError = luciaError;

    // Create the user entity with the expanded attributes
    this.userEntity = new Entity({
      model: {
        entity: "user",
        version: "1",
        service: "accounts",
      },
      attributes: {
        ...config.userAttributes,
        id: {
          type: "string",
          readOnly: true,
          required: true,
        },
      },
      indexes: {
        user: {
          pk: {
            field: "pk",
            composite: ["id"],
          },
          sk: {
            field: "sk",
            composite: [],
          },
        },
      },
      databaseConfiguration,
    });

    // Create the session entity with the expanded attributes
    this.sessionEntity = new Entity({
      model: {
        entity: "session",
        version: "1",
        service: "accounts",
      },
      attributes: {
        ...config.sessionAttributes,
        id: {
          type: "string",
          required: true,
          readOnly: true,
        },
        user_id: {
          type: "string",
          required: true,
          readOnly: true,
        },
        active_expires: {
          type: "number",
          required: true,
        },
        idle_expires: {
          type: "number",
          required: true,
        },
      },
      indexes: {
        session: {
          // Look up a session by its ID. Uses an empty SK to ensure per-ID uniqueness
          pk: {
            field: "pk",
            composite: ["id"],
          },
          sk: {
            field: "sk",
            composite: [],
          },
        },
        sessionsByUserId: {
          // Index to look up all sessions associated with a given user by their ID
          index: "gsi1",
          pk: {
            field: "gsi1pk",
            composite: ["user_id"],
          },
          sk: {
            field: "gsi1sk",
            composite: ["id"],
          },
        },
      },
      databaseConfiguration,
    });

    this.keyEntity = new Entity({
      model: {
        entity: "key",
        version: "1",
        service: "accounts",
      },
      attributes: {
        id: {
          type: "string",
          required: true,
          readOnly: true,
        },
        user_id: {
          type: "string",
          required: true,
          readOnly: true,
        },
        hashed_password: {
          type: "string",
          required: false,
        },
      },
      indexes: {
        // Index to look up keys by their ID. Uses no SK to enforce uniqueness on session ID
        key: {
          pk: {
            field: "pk",
            composite: ["id"],
          },
          sk: {
            field: "sk",
            composite: [],
          },
        },
        keysByUser: {
          // Index to look up keys by their user ID
          index: "gsi1",
          pk: {
            field: "gsi1pk",
            composite: ["user_id"],
          },
          sk: {
            field: "gsi1sk",
            composite: ["id"],
          },
        },
      },
      databaseConfiguration,
    });

    this.accountService = new Service({
      user: this.userEntity,
      key: this.keyEntity,
      session: this.sessionEntity,
    });
  }

  /**
   * Deletes a key by ID. Will not throw if the key ID does not exist
   * @param keyId the key ID to try deleting
   */
  async deleteKey(keyId: string) {
    // Delete the key, this won't throw if the ID is bad
    await this.accountService.entities.key
      .delete({
        id: keyId,
      })
      .go();
  }

  /**
   * Deletes a key by its associated user ID. Will not throw anything if the user ID returns any invalid keys
   * @param userId the user ID to try deleting keys for
   */
  async deleteKeysByUserId(userId: string) {
    // Yes *technically* there is room for a race condition here, but it doesn't really matter, since worst case
    // an invalid key gets passed to delete, in which case it is (and is supposed to be) ignored anyway.
    // Blame DynamoDB's stupid transaction API =)

    // Get the keys associated with the user ID
    const keys = await this.accountService.entities.key.query
      .keysByUser({ user_id: userId })
      .go();

    // Now run a batch delete on those keys
    await this.accountService.entities.key
      .delete(
        keys.data.map((key) => ({
          id: key.id,
        })),
      )
      .go();
  }

  /**
   * Deletes a user by their associated user ID. Will not throw anything if the user ID is invalid
   * @param userId the user Id to attempt deleting
   */
  async deleteUser(userId: string) {
    // Await deleting the user by their ID
    await this.accountService.entities.user.delete({ id: userId }).go();
  }

  /**
   * Method to return a key by its ID
   * @param keyId the ID to get the key of
   * @returns null if the key doesn't exist, or the key if it does
   */
  async getKey(keyId: string) {
    // Attempt to get the data
    const key = (await this.accountService.entities.key.get({ id: keyId }).go())
      .data;

    // If we got nothing back
    if (key === null) {
      return key; // Return the data (null)
    } else {
      // Otherwise, map the fields as appropriate (make hashed password null instead of undefined)
      return {
        ...key, // Everything else is fine
        hashed_password: key.hashed_password ?? null,
      };
    }
  }

  /**
   * Method to get all keys associated with a user. Will return an empty array if no matches are found for any reason
   * @param userId the user ID to get keys for
   * @returns the keys associated with the provided user ID
   */
  async getKeysByUserId(userId: string) {
    // Get the keys associated with the user ID
    const keys = (
      await this.accountService.entities.key.query
        .keysByUser({ user_id: userId })
        .go()
    ).data;

    // Now map those keys
    return keys.map((user) => ({
      ...user,
      hashed_password: user.hashed_password ?? null,
    }));
  }

  /**
   * Method to get a user by its associated user ID. Will return either the user, or null if no matching user is found
   * @param userId the user ID to attempt to lookup
   * @returns the found user, or none if none matches
   */
  async getUser(userId: string) {
    return (await this.accountService.entities.user.get({ id: userId }).go())
      .data as UserSchema; // This little thing forces TypeScript to be happy when the user defines custom attributes. As long
    // as they do so correctly, this works great. If they screw it up, that's on them
  }

  /**
   * Creates a key from the provided key details
   * @param key the key to create
   * @throws {LuciaError} if the auth key is not unique
   */
  async setKey(key: KeySchema) {
    try {
      // Attempt to create the key
      await this.accountService.entities.key
        .create({ ...key, hashed_password: key.hashed_password ?? undefined })
        .go();
    } catch (error) {
      // If it's an ElectroError and 4001, that tends to mean the PK "constraint" (enforced by ElectroDB) is violated
      if (error instanceof ElectroError && error.code === 4001) {
        throw new this.luciaError("AUTH_DUPLICATE_KEY_ID"); // Return the appropriate error
      }

      // Otherwise, just pass up the base error
      throw error;
    }
  }

  /**
   * Creates a user, and optionally a key to go with the user
   * @param user the user to create
   * @param key the key to create, may be null
   * @throws {LuciaError} if either the user or the key is duplicate. In this case, neither is created
   */
  async setUser(user: UserSchema, key: KeySchema | null) {
    // If we have a key, attempt to create it
    if (key) {
      const responses = await this.accountService.transaction
        .write((entities) => [
          entities.user.create(user).commit(),
          entities.key
            .create({
              ...key,
              hashed_password: key.hashed_password ?? undefined,
            })
            .commit(),
        ])
        .go();

      // If the response is cancelled
      if (responses.canceled) {
        // Check if it's conditional check failed (unique constraint)
        if (
          responses.data[0].code === "ConditionalCheckFailed" ||
          responses.data[1].code === "ConditionalCheckFailed"
        ) {
          // Throw a duplicate ID lucia error
          throw new this.luciaError("AUTH_DUPLICATE_KEY_ID");
        } else {
          // Otherwise, just throw an ElectroError
          throw new ElectroError();
        }
      }
    } else {
      try {
        // Attempt to create the key
        await this.accountService.entities.user.create(user).go();
      } catch (error) {
        // If it's an ElectroError and 4001, that tends to mean the PK "constraint" (enforced by ElectroDB) is violated
        if (error instanceof ElectroError && error.code === 4001) {
          throw new this.luciaError("AUTH_DUPLICATE_KEY_ID"); // Return the appropriate error
        }

        // Otherwise, just pass up the base error
        throw error;
      }
    }
  }

  /**
   * Method to update a key given its ID
   * @param keyId the key to update
   * @param partialKey information about the key to update
   * @throws {LuciaError} if the provided key ID is invalid
   */
  async updateKey(keyId: string, partialKey: Partial<KeySchema>) {
    try {
      // Attempt to patch (update no create) the key
      await this.accountService.entities.key
        .patch({
          id: keyId,
        })
        // Do any updates necessary
        .set({
          ...partialKey,
          hashed_password: partialKey.hashed_password ?? undefined,
        })
        .go();
    } catch (error) {
      // If it's an electro error and it's 4001, that's DynamoDB complaining the key is invalid
      if (error instanceof ElectroError && error.code === 4001) {
        throw new this.luciaError("AUTH_INVALID_KEY_ID"); // Throw that
      }

      throw error; // Otherwise, just throw whatever error
    }
  }

  /**
   * Method to update a user given its ID
   * @param userId the user ID to update
   * @param partialUser information about the user to update
   * @throws {LuciaError} if the provided user ID is invalid
   */
  async updateUser(userId: string, partialUser: Partial<UserSchema>) {
    try {
      // Attempt to patch (update no create) the user
      await this.accountService.entities.user
        .patch({
          id: userId,
        })
        // Do any updates necessary
        .set(partialUser)
        .go();
    } catch (error) {
      // If it's an electro error and it's 4001, that's DynamoDB complaining the user is invalid
      if (error instanceof ElectroError && error.code === 4001) {
        throw new this.luciaError("AUTH_INVALID_USER_ID"); // Throw that
      }

      throw error; // Otherwise, just throw whatever error
    }
  }

  /**
   * Method to delete a session by its ID. Does nothing if the session ID is invalid
   * @param sessionId the session ID to delete
   */
  async deleteSession(sessionId: string) {
    // Simply delete the session, this will do nothing if the ID is invalid
    await this.accountService.entities.session.delete({ id: sessionId }).go();
  }

  /**
   * Method to delete sessions by their user ID. Does nothing if the user ID returns any invalid sessions
   * @param userId the user ID to delete sessions for
   */
  async deleteSessionsByUserId(userId: string) {
    // Yes *technically* this opens up to a race condition (session deleted after first query but before 2nd) but that's fine
    // since the 2nd would be deleted anyway? Blame the bad DynamoDB transaction API

    // Get the sessions that should be marked for deletion
    const sessions = (
      await this.accountService.entities.session.query
        .sessionsByUserId({ user_id: userId })
        .go()
    ).data;

    // Await deleting all associated sessions
    await this.accountService.entities.session
      .delete(
        sessions.map((session) => ({
          id: session.id,
        })),
      )
      .go();
  }

  /**
   * Method to get a session by its ID, or null if the session does not exist
   * @param sessionId the session ID to get the session for
   * @returns the session associated with the given ID, or null if that session does not exist
   */
  async getSession(sessionId: string) {
    return (
      await this.accountService.entities.session.get({ id: sessionId }).go()
    ).data as SessionSchema; // This allows the user to define custom session attributes without everything breaking.
    // As long as they do so correctly, this doesn't really impact functionality
  }

  /**
   * Method to get a session by the user ID it is associated with, or an empty array if none exist
   * @param userId the user ID to get the sessions for
   * @returns the sessions associated with the given user ID
   */
  async getSessionsByUserId(userId: string) {
    // Get the sessions associated with the given user ID
    return (
      await this.accountService.entities.session.query
        .sessionsByUserId({ user_id: userId })
        .go()
    ).data;
  }

  /**
   * Method to create a session
   * @param session the session object to create
   */
  async setSession(session: SessionSchema) {
    // Create the session
    await this.accountService.entities.session.create(session).go();
  }

  /**
   * Method to update a session by its ID (ignore the stupid naming, thanks Lucia?)
   * @param keyId the ID of the session to update
   * @param partialKey the partial of the session, describing what should be updated
   */
  async updateSession(keyId: string, partialKey: Partial<SessionSchema>) {
    try {
      // Try updating the session
      await this.accountService.entities.session
        .patch({ id: keyId })
        .set(partialKey)
        .go();
    } catch (error) {
      // If we get 4001, that means the session never existed
      if (error instanceof ElectroError && error.code === 4001) {
        // Throw the associated error
        throw new this.luciaError("AUTH_INVALID_SESSION_ID");
      }

      // Otherwise, just pass up the generic error we got
      throw error;
    }
  }
}

/**
 * Creates a DynamoDB Adapter using the provided configuration options
 * @param config the configuration options to use
 * @returns a Lucia adapter builder that creates a DynamoDB Adapter
 */
export const dynamoDbAdapter = (
  config: DynamoDbAdapterConfig,
): InitializeAdapter<Adapter> => {
  return (luciaError): Adapter => new DynamoDbAdapter(config, luciaError);
};
