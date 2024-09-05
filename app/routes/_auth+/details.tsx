import { authenticator } from "@/services/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
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
import db from "@/utils/db.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Gender, Unit } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, convertToCm, convertToFeetInches } from "@/lib/utils";
import Selector from "@/components/details/Selector";
import { Minus, Plus } from "lucide-react";
import { requireUser } from "@/utils/auth/auth.server";

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
    goalWeight: z.number().positive("Goal weight must be greater than 0."), // Positive integer for goal
  })
  // @ts-expect-error
  .refine(
    (data) => {
      let height = data.height;
      let weight = data.weight;
      let goal = data.goalWeight;
      return (
        height >= 50 &&
        height <= 250 &&
        weight >= 30 &&
        weight <= 200 &&
        goal >= 30 &&
        goal <= 200
      );
    },
    (data) => {
      return {
        message:
          data.unit === "kgcm"
            ? {
                height:
                  data.height < 50 || data.height > 250
                    ? "Height must be between 50 and 272 cm."
                    : null,
                weight:
                  data.weight < 30 || data.weight > 200
                    ? "Weight must be between 30 and 200 kg."
                    : null,
                goalWeight:
                  data.goalWeight < 30 || data.goalWeight > 200
                    ? "Goal weight must be between 30 and 200 kg."
                    : null,
              }
            : {
                height:
                  data.height < 50 || data.height > 250
                    ? "Height must be between 1.6 and 8.11 ft"
                    : null,
                weight:
                  data.weight < 30 || data.weight > 200
                    ? "Weight must be between 65 and 441 lbs."
                    : null,
                goalWeight:
                  data.goalWeight < 30 || data.goalWeight > 200
                    ? "Goal Weight must be between 65 and 441 lbs."
                    : null,
              },
        path: ["custom"],
      };
    }
  );

type FormData = z.infer<typeof schema>;

const resolver = zodResolver(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const stats = await db.stats.findUnique({ where: { userId: user.id } });
  if (stats) return redirect("/dashboard");
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    return json({ errors, defaultValues });
  }
  try {
    await db.stats.create({
      data: { ...data, user: { connect: { id: user.id } } },
    });
    return redirect("/dashboard");
  } catch (error: any) {
    console.log(error.message ?? error);
    return { error: "Cannot create Stats for this user." };
  }
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
    setValue: setHookValue,
    trigger,
    setError,
    formState: { errors },
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      age: 20,
      height: 178,
      weight: 68,
      gender: "M",
      unit: "kgcm",
    },
  });
  const actionData = useActionData<typeof action>();
  const [form, setForm] = useState<FormData>({
    age: 20,
    height: 178,
    weight: 68,
    gender: "M",
    unit: "kgcm",
    goalWeight: 68,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const goalWeightChanged = useRef(false);
  const setValue = <K extends keyof FormData>(name: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "weight" && goalWeightChanged.current)
      goalWeightChanged.current = false;
    // @ts-expect-error
    setHookValue(name, value);
  };

  const [search, setSearch] = useSearchParams();
  // @ts-expect-error
  const error = search.get("error") || actionData?.error;

  // us units
  const [height, setHeight] = useState({ feet: 5, inch: 10 });
  const [weight, setWeight] = useState(150);
  const [goalWeight, setGoalWeight] = useState(150);

  const navigation = useNavigation();
  // remove error after 3s
  useEffect(() => {
    setValue("height", convertToCm(height.feet, height.inch));
  }, [height]);
  useEffect(() => {
    setValue("weight", Math.min(Math.round(weight * 0.453592 * 2) / 2, 200));
    if (goalWeightChanged.current) goalWeightChanged.current = false;
  }, [weight]);
  useEffect(() => {
    setValue(
      "goalWeight",
      Math.min(Math.round(goalWeight * 0.453592 * 2) / 2, 200)
    );
  }, [goalWeight]);

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

  const handleNext = async () => {
    const parsed = await trigger();
    if (!parsed) return;
    if (form.unit === "kgcm" && !goalWeightChanged.current) {
      setValue("goalWeight", form.weight);
    } else if (unit === "lbsft" && !goalWeightChanged.current) {
      setGoalWeight(weight);
    }
    if (!goalWeightChanged.current) goalWeightChanged.current = true;
    setCurrentStep(1);
  };
  const unit = form.unit;
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="min-w-[300px] sm:w-[400px] md:w-[320px] lg:w-[450px] bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center">
            {currentStep === 0
              ? "Tell Us About Yourself"
              : "What's your target weight?"}
          </CardTitle>
          {error && error !== "" && (
            <CardDescription className="text-destructive text-center">
              {error}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Tabs
            onValueChange={(v) => {
              // @ts-expect-error
              setError("custom", {});
              setValue("unit", v as Unit);
              setHookValue("unit", v as Unit);
              if (v === "lbsft") {
                setHeight(convertToFeetInches(form.height));

                setWeight(
                  Math.min(
                    Math.min(Math.round(form.weight * 2.20462 * 2) / 2),
                    441
                  )
                );
              }
            }}
            defaultValue="kgcm"
            value={unit}
            className="w-full"
          >
            <TabsList
              className={cn(
                "w-full grid grid-cols-2",
                currentStep === 1 ? "hidden" : ""
              )}
            >
              <TabsTrigger value="kgcm">Metric Units</TabsTrigger>
              <TabsTrigger value="lbsft">US Units</TabsTrigger>
            </TabsList>

            <Form
              onSubmit={handleSubmit}
              method="POST"
              className="flex flex-col gap-4 p-2"
            >
              {currentStep === 0 ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="age">
                      Your Age:{" "}
                      <span className="text-sm md:text-muted-foreground">
                        (5-100)
                      </span>
                      {errors.age && (
                        <p className="text-xs text-red-500">
                          {errors.age.message}
                        </p>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Your age in years"
                        id="age"
                        // min={5}
                        onChange={(e) => {
                          setValue("age", Number(e.target.value));
                        }}
                        value={form.age || ""}
                      />
                      <InputDec text="years" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="height">
                      Height:
                      {/* <span className="text-sm text-muted-foreground">(5-100)</span> */}
                      {
                        // @ts-expect-error
                        errors.custom && (
                          <p className="text-xs text-red-500">
                            {
                              // @ts-expect-error
                              errors.custom.message?.height
                            }
                          </p>
                        )
                      }
                    </Label>
                    {unit === "kgcm" ? (
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Your Height in cm"
                          id="height"
                          min={50}
                          max={272}
                          step={0.5}
                          value={form.height || ""}
                          onChange={(e) => {
                            setValue("height", Number(e.target.value));
                          }}
                        />
                        <InputDec text="cm" />
                      </div>
                    ) : (
                      <div className="flex gap-2 *:flex-1">
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Height in feet"
                            max={8}
                            value={height.feet || ""}
                            onChange={(e) => {
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
                            value={height.inch}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (height.feet >= 8 && val >= 12) return;

                              if (val === 12) {
                                setHeight((prev) => ({
                                  inch: 0,
                                  feet: prev.feet + 1,
                                }));
                              } else if (val === -1) {
                                setHeight((prev) => ({
                                  inch: 11,
                                  feet: Math.max(prev.feet - 1, 0),
                                }));
                              } else {
                                setHeight((prev) => ({
                                  ...prev,
                                  inch: val,
                                }));
                              }
                            }}
                          />
                          <InputDec text="inches" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="weight">
                      Weight:
                      {
                        // @ts-expect-error
                        errors.custom && (
                          <p className="text-xs text-red-500">
                            {
                              // @ts-expect-error
                              errors.custom.message?.weight
                            }
                          </p>
                        )
                      }
                    </Label>
                    <div className="relative">
                      {unit === "kgcm" ? (
                        <Input
                          type="number"
                          id="weight"
                          min={0}
                          step={0.5}
                          placeholder="Weight in Kg"
                          value={form.weight || ""}
                          onChange={(e) => {
                            setValue("weight", Number(e.target.value));
                          }}
                        />
                      ) : (
                        <Input
                          type="number"
                          id="weight"
                          min={0}
                          step={0.5}
                          placeholder="Weight in pounds"
                          value={weight || ""}
                          onChange={(e) => {
                            setWeight(Number(e.target.value));
                          }}
                        />
                      )}
                      <InputDec text={unit === "kgcm" ? "kg" : "pounds"} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gender">
                      Gender:
                      {errors.gender && (
                        <p className="text-xs text-red-500">
                          {errors.gender.message}
                        </p>
                      )}
                    </Label>
                    <Select
                      onValueChange={(v) => setValue("gender", v as Gender)}
                      value={form.gender}
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
                </>
              ) : (
                <Selector
                  unit={unit}
                  form={form}
                  weight={weight}
                  setValue={setValue}
                  goalWeight={goalWeight}
                  setGoalWeight={setGoalWeight}
                  disabled={navigation.state === "submitting"}
                  // @ts-expect-error
                  error={errors.custom?.message?.goalWeight}
                />
              )}
              {currentStep === 1 && (
                <div className="flex w-full justify-between gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setCurrentStep(0)}
                  >
                    back
                  </Button>
                  <Button
                    type="submit"
                    disabled={navigation.state === "submitting"}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </div>
              )}
            </Form>
            {currentStep === 0 && (
              <div className="w-full p-2 flex justify-end">
                <Button
                  onClick={handleNext}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
