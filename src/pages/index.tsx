import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const createLink = trpc.useMutation(["links.create"]);
  const [shortLink, setShortLink] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  console.log(origin);

  type Input = {
    url: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    createLink.mutateAsync(
      { url: data.url },
      {
        onSuccess: (result) => {
          setShortLink(`${origin}/${result.shortLink.slug}`);
          setToken(result.shortLink.token);
        },
        onError: (error) => {
          console.error("Error", error);
        },
        onSettled: (result) => {
          console.log("Settled");
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>protectl.ink</title>
        <meta name="description" content="Create protected links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-900 w-screen h-screen text-gray-100 font-bold tracking-wider font-sans">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl ">Welcome to protectl.ink</h1>
          <p className="text-gray-100">Create protected links instantly.</p>
          <br />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label className="text-gray-100 font-semibold mb-4">
                <p className="text-center">Enter a URL to shorten</p>
                <input
                  {...register("url", { required: true })}
                  placeholder="https://example.com"
                  className="border-2 border-gray-900 rounded-lg p-2 text-gray-900 text-center"
                />
              </label>
              <button
                type="submit"
                className="bg-gray-300 hover:bg-gray-400 rounded-md border-1 text-gray-800 active:bg-gray-500"
              >
                Protect!
              </button>
              {errors.url && <span>Url is required</span>}
            </div>
          </form>
          {shortLink && (
            <div>
              Your link: <a href={shortLink}>{shortLink}</a>
            </div>
          )}
          <br />
          {token && <div>Your token: {token}</div>}
        </div>
      </div>
    </>
  );
};

export default Home;
