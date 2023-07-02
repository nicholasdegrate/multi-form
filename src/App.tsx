import { zodResolver } from "@hookform/resolvers/zod";
import {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ChevronLeft } from "react-feather";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { z } from "zod";
import { Button } from "./Button";
import { Input } from "./Input";

import clsx from "clsx";

const general = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const profile = z.object({
  email: z.string().email(),
  username: z.string().min(1),
});

const personal = z.object({
  apartment: z.string(),
  phone: z.string(),
});

export function App() {
  const { step } = useMultiFormContext();

  return (
    <Form
      className="min-h-screen w-full m-auto flex flex-col justify-center p-40"
      method="post"
    >
      <h1 className="text-right">{step}/3</h1>

      <GenericForm
        schema={general}
        idx={1}
        render={({ register, formState }, { store }) => {
          return (
            <div>
              <Input
                type="text"
                required
                placeholder="enter first name"
                {...register("firstName")}
              />
              <Input
                type="text"
                required
                placeholder="enter last name"
                {...register("lastName")}
              />
              <Button
                type="button"
                onClick={store}
                disabled={!formState.isValid}
              >
                next
              </Button>
            </div>
          );
        }}
      />
      <GenericForm
        schema={profile}
        idx={2}
        render={({ register, formState }, { store, prev }) => {
          return (
            <div>
              <Input
                type="email"
                autoComplete="email"
                required
                placeholder="enter email"
                {...register("email")}
              />
              <Input
                type="text"
                required
                placeholder="enter username"
                {...register("username")}
              />
              <div className="flex items-center justify-between space-x-2">
                <button
                  type="button"
                  className="p-2 border rounded-xl"
                  onClick={prev}
                >
                  <ChevronLeft />
                </button>
                <Button
                  type="button"
                  onClick={store}
                  disabled={!formState.isValid}
                >
                  next
                </Button>
              </div>
            </div>
          );
        }}
      />
      <GenericForm
        schema={personal}
        idx={3}
        render={({ register, formState }, { prev }) => {
          return (
            <div>
              <Input
                type="text"
                required
                placeholder="enter apartment"
                {...register("apartment")}
              />
              <Input
                type="tel"
                required
                placeholder="enter phone"
                {...register("phone")}
              />
              <div className="flex items-center justify-between space-x-2">
                <button
                  type="button"
                  className="p-2 border rounded-xl"
                  onClick={prev}
                >
                  <ChevronLeft />
                </button>
                <Button type="submit" disabled={!formState.isValid}>
                  submit
                </Button>
              </div>
            </div>
          );
        }}
      />
    </Form>
  );
}

type RenderProps = {
  store(): void;
  prev(): void;
  data: Record<string, unknown> | null;
};

type GenericFormProps<P extends FieldValues = FieldValues> = {
  schema: z.ZodType<P, any>;
  render(
    method: Exclude<UseFormReturn<P>, UseFormReturn["handleSubmit"]>,
    props: RenderProps
  ): ReactElement;
  idx: number;
};

function GenericForm<P extends FieldValues = FieldValues>({
  schema,
  render,
  idx,
}: GenericFormProps<P>) {
  const method = useForm<P>({
    resolver: zodResolver(schema),
  });

  const { store: upload, step, prev, data } = useMultiFormContext();

  const store = useCallback(() => {
    const data = method.getValues();
    upload(data);
  }, [method, upload]);

  return (
    <div className={clsx(idx !== step && "hidden")}>
      {render(method, { store, prev, data })}
    </div>
  );
}

type MultiFormContextState = {
  data: Record<string, unknown> | null;
  store(data: Record<string, unknown>): void;
  step: number;
  next(): void;
  prev(): void;
};

const MultiFormContext = createContext<MultiFormContextState>({
  data: {},
  store() {
    /* empty */
  },
  next() {
    /* empty */
  },
  prev() {
    /* empty */
  },
  step: 1,
});

type GenericMultiFormContextProps = {
  children: ReactNode;
};

export function GenericMultiFormContext({
  children,
}: GenericMultiFormContextProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  const next = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const store = useCallback(
    (info: Record<string, unknown>) => {
      setData((prev) => ({
        ...prev,
        ...info,
      }));
      next();
    },
    [next]
  );

  const prev = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  const state = useMemo(
    () => ({
      data,
      store,
      step,
      next,
      prev,
    }),
    [data, next, prev, step, store]
  );

  return (
    <MultiFormContext.Provider value={state}>
      {children}
    </MultiFormContext.Provider>
  );
}

function useMultiFormContext() {
  return useContext(MultiFormContext);
}
