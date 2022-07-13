import { createRouter } from "./context";
import { nanoid } from "nanoid";

import { z } from "zod";

export const linksRouter = createRouter()
  .mutation("create", {
    input: z.object({
      url: z.string(),
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
      token: z.string(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.shortLink.findFirst({
        where: { token: input.token },
      });
      if (result) {
        return { url: result.url };
      }
    },
  });
