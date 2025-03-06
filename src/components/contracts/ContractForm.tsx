
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft, Save } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Contract type options
const contractTypes = [
  { id: "termite", label: "Termite" },
  { id: "rodent", label: "Rodent" },
  { id: "cockroach", label: "Cockroach" },
  { id: "mosquito", label: "Mosquito" },
  { id: "bedBug", label: "Bed Bug" },
  { id: "ant", label: "Ant" },
  { id: "other", label: "Other" },
];

// AMC frequency options
const amcFrequencies = [
  { id: "30", label: "30 Days", description: "Monthly service" },
  { id: "60", label: "60 Days", description: "Bi-monthly service" },
  { id: "90", label: "90 Days", description: "Quarterly service" },
  { id: "180", label: "180 Days", description: "Semi-annual service" },
  { id: "365", label: "365 Days", description: "Annual service" },
  { id: "custom", label: "One-Time Service", description: "No recurring contract" },
];

// Define form schema
const contractFormSchema = z.object({
  contractTypes: z.array(z.string()).min(1, "Select at least one contract type"),
  amcFrequency: z.string().min(1, "Select an AMC frequency"),
  lastServiceDate: z.date({
    required_error: "Please select the last service date",
  }),
  amount: z.string().min(1, "Enter a valid amount"),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export function ContractForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      contractTypes: [],
      amcFrequency: "",
      lastServiceDate: new Date(),
      amount: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: ContractFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit to an API
      console.log("Form data:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Contract created successfully",
        description: "The new contract has been created.",
      });
      
      // Redirect to the contracts list
      navigate("/contracts");
    } catch (error) {
      toast({
        title: "Error creating contract",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-scale-in">
        <Card>
          <CardHeader>
            <CardTitle>Create Contract</CardTitle>
            <CardDescription>
              Set up a new contract or AMC for your client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="contractTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Contract Types</FormLabel>
                    <FormDescription>
                      Select the types of pest control services for this contract.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {contractTypes.map((type) => (
                      <FormField
                        key={type.id}
                        control={form.control}
                        name="contractTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type.id}
                              className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, type.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== type.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {type.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amcFrequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>AMC Frequency</FormLabel>
                  <FormDescription>
                    Select how often the service should be performed.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      {amcFrequencies.map((frequency) => (
                        <FormItem key={frequency.id} className="space-y-0">
                          <FormLabel className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value={frequency.id} />
                            </FormControl>
                            <div className="space-y-1">
                              <p className="font-medium leading-none">{frequency.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {frequency.description}
                              </p>
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lastServiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Service Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <CustomButton
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </CustomButton>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When was the service last performed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the total amount for this contract.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <CustomButton
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate(-1)}
            >
              Back
            </CustomButton>
            <CustomButton
              type="submit"
              leftIcon={<Save className="h-4 w-4" />}
              isLoading={isSubmitting}
            >
              Create Contract
            </CustomButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
