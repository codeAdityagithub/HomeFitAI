import { authenticator } from "@/services/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { Form } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ActionFunctionArgs, json } from "@remix-run/node"; // or cloudflare/deno
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const HeightUnit = z.enum(["cm", "ft"]);
const WeightUnit = z.enum(["kg", "lbs"]);

// Define the schema for the form
const schema = z.object({
  height: z.object({
    value: z.number().positive(), // Positive number for height
    unit: HeightUnit, // Enum for height unit
  }),
  weight: z.object({
    value: z.number().positive(), // Positive number for weight
    unit: WeightUnit, // Enum for weight unit
  }),
  age: z.number().int().positive(), // Positive integer for age
});

type FormData = z.infer<typeof schema>;

const resolver = zodResolver(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/details",
  });

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues });
  }

  // Do something with the data
  return json(data);
};

export default function LoginForm() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      age: 0,
      height: { value: 0, unit: "cm" },
      weight: { value: 0, unit: "kg" },
    },
  });

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="bg-white/60 backdrop-blur-sm">
        <CardContent className="w-[300px] mt-6">
          <Form
            action="/auth/google"
            method="post"
          >
            <Button
              type="submit"
              className="w-full"
            >
              Login with <FaGoogle className="text-xl ml-2" />
              oogle
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
