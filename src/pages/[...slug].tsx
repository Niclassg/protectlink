import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";

const Slug = () => {
  const router = useRouter();
  const { slug } = router.query;

  const getLink = trpc.useMutation(["links.get"]);
  const [link, setLink] = useState<string | undefined>(undefined);

  type Input = {
    token: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    getLink.mutateAsync(
      { token: data.token },
      {
        onSuccess: (result) => {
          setLink(result?.url);
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
    <div className="bg-gray-900 w-screen h-screen text-gray-100 font-bold tracking-wider font-sans">
      <div className="flex flex-col items-center justify-center h-screen">
        {slug}
        <br />
        {!link && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col text-center">
              <label className="text-gray-100 font-semibold mb-4">
                <p className="text-center">Enter a token to receive the url</p>
                <input
                  {...register("token", {
                    required: true,
                    pattern: /^protectl.ink:/,
                  })}
                  placeholder="protectl.ink:[XYZ]:[ABC]"
                  className="border-2 border-gray-900 rounded-lg p-2 text-gray-900 text-center"
                />
              </label>
              <button
                type="submit"
                className="bg-gray-300 hover:bg-gray-400 rounded-md border-1 text-gray-800 active:bg-gray-500 disabled:hidden"
                disabled={!!errors.token}
              >
                Get link!
              </button>
              {errors.token && (
                <p>
                  {errors.token.type === "pattern"
                    ? "Token is not formatted correctly"
                    : "Token not inserted"}
                </p>
              )}
            </div>
          </form>
        )}
        {link && (
          <>
            <a href={link}>{link}</a>
          </>
        )}
      </div>
    </div>
  );
};

export default Slug;
