import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X, Link as LinkIcon, Loader2 } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

// Custom validation for URL that adds https:// if missing
const urlSchema = z.string()
  .transform(val => {
    // Check if the URL starts with http:// or https://
    if (!/^https?:\/\//i.test(val)) {
      // If not, prepend https://
      return `https://${val}`;
    }
    return val;
  })
  .refine(val => {
    try {
      new URL(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: 'Please enter a valid website address' });

const formSchema = z.object({
  url: urlSchema,
});

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleClearUrl = () => {
    form.reset({ url: '' });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.url);
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <div className="relative rounded-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          placeholder="example.com"
                          className="pl-10 pr-12"
                          {...field}
                        />
                        {field.value && (
                          <div className="absolute inset-y-0 right-0 flex items-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleClearUrl}
                              className="p-2 h-8 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <p className="text-sm text-gray-500 mt-1">Enter a website address - https:// will be added automatically if needed</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center">
              <Button 
                type="submit" 
                disabled={isLoading || !form.getValues().url}
                className="h-10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
