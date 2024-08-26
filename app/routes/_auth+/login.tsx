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
      <Card>
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          {/* <CardDescription>
            Deploy your new project in one-click.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col gap-8"
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
            <Button
              className="w-full"
              variant="primary"
            >
              Submit
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
