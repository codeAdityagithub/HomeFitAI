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
import { useEffect, useState } from "react";
import { Gender, Unit } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HeightUnit = z.enum(["cm", "ft"]);
const WeightUnit = z.enum(["kg", "lbs"]);

// Define the schema for the form
const schema = z
  .object({
    unit: z.enum(["kgcm", "lbsft"]),
    height: z.number().positive("Height must be greater than 0."), // Positive number for height

    weight: z.number().positive("Weight must be greater than 0."), // Positive number for weight

    age: z
      .number()
      .int()
      .min(5, "Age must be greater than 5.")
      .max(100, "Age must be less than 100 years."), // Positive integer for age
    gender: z.enum(["M", "F", "OTHER"]),
  })
  .refine(
    (data) => {
      let height = data.height;
      let weight = data.weight;

      const unit = data.unit;

      if (unit === "lbsft") {
        height = height * 30.48;
        weight = weight * 0.453592;
      }

      return height >= 50 && height <= 250 && weight >= 30 && weight <= 200;
    },
    (data) => {
      return {
        message:
          data.unit === "kgcm"
            ? `Height must be between 50 and 250 cm, and weight must be between 30 and 200 kg.`
            : `Height must be between 1.6 and 8.2 ft, and weight must be between 66 and 440 lbs.`,
        path: ["height", "weight"],
      };
    }
  );

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

const InputDec = ({ text }: { text: string }) => {
  return (
    <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs bg-background">
      {text}
    </span>
  );
};
export default function LoginForm() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      age: 20,
      height: 180,
      weight: 68,
      gender: "M",
    },
  });

  const [search, setSearch] = useSearchParams();
  const error = search.get("error");

  const [height, setHeight] = useState({ feet: 5, inch: 10 });

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

  const unit = watch("unit");
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="min-w-[300px] sm:w-[400px] md:w-[320px] lg:w-[450px] bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          {error && error !== "" && (
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Tabs
            onValueChange={(v) => setValue("unit", v as Unit)}
            defaultValue="kgcm"
            value={unit}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="kgcm">Metric Units</TabsTrigger>
              <TabsTrigger value="lbsft">US Units</TabsTrigger>
            </TabsList>
            <TabsContent
              className="w-full"
              value="kgcm"
            >
              <Form
                onSubmit={handleSubmit}
                method="POST"
                className="flex flex-col gap-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="age">
                    Your Age:{" "}
                    <span className="text-sm text-muted-foreground">
                      (5-100)
                    </span>
                    {errors.age && (
                      <p className="text-xs text-destructive">
                        {errors.age.message}
                      </p>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Your age in years"
                      id="age"
                      onBlur={(e) => {
                        setValue("age", Number(e.target.value));
                      }}
                      defaultValue={20}
                    />
                    <InputDec text="years" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="height">
                    Height:
                    {/* <span className="text-sm text-muted-foreground">(5-100)</span> */}
                    {errors.height && (
                      <p className="text-xs text-destructive">
                        {errors.height.message}
                      </p>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Your Height in cm"
                      id="height"
                      defaultValue={180}
                      onBlur={(e) => {
                        setValue("height", Number(e.target.value));
                      }}
                    />
                    <InputDec text="cm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weight">
                    Weight:
                    {errors.weight && (
                      <p className="text-xs text-destructive">
                        {errors.weight.message}
                      </p>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="weight"
                      placeholder="Weight in Kg"
                      defaultValue={68}
                      onBlur={(e) => {
                        setValue("weight", Number(e.target.value));
                      }}
                    />
                    <InputDec text="kg" />
                  </div>
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
                  <Select
                    onValueChange={(v) => setValue("gender", v as Gender)}
                    defaultValue="M"
                  >
                    <SelectTrigger
                      id="gender"
                      className="min-w-[180px]"
                    >
                      <SelectValue placeholder="Your Gender" />
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
            </TabsContent>
            <TabsContent value="lbsft">
              <Form
                onSubmit={handleSubmit}
                method="POST"
                className="flex flex-col gap-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="age">
                    Your Age:{" "}
                    <span className="text-sm text-muted-foreground">
                      (5-100)
                    </span>
                    {errors.age && (
                      <p className="text-xs text-destructive">
                        {errors.age.message}
                      </p>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Your age in years"
                      defaultValue={20}
                      id="age"
                      onBlur={(e) => {
                        setValue("age", Number(e.target.value));
                      }}
                    />
                    <InputDec text="years" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>
                    Height:
                    {/* <span className="text-sm text-muted-foreground">(5-100)</span> */}
                    {errors.height && (
                      <p className="text-xs text-destructive">
                        {errors.height.message}
                      </p>
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Height in feet"
                        defaultValue={5}
                        onBlur={(e) => {
                          setHeight((prev) => ({
                            ...prev,
                            feet: Number(e.target.value),
                          }));
                        }}
                      />
                      <InputDec text="feet" />
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        defaultValue={10}
                        min={0}
                        onBlur={(e) => {
                          setHeight((prev) => ({
                            ...prev,
                            inch: Number(e.target.value),
                          }));
                        }}
                      />
                      <InputDec text="inches" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weight">
                    Weight:
                    {errors.weight && (
                      <p className="text-xs text-destructive">
                        {errors.weight.message}
                      </p>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="weight"
                      placeholder="Your Weight in pounds"
                      defaultValue={160}
                      onBlur={(e) => {
                        setValue("weight", Number(e.target.value));
                      }}
                    />
                    <InputDec text="pounds" />
                  </div>
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
                  <Select
                    defaultValue="M"
                    onValueChange={(v) => setValue("gender", v as Gender)}
                  >
                    <SelectTrigger
                      id="gender"
                      className="min-w-[180px]"
                    >
                      <SelectValue placeholder="Your Gender" />
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
