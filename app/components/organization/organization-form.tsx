import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { OrganizationInfo, OrganizationInput, organizationInputSchema } from '~/models/organization.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '~/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

type Props = {
  onSubmit: SubmitHandler<OrganizationInput>;
  organizations: OrganizationInfo[];
};

const OrganizationForm: React.FC<Props> = ({ onSubmit, organizations }) => {
  const form = useForm<OrganizationInput>({
    defaultValues: {
      name: '',
      priority: 0,
      parent: undefined,
    },
    resolver: zodResolver(organizationInputSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>親組織</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('justify-between', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? organizations.find((o) => o.pk === field.value)?.name : '親組織選択'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]">
                  <Command>
                    <CommandInput placeholder="Search Organization..." />
                    <CommandList>
                      <CommandEmpty>No Organization found.</CommandEmpty>
                      <CommandGroup>
                        {organizations.map((o) => (
                          <CommandItem
                            value={o.pk}
                            key={o.pk}
                            onSelect={() => {
                              form.setValue('parent', o.pk);
                              form.setValue('priority', o.priority + 1);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', o.pk === field.value ? 'opacity-100' : 'opacity-0')} />
                            {o.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>組織名</FormLabel>
              <FormControl>
                <Input placeholder="組織名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">新規作成</Button>
      </form>
    </Form>
  );
};

OrganizationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  organizations: PropTypes.array.isRequired,
};

export default OrganizationForm;
