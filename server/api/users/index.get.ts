import { z } from "zod";
import { userTable } from "~~/server/db/schema";
import { getPaginatedUsers } from "~~/server/utils/user";
import { queryStringArraySchema } from "~~/validation/queryStringArraySchema";

const filterSchema = z.object({
  query: z.coerce.string().trim().min(1).max(64).optional(),
  userKeys: queryStringArraySchema.pipe(z.array(z.string()).max(6)).optional(),
});

export interface UsersResult {
  users: BrazenUser[];
}

export default cachedEventHandler(
  async (event): Promise<PaginatedResponse<BrazenUser>> => {
    const query = await getValidatedQuery(
      event,
      filterSchema.extend(
        getPaginationSchema([userTable.userKey], userTable.userKey, "asc")
          .shape,
      ).parse,
    );
    return await getPaginatedUsers(query, {
      query: query.query,
      userKeys: query.userKeys,
    });
  },
  {
    maxAge: 300,
    swr: false,
  },
);
