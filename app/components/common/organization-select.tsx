import { useCallback, useState } from 'react';
import { OrganizationInfo } from '~/models/organization.model';
import { FormControl } from '../ui/form';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { ControllerRenderProps, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
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
import OrganizationTreeView from './organization-treeview';

type Props<T extends FieldValues> = {
  organizations: OrganizationInfo[];
  form: UseFormReturn<T, any, undefined>;
  fieldName: Path<T>;
  field: ControllerRenderProps<T, Path<T>>;
};

export default function OrganizationSelect<T extends FieldValues>({ organizations, form, field, fieldName }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [checkOrganization, setCheckOrganization] = useState<OrganizationInfo | undefined>(
    organizations.find((o) => o.pk === form.getValues(fieldName)),
  );

  const openChangeHandler = useCallback(
    (open: boolean) => {
      console.log('openChangeHandler');
      console.log(form.getValues(fieldName));
      setCheckOrganization(form.getValues(fieldName));
      setOpen(open);
    },
    [fieldName, form],
  );

  const submitHandler = useCallback(() => {
    form.setValue(fieldName, checkOrganization?.pk as PathValue<T, Path<T>>);
    openChangeHandler(false);
  }, [checkOrganization, fieldName, form, openChangeHandler]);

  return (
    <Dialog open={open} onOpenChange={openChangeHandler}>
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
          <DialogTitle>組織選択</DialogTitle>
          <DialogDescription>組織を一つ選択してください。</DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-auto px-6 py-1 border-y">
          <OrganizationTreeView
            organizations={organizations}
            checked={checkOrganization}
            onCheckChanged={setCheckOrganization}
          />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={submitHandler}>
            選択
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
