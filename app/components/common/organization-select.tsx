import { useState } from 'react';
import { OrganizationInfo } from '~/models/organization.model';
import { FormControl } from '../ui/form';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type Props<T extends FieldValues> = {
  organizations: OrganizationInfo[];
  form: UseFormReturn<T, any, undefined>;
  field: ControllerRenderProps<T, Path<T>>;
};

export default function OrganizationSelect<T extends FieldValues>({ organizations, field }: Props<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn('justify-between', !field.value && 'text-muted-foreground')}
          >
            {field.value ? organizations.find((o) => o.pk === field.value)?.name : '組織選択'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">contents</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
