import { authenticator } from "@/services/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { Form, useSearchParams } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node"; // or cloudflare/deno
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
import { db } from "@/utils/db.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Gender } from "@prisma/client";

const HeightUnit = z.enum(["cm", "ft"]);
const WeightUnit = z.enum(["kg", "lbs"]);

// Define the schema for the form
const schema = z.object({
  height: z.object({
    value: z.number().positive("Height must be greater than 0."), // Positive number for height
    unit: HeightUnit, // Enum for height unit
  }),
  weight: z.object({
    value: z.number().positive("Weight must be greater than 0."), // Positive number for weight
    unit: WeightUnit, // Enum for weight unit
  }),
  age: z
    .number()
    .int()
    .positive("Age must be greater than 0.")
    .max(100, "Age must be less than 100 years."), // Positive integer for age
  gender: z.enum(["M", "F", "OTHER"]),
});

type FormData = z.infer<typeof schema>;

const resolver = zodResolver(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const stats = await db.stats.findUnique({ where: { id: user.id } });
  if (stats) return redirect("/dasboard");
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
  const [search, setSearch] = useSearchParams();
  const error = search.get("error");

  // remove error after 3s
  useEffect(() => {
    if (error && error !== "") {
      setTimeout(
        () =>
          setSearch((prev) => {
            prev.delete("error");
            return prev;
          }),
        3000
      );
    }
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          {error && error !== "" && (
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col gap-4"
          >
            <div className="space-y-1">
              <Label htmlFor="age">
                Your Age:
                {errors.age && (
                  <p className="text-xs text-destructive">
                    {errors.age.message}
                  </p>
                )}
              </Label>
              <Input
                type="number"
                id="age"
                onBlur={(e) => {
                  setValue("age", Number(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="height">
                Height:
                {errors.height?.value && (
                  <p className="text-xs text-destructive">
                    {errors.height?.value.message}
                  </p>
                )}
              </Label>
              <Input
                type="number"
                id="height"
                onBlur={(e) => {
                  setValue("height.value", Number(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="weight">
                Weight:
                {errors.weight?.value && (
                  <p className="text-xs text-destructive">
                    {errors.weight?.value.message}
                  </p>
                )}
              </Label>
              <Input
                type="number"
                id="weight"
                onBlur={(e) => {
                  setValue("weight.value", Number(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gender">
                Gender:
                {errors.gender && (
                  <p className="text-xs text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </Label>
              <Select onValueChange={(v) => setValue("gender", v as Gender)}>
                <SelectTrigger
                  id="gender"
                  className="min-w-[180px]"
                >
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Submit</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
