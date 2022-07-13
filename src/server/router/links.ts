import { createRouter } from "./context";
import { nanoid } from "nanoid";

import { z } from "zod";
import { isUrl } from "../../utils/regexPatterns";

export const linksRouter = createRouter()
  .mutation("create", {
    input: z.object({
      url: z.string().regex(isUrl),
    }),
    async resolve({ ctx, input }) {
      const slug = nanoid(8);
      const token = "protectl.ink:" + slug + ":" + nanoid(21);
      const result = await ctx.prisma.shortLink.create({
        data: {
          url: input.url,
          slug: slug,
          token: token,
        },
      });
      return {
        shortLink: result,
      };
    },
  })
  .mutation("get", {
    input: z.object({
      token: z.string().regex(/^protectl.ink:/),
    }),
    async resolve({ ctx, input }) {
      console.log(input.token);
      const result = await ctx.prisma.shortLink.findFirst({
        where: { token: input.token },
      });
      if (result) {
        return { url: result.url };
      }
    },
  });
